function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

function callEventPageMethod(method, data, callback) {
    chrome.runtime.sendMessage({ method: method, data: data }, function (response) {
        if(typeof callback === "function") callback(response);
    });
}

document.getElementById("copy-urls").onclick = function() {
    // retrieve an array of FP URLs and copy to clipboard
    callEventPageMethod('getFalsePositiveURLs', '', function (falsePositiveURLs) {
        var el = document.createElement("textarea");
        el.value = falsePositiveURLs.join("\n");
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        try {
            document.execCommand('copy');
            updateStatus('Copied ' + falsePositiveURLs.length + ' URLs');
        } catch (err) {
            updateStatus('Unable to copy ' + falsePositiveURLs.length + ' URLs');
        }
        document.body.removeChild(el);
    });
}

document.getElementById("clean-urls").onclick = function() {
    // cleanup buffered FP URLs
    callEventPageMethod('cleanupFalsePositiveURLs', '', function (result) {
        if (result === true) {
            updateStatus("Cleaned up all URLs");
        } else {
            updateStatus("Something went wrong");
        }
    });
}