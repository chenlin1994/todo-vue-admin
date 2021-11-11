let files  = require.context("./modules",true,/.vue$/)
let components = []
console.log('files=>>',files)
console.log('type=>>',typeof files)
files.keys().forEach(key=>{
  components.push(files(key).default)
})
export default {
  install: function(Vue) {
    for (let component of components) {
      Vue.component(component.name, component)
    }
  },
}
