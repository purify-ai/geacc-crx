import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';

const CLASS_NAMES = {
	0: 'benign',
	1: 'malign',
}

const MOBILENET_MODEL_PATH = 'http://data.purify.ai/models/geacc-visual/tfjs/mobilenetv2-224/model.json?ref=crx';
const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 1;

class BackgroundProcessing {

	constructor() {
		this.imageRequests = {};
		this.falsePositiveURLs = [];
		this.addListeners();
		this.loadModel();
	}

	addListeners() {
		// Event listener which triggers image classification when a new image loaded
		chrome.webRequest.onCompleted.addListener(req => {
			if (req && req.tabId > 0) {
				this.imageRequests[req.url] = this.imageRequests[req.url] || req;
				this.analyzeImage(req.url);
			}
		}, { urls: ["<all_urls>"], types: ["image", "object"] });

		// Event listeners which triggered by popup window
		chrome.runtime.onMessage.addListener( (obj, sender, sendResponse) => {
			if (obj) {
				if (obj.method == 'getFalsePositiveURLs') {
					sendResponse(this.falsePositiveURLs);
				} else if (obj.method == 'cleanupFalsePositiveURLs') {
					this.falsePositiveURLs.length = 0;
					sendResponse(true);
				}
			}
			return true; // remove this line to make the call sync!
		});
	}

	// Load TFJS model
	async loadModel() {
		console.log('Loading model...');
		const startTime = performance.now();
		this.model = await tf.loadModel(MOBILENET_MODEL_PATH);
		this.model.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

		const totalTime = Math.floor(performance.now() - startTime);
		console.log(`Model loaded and initialized in ${totalTime}ms...`);
	}

	// Load image
	async loadImage(src) {
		return new Promise(resolve => {
			var img = document.createElement('img');
			img.crossOrigin = "anonymous";
			img.onerror = function (e) {
				resolve(null);
			};
			img.onload = function (e) {
				if ((img.height && img.height > 119) || (img.width && img.width > 119)) {
					// Set image size for tf!
					img.width = IMAGE_SIZE;
					img.height = IMAGE_SIZE;
					resolve(img);
				}
				// skip tiny images
				resolve(null);
			}
			img.src = src;
		});
	}

	// Get TOP K classes.
	// TODO: Simplify as we use binary classification and need only TOP-1
	async getTopKClasses(logits, topK) {
		const values = await logits.data();
		const valuesAndIndices = [];
		for (let i = 0; i < values.length; i++) {
			valuesAndIndices.push({ value: values[i], index: i });
		}
		valuesAndIndices.sort((a, b) => {
			return b.value - a.value;
		});
		const topkValues = new Float32Array(topK);
		const topkIndices = new Int32Array(topK);
		for (let i = 0; i < topK; i++) {
			topkValues[i] = valuesAndIndices[i].value;
			topkIndices[i] = valuesAndIndices[i].index;
		}

		const topClassesAndProbs = [];
		for (let i = 0; i < topkIndices.length; i++) {
			topClassesAndProbs.push({
				className: CLASS_NAMES[topkIndices[i]],
				probability: topkValues[i]
			})
		}
		return topClassesAndProbs;
	}

	// Predict image class using TFJS
	async predict(imgElement) {
		console.log('Predicting...');
		const startTime = performance.now();
		const logits = tf.tidy(() => {
			const img = tf.browser.fromPixels(imgElement).toFloat();
			const offset = tf.scalar(127.5);
			const normalized = img.sub(offset).div(offset);
			const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
			return this.model.predict(batched);
		});

		// Convert logits to probabilities and class names.
		const predictions = await this.getTopKClasses(logits, TOPK_PREDICTIONS);
		const totalTime = Math.floor(performance.now() - startTime);
		console.log(`Prediction done in ${totalTime}ms:`, predictions);
		return predictions;
	}

	// Predict image class and notify content script when done
	async analyzeImage(src) {

		// Check if TFJS model has been successfully loaded
		if (!this.model) {
			console.log('Model not loaded yet, delaying...');
			setTimeout(() => { this.analyzeImage(src) }, 5000);
			return;
		}

		var meta = this.imageRequests[src];
		if (meta && meta.tabId) {
			if (!meta.predictions) {
				const img = await this.loadImage(src);
				if (img) {
					// Predict image class
					meta.predictions = await this.predict(img);
				}
			}

			if (meta.predictions) {
				// Collect false positives
				if (meta.predictions[0].className === "malign") {
					this.falsePositiveURLs.push(meta.url);
				}

				// Send prediction results to the content script
				chrome.tabs.sendMessage(meta.tabId, {
					action: 'IMAGE_PROCESSED',
					payload: meta,
				});
			}
		}
	}
}

var bg = new BackgroundProcessing();