
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
function fetchPasswordReset(params: {
  email: string
}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    //CLOUD
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.passwordReset ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.auth.requestPasswordReset(params).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        // HError
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      BaaS_F({
        method: 'post',
        url: `${ArgsObj.RequestBase}/hserve/v2.0/user/password/reset/`,
        headers: {
          'X-Hydrogen-Client-ID': ArgsObj.ClientID,
          'Content-Type': 'application/json',
        },
        data: params,
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    throw new Error(`minapp.passwordReset ${METHOD_NOT_SUPPORT}`)
  }
  
}


function initFetchPasswordReset(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchPasswordReset
}

export default initFetchPasswordReset