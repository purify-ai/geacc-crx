# Geacc Chrome Extension

This Google Chrome extension uses [Geacc pre-trained model](https://github.com/purify-ai/geacc-models/) (MobileNetV2) and TensorFlow.js to detect and block explicit images. All inference performed in browser.

Extension downloads the model on start. Once initialised, it blurs explicit images and automatically adds badge overlay containing prediction results to images on hover.

All images larger than 119px analysed. However, badges only displayed if the image loaded through `<img>` tag. Sometimes it fails to add badge when there is some fancy js manipulation used on the page, or image loaded through data URI or CSS background style.

The extension also can collect URLs of misclassified images (currently only false positives) which can be used to improve the model.

## Building from source

```sh
npm i
npm run build
```

This command generates a `dist/` folder which contains the build artifacts.

To load the extension to Google Chrome:
- Open Google Chrome "Extensions" page
- Enable developer mode
- Click [LOAD UNPACKED] button
- Select `dist/` folder contents
- Hover over images on web pages to display image classification results.

## Development

When building for development and troubleshooting purposes, use the following command:

```sh
npm run build-dev
```

It disables uglify and minify steps so you can see readable code.

## Examples

Google Images

![alt text](examples/googleimages.png?raw=true "Google Images results with Geacc")

Pinterest

![alt text](examples/pinterest.png?raw=true "Pinterest results with Geacc")

## License
Source code is licensed under [Apache License 2.0](LICENSE)