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

$('#date').datepicker({
  language: "ru",
  format: "dd.mm.yyyy"
});

function formatDate(date) {
  if (date == '') {
    return ''
  }
  date = date.split('.')
  date = new Date(date[2], date[1] - 1, date[0])
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  console.log(date)
  date = date.toLocaleString("ru", options)
  return date
}

function getMessageText (model) {
  let {type, date, address, auto_type, auto_sign} = model
  date = formatDate(date)
  if (type == 1) {
    return `${date} по адресу ${address} автомобиль ${auto_type} (Государственный регистрационный номер ${auto_sign}) двигался с нарушением предписания знака 5.15.1 "Направление движения по полосам" создавая тем самым аварийную обстановку. Прошу привлечь к ответственности административной водителей указанных транспортных средств в соответствии с Ч.2 ст.12.16 КоАП и принять меры по предотвращению массового игнорирования дорожных знаков на данном участке дороги`
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
    document.getElementById(key).value = model[key]
  }
  fillMessage()
})


messageField.onchange = () => {
  message = messageField.value
}

sendBtn.onclick = function () {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.storage.sync.get({
      second_name: '',
      first_name: '',
      middle_name: '',
      email: '',
    }, (options) => {
      chrome.tabs.sendMessage(tabs[0].id, Object.assign({message}, options));
    })
  });
};


