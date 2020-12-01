console.log('check')

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('inside')
    chrome.tabs.create({url: chrome.extension.getURL('popup.html')});
});