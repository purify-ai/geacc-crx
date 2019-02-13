// Global vars
var localState = {
	debug: false,
	lang: 'en',
	domain: 'www',
	hasBadge: false,
	observer: {},
	meta: {}
}

const getVisible = {
    initWidth: 2000,
    maxIterations: 3
}

const overlayStyle = {
	string: {
		"benign": "Safe",
		"malign": "Unsafe"
	},
	style: [
		// base rules for all Save buttons
		'border-radius: 3px',
		'text-indent: 20px',
		'width: auto',
		'padding: 0 4px 0 0',
		'text-align: center',
		'font: 11px/20px "Helvetica Neue", Helvetica, sans-serif',
		'font-weight: bold',
		'color: #fff',
		'background: #230023 url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OTMiIGhlaWdodD0iNDkzIiB2aWV3Qm94PSIwIDAgNDkzIDQ5MyI+CiAgPG1ldGFkYXRhPjw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIvPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz48L21ldGFkYXRhPgo8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIGZpbGwtcnVsZTogZXZlbm9kZDsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPHBhdGggaWQ9IkxvZ28iIGNsYXNzPSJjbHMtMSIgZD0iTTI0Ni41LDQ5MkMxMTAuOTE0LDQ5MiwxLDM4Mi4wODYsMSwyNDYuNVMxMTAuOTE0LDEsMjQ2LjUsMSw0OTIsMTEwLjkxNCw0OTIsMjQ2LjUsMzgyLjA4Niw0OTIsMjQ2LjUsNDkyWk0yNDcsMzZDMTMwLjQ2OCwzNiwzNiwxMzAuNDY4LDM2LDI0N0EyMTAuMTI4LDIxMC4xMjgsMCwwLDAsODQsMzgwLjk4OVYzMTJhMzUuMDA3LDM1LjAwNywwLDAsMSwyNS4yNDEtMzMuNjExYzEuNTU3LTIuNSwxLjg2Ni02LjEzNywxLjkxNC04LjA2N2EzNC41MDcsMzQuNTA3LDAsMSwxLDI3Ljk2Ni0uNTcyLDE5LjA0OSwxOS4wNDksMCwwLDAsMS42ODgsNy41ODdBMzUuMDE3LDM1LjAxNywwLDAsMSwxNjksMzAwLjR2LTkuNzU0YTQ1LjU3Myw0NS41NzMsMCwwLDEsMzIuNzg1LTQzLjc3MmMyLjAyMS0zLjI1OCwyLjQyMy03Ljk5MiwyLjQ4Ni0xMC41MDZhNDQuODIyLDQ0LjgyMiwwLDEsMSwzNi4zMjMtLjc0NSwyNC44OTIsMjQuODkyLDAsMCwwLDIuMTkyLDkuODgxQTQ1LjUzNiw0NS41MzYsMCwwLDEsMjgxLDI4MS4xNTd2LTE1LjM4YTU0LjM3NCw1NC4zNzQsMCwwLDEsMzkuMTY4LTUyLjIxNGMyLjQxNS0zLjg4NywyLjg5NS05LjUzNCwyLjk3LTEyLjUzMmE1My41NDYsNTMuNTQ2LDAsMSwxLDQzLjQtLjg4OWMwLjA2OSwyLjMuNDY3LDcuNiwyLjYxOSwxMS43ODZBNTQuMzU0LDU0LjM1NCwwLDAsMSw0MTYsMjY1Ljc3N1YzNzMuMzM2QTIxMC4wNDgsMjEwLjA0OCwwLDAsMCw0NTgsMjQ3QzQ1OCwxMzAuNDY4LDM2My41MzIsMzYsMjQ3LDM2WiIvPgo8L3N2Zz4K) 3px 50% no-repeat',
		'background-size: 14px 14px',
		// extra rules for extensions only
		'position: absolute',
		'opacity: 1',
		'z-index: 8675309',
		'display: none',
		'cursor: pointer',
		'border: none',
		'font-weight: bold',
		'-webkit-font-smoothing: antialiased',
		'-moz-osx-font-smoothing: grayscale'
	],
	offset: {
		top: 10,
		left: 10
	}
}

// Structure: button and iframe overlays will live here
var overlaysMeta = {};

// Temporary store of the prediction results
var imageMeta = {};

// context click will use this image
function checkImage(o) {
	let r, f, i;
	// an array of functions to be run in order
	f = [
		// be sure we have an image
		() => {
			if (!o.img) { return true; }
		},
		// be sure our image has a source
		() => {
			if (!o.img.currentSrc) { return true; }
		},
		// be sure our source comes from a server so we can verify
		() => {
			if (!o.img.currentSrc.match(/^http/) && !o.img.currentSrc.match(/^data/)) { return true; }
		},
		// be sure height AND width are greater than 90px
		() => {
			if (o.img.naturalHeight < 90 || o.img.naturalWidth < 90) { return true; }
		},
		// if we're at least 90x90, check that height OR width > 119
		() => {
			if (o.img.naturalHeight > 119 || o.img.naturalWidth > 119) { return false; } else { return true; }
		},
		// some images are resized using img.height and img.width; don't hover over these if they are too small
		() => {
			if (o.img.height < 90 || o.img.height < 90) { return true; }
		},
		// if we're at least 90x90, check that height OR width > 119
		() => {
			if (o.img.height > 119 || o.img.height > 119) { return false; } else { return true; }
		},
		// don't offer on images that are more than 3x wider than they are tall
		() => {
			if (o.img.naturalHeight < o.img.naturalWidth / 3) { return true; }
		}
	];

	// assume the image is good
	r = false;

	// if r turns true at any point, quit checking
	for (i = 0; i < f.length; i = i + 1) {
		r = f[i](o);
		if (r) {
			break;
		}
	}

	return r;
}

