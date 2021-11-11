import { postAction, getAction, putAction, deleteAction } from '@/utils/network'
import qs from 'qs'
import Vue from 'vue'
let methods = {
  post: postAction,
  get: getAction,
  put: putAction,
  delete: deleteAction,
}
export async function adapter(method, url, obj = {}) {
  let { data, success, msg,code } = await methods[method](url, obj)
  if (!success || code!=0) {
    Vue.prototype.$message.error(msg || '检查接口地址')
  }
  return success ? data : null
}

// getAction
export const getDemo = async (params) => {
  return Promise.resolve(
    await adapter(
      'get',
      `/url?${(qs.stringify(params), { arrayFormat: 'repeat' })}`
    )
  )
}

//  postAction
export const postDemo = async (obj) => {
  return Promise.resolve(await adapter('post', `/url`, obj))
}

// putAction
export const putDemo = async (obj) => {
  return Promise.resolve(await adapter('put', `/url`, obj))
}

// deleteAction
export const deleteDemo = async (obj) => {
  return Promise.resolve(await adapter('delete', `url?${qs.stringify(obj)}`))
}

// getAction use dynamic url
export const getList = async (url, params = {},method='get') => {
  return Promise.resolve(await adapter(method, url, params))
}
