let modelFields = {
  type: 1,
  date: "",
  address: "",
  auto_type: "",
  auto_sign: "",
  message: ""
}

let sendBtn = document.getElementById('send-btn');
let messageField = document.getElementById('message')
let fields = document.querySelectorAll('.field')

function getMessageText (model) {
  let {type, date, address, auto_type, auto_sign} = model
  if (type == 1) {
    return `${date} на ${address} автомобиль ${auto_type} (Гос номер ${auto_sign}) двигался с нарушением предписания знака 5.15.1 "Направление движения по полосам" создавая тем самым аварийную обстановку. Прошу привлечь к ответственности административной водителей указанных транспортных средств в соответствии с Ч.2 ст.12.16 КоАП и принять меры по предотвращению массового игнорирования дорожных знаков на данном участке дороги`
  }
}

//observe fields changes
fields.forEach(el => {
  let name = el.id
  el.onchange = (() => {
    model[name] = el.value
    let property = {}
    property[name] = el.value
    chrome.storage.local.set(property)
    let message = getMessageText(model)
    model.message = message
    messageField.value = message
  })
})

//init model from store
chrome.storage.local.get([model.keys()], (result) => {
  for (let key in model.keys()) {
    model[key] = result[key] || model[key]
    document.querySelector('#'+key).value = model[key]
  }
})






messageField.onchange = (el) => {
  model.message = messageField.value
}

sendBtn.onclick = function (element) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, model, function (response) {
      console.log('Done');
    });
  });
};