// Visually modify malign images
function modifyMalignImage(el, meta) {
	if (meta.predictions[0].className === "malign") {
		el.style.filter = "blur(2px) opacity(.4)";
		el.style.WebkitFilter = "blur(2px) opacity(.4)";
	}
}

// set a DOM property or text attribute
function set(o) {
	if (typeof o.el[o.att] === 'string') {
		o.el[o.att] = o.string;
	} else {
		o.el.setAttribute(o.att, o.string);
	}
}

// hide hoverbuttons
function hide() {
	// this timeout is global, so we can cancel it when we're over the image and we move over the button
	localState.hazFade = window.setTimeout(() => {
		overlaysMeta.badge.style.display = 'none';
		localState.hasBadge = false;
	}, 10);
}

// create a DOM element
function make(o) {
	var el = false, t, a, k;
	for (t in o) {
		el = document.createElement(t);
		for (a in o[t]) {
			if (typeof o[t][a] === 'string') {
				el.setAttribute
				set({ el: el, att: a, string: o[t][a] });
			} else {
				if (a === 'style') {
					for (k in o[t][a]) {
						el.style[k] = o[t][a][k];
					}
				}
			}
		}
		break;
	}
	return el;
}

// get the position of a DOM element
function getPos(o) {
	var rect = o.el.getBoundingClientRect();
	var r_top = rect.top + window.scrollY;
	var r_left = rect.left + window.scrollX;
	return {top: r_top, left: r_left};
}

// return an event's target element
function getEl(e) {
	var r = e.target;
	// text node; return parent
	if (r.targetNodeType === 3) {
		r = r.parentNode;
	}
	return r;
}

// get image data for button
function getImageData(img) {
	let r = {};
	r.className = img.dataset.gearsPredictionClassname || 'Unknown';
	r.probability = img.dataset.gearsPredictionProbability || '0';
	r.url = document.URL;
	return r;
}

// set image data
function setImageData(img, meta) {
	set({ el: img, att: 'data-gears-prediction-classname', string: overlayStyle.string[meta.predictions[0].className] });
	set({ el: img, att: 'data-gears-prediction-probability', string: meta.predictions[0].probability.toFixed(4) });
}

// Add prediction results metadata to the image
function setImagePredictionResults() {
	const images = document.getElementsByTagName('img');
	const keys = Object.keys(imageMeta);

	for (u = 0; u < keys.length; u++) {
		var url = keys[u];
		var meta = imageMeta[url];

		for (i = 0; i < images.length; i++) {
			var img = images[i];
			if (img.currentSrc === meta.url) {
				// bypass mouseover
				img.style.pointerEvents = "all";
				eventThief = img.closest("A");
				if (eventThief && eventThief.tagName) {
					eventThief.style.pointerEvents = "none";
				}

				// set prediction data in IMG tag
				setImageData(img, meta);

				// visually modify Malign images
				modifyMalignImage(img, meta);
				delete keys[u];
				delete imageMeta[url];
			}
		}
	}
}

// On mouse over, show prediction results
function showImagePredictionResults(e) {
	var pos, el = getEl(e);

	if (el && el.tagName) {
		localState.hasBadgeOver = false;
		if (el === overlaysMeta.badge) {
			// we won't allow our overlays to render unless we have a click AND our mouse is over the button
			localState.hasBadgeOver = true;
			// we've just moved from inside an image to the visible button
			// stop hiding the button and exit
			window.clearTimeout(localState.hazFade);
		} else {
			if (el.tagName === 'IMG') {
				if (!el.currentSrc.match(/^((http|https):\/\/)/)) {
					overlaysMeta.badge.style.display = 'none';
				} else {
					if (!checkImage({ img: el })) {
						localState.hoverImage = el;
						pos = getPos({ el: el });
						if (!localState.nohover) {
							// append to body on first hover over eligible image
							if (!localState.bodyHasBadge) {
								document.body.appendChild(overlaysMeta.badge);
								localState.bodyHasBadge = true;
							}
							overlaysMeta.badge.style.top = pos.top + overlayStyle.offset.top + 'px';
							overlaysMeta.badge.style.left = pos.left + overlayStyle.offset.left + 'px';
							overlaysMeta.badge.style.display = 'block';

							var imgData = getImageData(el);
							overlaysMeta.badge.textContent = imgData.className + ' ' + imgData.probability;
							
							localState.hasBadge = true;
						}
					}
				}
			}
		}
	}
}

// mouse out
function hideImagePredictionResults(e) {
	var el = getEl(e);
	// if we have hoverbuttons
	if (localState.hasBadge) {
		// hide if we did not just exit one of them
		if (el !== overlaysMeta.badge) {
			hide();
		}
	}
}

// Listen to newly loaded image events from backend and update prediction metadata
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message && message.payload && message.action === 'IMAGE_PROCESSED') {
		const { payload } = message;
		if (payload && payload.url) {
			imageMeta[payload.url] = payload;
			setImagePredictionResults();
		}
	}
});

// make button
overlaysMeta.badge = make({
	'SPAN': {
		'innerText': 'Unknown'
	}
});
overlaysMeta.badge.setAttribute('style', overlayStyle.style.join('!important;'));

// make button
window.addEventListener('load', setImagePredictionResults, false);
window.addEventListener('mouseover', showImagePredictionResults);
window.addEventListener('mouseout', hideImagePredictionResults);