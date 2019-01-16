let model = {
  type: 1,
  date: "",
  address: "",
  auto_type: "",
  auto_sign: "",
}

let message = ""

let sendBtn = document.getElementById('send-btn');
let messageField = document.getElementById('message')
let fields = document.querySelectorAll('.field')



function getMessageText (model) {
  let {type, date, address, auto_type, auto_sign} = model
  if (type == 1) {
    return `${date} на ${address} автомобиль ${auto_type} (Гос номер ${auto_sign}) двигался с нарушением предписания знака 5.15.1 "Направление движения по полосам" создавая тем самым аварийную обстановку. Прошу привлечь к ответственности административной водителей указанных транспортных средств в соответствии с Ч.2 ст.12.16 КоАП и принять меры по предотвращению массового игнорирования дорожных знаков на данном участке дороги`
  }
}

function fillMessage() {
  message = getMessageText(model)
  messageField.value = message
}

function synchronize() {
  let name = this.id
  //set model
  model[name] = this.value
  //set storage
  let property = {}
  property[name] = this.value
  chrome.storage.local.set(property)
  //set result
  fillMessage()
}

//observe fields changes
fields.forEach(el => {
  el.onchange = synchronize
  el.oninput = synchronize
})

//init model from store
chrome.storage.local.get(Object.keys(model), (result) => {
  for (let key in model) {
    model[key] = result[key] || model[key]
    document.querySelector('#'+key).value = model[key]
  }
  fillMessage()
})


messageField.onchange = () => {
  message = messageField.value
}

sendBtn.onclick = function () {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message});
  });
};


