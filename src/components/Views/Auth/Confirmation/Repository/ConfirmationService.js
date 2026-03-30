import '../../../../../Global/Constants';
import { sha3_512 } from 'js-sha3';

/** Metodo para obtener la imagen codificada atravez de la URL
 * @valueLink Valor de la ruta
 */
export async function getImageURL(data){
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.get(global.Constants.url+global.Constants.port+'/Auth/InfoConfirmEmail?value='+data,
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

/** Metodo para confirmar registro del usuario
 * @valueLink Valor de la ruta obtenida
 * @Password Contraseña del usuario
 */
export async function confirmationPassword(valueLink,newPassword){
   const data = {
      Value: valueLink,
      Password: newPassword
   }
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.post(global.Constants.url+global.Constants.port+'/Auth/ConfirmEmail',
      data,
      {
         headers: { 
            'Credential': global.Constants.credential,
         }
      }).then((respose) =>{
         if(respose.status === 200){
            if(respose.data.code === 0){
               return respose.data;
            }else{
               throw respose.data.businessMeaning;
            } 
         }
      }).then((data)=>{
         resolve(data);
      }).catch((err) =>{
         reject(err);
      });
   });
}

/** Metodo para confirmar registro del usuario por SMS
 * @user objecto usuario con correo y codigo sms
 */
export async function getImageSMS(user){
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.get(global.Constants.url+global.Constants.port+'/Auth/InfoConfirmSMS/'+user.email+'/'+user.code,
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

/** Metodo para confirmar registro del usuario
 * @email Correo del usuario
 * @Password Contraseña del usuario.
 * @Code Codigo del SMS
 */
 export async function confirmationPasswordSMS(email,newPassword,code){
   const data = {
      Email: email,
      Password: newPassword,
      Code: sha3_512(code)
   }
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.post(global.Constants.url+global.Constants.port+'/Auth/ConfirmSMS',
      data,
      {
         headers: { 
            'Credential': global.Constants.credential,
         }
      }).then((respose) =>{
         if(respose.status === 200){
            if(respose.data.code === 0){
               return respose.data;
            }else{
               throw respose.data.businessMeaning;
            } 
         }
      }).then((data)=>{
         resolve(data);
      }).catch((err) =>{
         reject(err);
      });
   });
}