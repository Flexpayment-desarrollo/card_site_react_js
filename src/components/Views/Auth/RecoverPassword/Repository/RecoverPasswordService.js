/** Metodo para enviar link de recuperacion por correo
 * 
 * @param {*} email Correo del usuario
 * @param {*} Type 1 Correo, 2 SMS
 * @returns 
 */
 export async function sendRecoverPassword(email, action,llamada){
   return new Promise((resolve, reject) =>{
      const axios = require('axios');
      axios.get(global.Constants.url+global.Constants.port+'/Auth/'+ email +'/'+action+'/'+llamada+'/RecoverPass',
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

