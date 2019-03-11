gibddLink = 'https://xn--90adear.xn--p1ai/request_main'


chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  let url = tabs[0].url;
  if (url != gibddLink) {
    alert('Вы будете перенаправлены на сайт ГИБДД. Ознакомьтесь с информацией на странице и нажмите на кнопку "Подать обращение". После этого, еще раз нажмите на иконку плагина для формирования обращения по правонарушению')

    chrome.tabs.create({ url: gibddLink, active: true }, (tab) => {
    });
  } else {
    document.getElementById('content').style.display = 'block'
  }
});

let model = {
  type: 1,
  date: "",
  address: "",
  auto_type: "",
  auto_sign: "",
  second_name: "",
  first_name: "",
  middle_name: "",
  email: "",
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
  date = date.toLocaleString("ru", options)
  return date
}



function getMessageText (model) {
  let messageTexts = {
    1: 'двигался с нарушением требований, предписаных дорожными знаками и разметкой, создавая тем самым аварийную обстановку. Прошу привлечь к административной ответственности водителя указанного транспортного средства в соответствии с П.2 ст.12.16 КоАП и принять меры по предотвращению массового игнорирования дорожных знаков на данном участке дороги',
    2: 'двигался с нарушением требований, предписаных дорожными знаками и разметкой, создавая тем самым аварийную обстановку. Прошу привлечь к административной ответственности водителя указанного транспортного средства в соответствии с П.2 ст.12.16 КоАП и принять меры по предотвращению массового игнорирования дорожных знаков на данном участке дороги',
    3: 'осуществил поворот, не заняв заблаговременно крайнее положение, создавая тем самым аварийную обстановку. Прошу привлечь к административной ответственности водителя указанного транспортного средства в соответствии с П.1 ст.12.14 КоАП',
    4: 'осуществил стоянку на тротуаре, создавая тем самым помеху для движения пешеходов. Прошу привлечь к административной ответственности водителя указанного транспортного средства в соответствии со ст.12.19 КоАП',
    5: 'осуществил стоянку на пешеходном переходе, создавая тем самым помеху для движения пешеходов и потенциально аварийную обстановку. Прошу привлечь к административной ответственности водителя указанного транспортного средства в соответствии со ст.12.19 КоАП',
    6: 'осуществил стоянку на расстоянии менее 5 метров от пешеходного перехода, создавая тем самым помеху для движения пешеходов и потенциально аварийную обстановку. Прошу привлечь к административной ответственности водителя указанного транспортного средства в соответствии со ст.12.19 КоАП'
  };

  let {type, date, address, auto_type, auto_sign} = model
  date = formatDate(date)
  let messageText = messageTexts[type];
  return `${date} по адресу ${address} автомобиль ${auto_type} (Государственный регистрационный номер ${auto_sign}) ${messageText}`
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
    chrome.tabs.sendMessage(tabs[0].id, Object.assign({message}, model));
  });
};


