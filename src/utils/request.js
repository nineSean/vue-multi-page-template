import axios from 'axios'
import envVariable from './configs'


const request = axios.create({
  baseURL: envVariable.url,
  timeout: 5000,
})

request.interceptors.request.use(config => {
  console.log('request config', config)
  return config
}, error =>{
  console.log('request error')
  return Promise.reject(error)
})

request.interceptors.response.use( response => {
  console.log('response interceptor', response)
  return response
}, error => {
  console.log('response error', error)
  return Promise.reject(error)
})

export default request