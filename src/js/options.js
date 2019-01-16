let model = {
  second_name: "",
  first_name: "",
  middle_name: "",
  email: "",
}

let fields = document.querySelectorAll('.field')


function synchronize() {
  let name = this.id
  //set model
  model[name] = this.value
  //set storage
  let property = {}
  property[name] = this.value
  chrome.storage.sync.set(property)
}

//observe fields changes
fields.forEach(el => {
  el.onchange = synchronize
  el.oninput = synchronize
})

//init model from store
chrome.storage.sync.get(Object.keys(model), (result) => {
  for (let key in model) {
    model[key] = result[key] || model[key]
    document.getElementById(key).value = model[key]
  }
})
