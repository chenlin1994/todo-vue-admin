import moment from 'moment'
import { stringify } from 'qs'
import _ from 'lodash'
export function formatTime(model = 'YYYY-MM-DD', timestamp) {
  return moment(timestamp).format(model)
}
/**
 * 防抖
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout
  return function() {
    const context = this
    const args = [...arguments]
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
/**
 * 节流
 * @param {Function} method
 * @param {Number} delay
 * @param {Number} duration
 */
export function throttle(method, delay, duration) {
  var timer = null
  var begin = new Date()
  return function() {
    var context = this,
      args = arguments
    var current = new Date()
    clearTimeout(timer)
    if (current - begin >= duration) {
      method.apply(context, args)
      begin = current
    } else {
      timer = setTimeout(function() {
        method.apply(context, args)
      }, delay)
    }
  }
}
/**
 * 获取随机数
 */
export function getRandomString() {
  return Math.random()
    .toString(36)
    .substring(2)
}
/**
 * 数组对象根据对象数据唯一值去重
 * @param {Array} arr
 * @param {String} field
 */
export function removeRepeat(arr, field) {
  let s = {}
  for (let i = 0; i < arr.length; i++) {
    s[arr[i][field]] = arr[i]
  }
  return Object.values(s)
}
/**
 * 去除空字段
 * @param {Object} obj
 */
export function removeFields(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && [undefined, null, ''].includes(obj[key])) {
      delete obj[key]
    }
  }
  return obj
}
/**
 * 对象更换键名
 * @param {Object} obj
 * @param {Object} keyMap  {旧key:新key  }
 */
export function transferByKeymap(obj, keyMap) {
  if (JSON.stringify(keyMap) == '{}') {
    return obj
  }
  let returnObj = {}
  let keys = Object.keys(keyMap)
  for (var i of keys) {
    returnObj[keyMap[i]] = obj[i]
  }
  return returnObj
}
/**
 *
 * 获取query参数
 * @param {String} str
 */
export function getQueryParams(str) {
  let obj = {}
  let reg = /([^?=&#]+)=([^?=&#]+)/g
  str.replace(reg, function() {
    obj[arguments[1]] = arguments[2]
  })
  return obj
}
/**
 *
 * 返回数据类型
 * @param {*} data
 */
export function dataType(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}
/**
 * 检测对象是否含有某个属性
 * @param {Object} obj
 * @param {String|Number} attr
 */
export function checkObjHasAttr(obj, attr) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
/**
 * canvas下载图片
 * @param {String} imgSrc
 * @param {String} name
 */
export function defaultImage(imgSrc, name) {
  let image = new Image()
  // 处理canvas跨域问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function() {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png')
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = name || 'image'
    a.href = url
    a.dispatchEvent(event)
    ;(a = null), (canvas = null)
  }
  image.src = imageSrc
}

export function emptyCheck(value) {
  return _.isEmpty(value)
}
export const testEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i
// 类型检查
export function typeOf(obj) {
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase()
}
// 数组(基本类型)去重
export function unique(arr) {
  return Array.from(new Set(arr))
}
// 获取url的query生成对象
export function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1] // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split('&') // 将字符串以 & 分割后存到数组中
  let paramsObj = {}
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split('=') // 分割 key 和 value
      val = decodeURIComponent(val) // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val)
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true
    }
  })
  return paramsObj
}
// 往前填充
export function padStart(val, seat, length) {
  return String(val).padStart(length - String(val).length, seat)
}
// 往后填充
export function padEnd(val, seat, length) {
  return String(val).padEnd(length - String(val).length, seat)
}
