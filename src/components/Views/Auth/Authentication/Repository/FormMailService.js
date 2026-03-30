import '../../../../../Global/Constants';
import { encryptPassword } from 'Global/EncryptPassword';

export async function emailValidate(form, latitud, longitud) {
   const data = {
      Username: encryptPassword(form.Username),
      Password: form.Password,
      Pin: form.Pin,
      Latitud: latitud,
      Longitud: longitud
   }
   return new Promise((resolve, reject) => {
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/Auth/validateV2', data,
         {
            headers: {
               'Content-Type': 'application/json',
               'Credential': global.Constants.credential
            }
         })
         .then((respose) => {
            return respose.data;
         })
         .then((data) => {
            resolve(data);
         })
         .catch((err) => {
            reject(err)
         });
   });
}

export async function authValidate(form) {

   const formLogin = {
      Username: encryptPassword(form.Username),
      Password: encryptPassword(form.Password),
      Pin: form.Pin,
      Latitud: form.Latitud,
      Longitud: form.Longitud
   }
   return new Promise((resolve, reject) => {
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/Auth/loginV2', formLogin, { headers: { 'Content-Type': 'application/json', 'Credential': global.Constants.credential } })
         .then((respose) => {
            if (respose.data.code === 0) {

               const location = {
                  Latitud: formLogin.Latitud,
                  Longitud: formLogin.Longitud
               };
               var Authentication = JSON.stringify(respose.data.data);
               var locationJson = JSON.stringify(location);
               sessionStorage.setItem('Authentication', Authentication);
               sessionStorage.setItem('newToken', JSON.parse(Authentication).token);
               sessionStorage.setItem('ubicacion', locationJson);
            }
            return respose.data;
         })
         .then((data) => {
            resolve(data);
         })
         .catch((err) => {
            reject(err)
         });
   });
}

export async function logOut() {
   return new Promise((resolve, reject) => {
      const axios = require('axios');
      var newToken = sessionStorage.getItem('newToken');
      axios.post(global.Constants.url + global.Constants.port + '/Auth/logOut', null, { headers: { 'Content-Type': 'application/json', 'credential': global.Constants.credential, 'Authorization': 'bearer ' + newToken } })
         .then((respose) => {
            return respose.data;
         })
         .then((data) => {
            resolve(data);
         })
         .catch((err) => {
            reject(err)
         });
   });
}

export async function changePasswordExp(email, newPassword) {
   const data = {
      Email: email,
      Password: newPassword,
   }
   return new Promise((resolve, reject) => {
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/Auth/ChangePasswordExpiration',
         data,
         {
            headers: {
               'Credential': global.Constants.credential,
            }
         }).then((respose) => {
            if (respose.status === 200) {
               if (respose.data.code === 0) {
                  return respose.data;
               } else {
                  throw respose.data.businessMeaning;
               }
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}
