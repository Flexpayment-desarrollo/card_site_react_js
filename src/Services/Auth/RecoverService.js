/**Metodo para obtener la imagen codificada atravez de la URL
 * 
 * @param {*} val Valor Imgen
 * @param {*} val2 Valor de Token 
 * @returns 
 */
 export async function getImageURL(val, val2){
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.get(global.Constants.url+global.Constants.port+'/Auth/InfoRecoverEmail/'+val+'/'+val2,
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

/**Metodo cambiar la contraseña
 * 
 * @param {*} email Correo del usuario
 * @param {*} newPassword Contraseña del Usuario
 * @param {*} code Codigo de Verificacion
 * @returns data
 */
 export async function changePassword(email, newPassword, code){
   const data = {
      Email: email,
      Password: newPassword,
      Code: code,
   }
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.post(global.Constants.url+global.Constants.port+'/Auth/ChangePassword',
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