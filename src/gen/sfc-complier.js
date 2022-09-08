import Vue from 'vue'
import { compiler } from '../vendor'
import lucidIcons from '@dingdaoos/lucid-icons'

import resources from '@/import-map.json'

console.log(resources)

Vue.prototype.$icons = lucidIcons

export class SfcComplier {
  constructor ({
    el = '',
    emits
  }) {
    this.el = el
    this.code = ''

    this.component = undefined

    this.template = ''
    this.script = ''
    this.style = ''

    this.emitError = emits?.emitError

    this.errorCatcher()
  }

  errorCatcher () {
    const that = this
    Vue.config.errorHandler = function (err, vm, info) {
      console.log('err', err, info)
    }
  }

  compiler (code) {
    this.code = code
    this.parseError = ''
    if (!this.code) return false

    const parsedCode = compiler.parseComponent(this.code)
    const { template, script, styles } = parsedCode

    this.template = template ? template?.content.trim() : ''

    let scriptCode = script ? script?.content.trim() : ''
    scriptCode = scriptCode.replace(
      /export\s+default/,
      "scriptCode ="
    )

    try {
      eval(scriptCode)
    } catch (err) {
      this.parseError = err
    }
    
    this.emitError && this.emitError(this.parseError)

    if (this.parseError) return false
    
    this.script = scriptCode

    return this
  }

  dynamicResourceHanlder () {
    const loaded = 0
    const resKeys = Object.keys(resources)

    resKeys.forEach(key => {
      const ext = resources[key].split('.').slice(-1)
      console.log(ext)
      if (ext === 'js') {

      }
    })
  }

  loadJs (name, src) {
    const target = document.createElement('script')
    target.src = src
    document.body.appendChild(target)

    target.onload = function () {
      Vue.use(name)
    }
  }



  extend () {

    this.dynamicResourceHanlder()

    var a = document.createElement('script')
    a.src = 'https://lucent.dev.dingdaoos.com/lucid-ui/lucid-ui.umd.js'
    document.body.appendChild(a)

    const that = this

    a.onload = function () {
      console.log(window, window.LUCID)
      Vue.use(LUCID)
      that.component = Vue.extend({
        template: that.template,
        ...that.script
      })
      that.mount()
    }
  }

  mount () {
    const mountVm = new this.component().$mount()
    this.el.innerHTML = ''
    this.el.appendChild(mountVm.$el)
    return this
  }
}