
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

//
function fetchLogin(params: {
  email?: string
  username?: string
  phone?: string
  password: string
}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    //webapi
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.auth.login(params).then((user: any) => {
        resolve(user)
      }).catch((err: any)=>{
        // HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      let addr = null
      if(params.email){
        addr = 'email'
      }
      if(params.username){
        addr = 'username'
      }
      if(params.phone){
        addr = 'phone'
      }
      // if(params.sms){
      //   addr = 'sms'
      // }
      BaaS_F({
        method: 'post',
        url: `${ArgsObj.RequestBase}/hserve/v2.1/login/${addr}/`,
        headers: {
          'X-Hydrogen-Client-ID': ArgsObj.ClientID,
          'Content-Type': 'application/json',
        },
        data: params,
      }).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
  }
  
}


function initFetchLogin(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchLogin
}

export default initFetchLogin