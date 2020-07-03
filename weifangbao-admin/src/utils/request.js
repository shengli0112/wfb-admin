import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'

const http = axios.create({
  baseURL: window.SITE_CONFIG['apiURL'],
  timeout: 1000 * 180,
  withCredentials: false
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers['token'] = Cookies.get('token') || ''
  config.headers['key'] = SITE_CONFIG['OPEN_API_KEY'] || ''
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if ((''+response.data.code).indexOf('401') === 0) {

    // clearLoginInfo()
    router.replace({ name: 'login' })
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return window.SITE_CONFIG['apiURL'] + actionName
}
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = false) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = false, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return data
  // return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
