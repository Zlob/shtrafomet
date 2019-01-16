let message = document.querySelector('[name=message]')

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    message.value = request.message
  });