import "../../../../../Global/Constants"
import { sha3_512 } from 'js-sha3';
/**Metodo para recuperar contraseña del usuario por SMS
 * 
 * @param {*} user Objerto usuario
 * @returns 
 */
 export async function getImageSMS(user){
    return new Promise((resolve, reject) =>{
       const axios = require('axios');
       axios.get(global.Constants.url+global.Constants.port+'/Auth/InfoRecoverSMS/'+user.email+'/'+user.code,
       {
          headers: { 
             'Credential': global.Constants.credential
          }
       }).then((respose) =>{
          if(respose.status === 200){
             if(respose.data.code === 0){
                return respose.data;
             }else{
                throw respose;
             } 
          }
       }).then((data)=>{
          resolve(data);
       }).catch((err) =>{
          reject(err);
       });
    });
 }