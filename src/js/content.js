let second_name = document.querySelector('[name=surname]')
let first_name = document.querySelector('[name=firstname]')
let middle_name = document.querySelector('[name=patronymic]')
let email = document.querySelector('[name=email]')
let message = document.querySelector('[name=message]')

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    second_name.value = request.second_name
    first_name.value = request.first_name
    middle_name.value = request.middle_name
    email.value = request.email
    message.value = request.message
  });