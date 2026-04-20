export async function getClients() {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      return;
      axios.get(global.Constants.url + global.Constants.port + '/Client/V2/Clients',
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((respose) => {
            if (respose.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (respose.data.code !== 1000 && respose.data.code !== 5000)
                  sessionStorage.setItem('newToken', respose.data.token);
               /// se regresa el objeto completo
               return respose.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function getClient(clientID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/Client/V2/' + clientID + '/Info',
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((respose) => {
            if (respose.status === 200) {
               if (respose.data.code === 0) {
                  sessionStorage.setItem('newToken', respose.data.token);
                  return respose.data;
               } else if (respose.data.code === 2011) {
                  return respose.data;
               }
               else {
                  throw respose.data.businessMeaning;
               }
            }
            return respose.data;
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function getCuenta(clientID, idProducto) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/Banca/' + clientID + '/' + idProducto + '/AccountDetail',
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               sessionStorage.setItem('newToken', response.data.token);
               /// se regresa el objeto completo
               return response.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function getTransferPlantilla() {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/Plantilla",
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
               /// se regresa el objeto completo
               return response.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function getTransferPDFGroup(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + "/Banca/TransferPDFGroup", data,
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
               /// se regresa el objeto completo
               return response.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function getTransferPDF(idTransfer) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/Banca/" + idTransfer + "/TransferPDF",
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
               /// se regresa el objeto completo
               return response.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function InfoTransferIndividual(idTransferencia) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/Banca/' + idTransferencia + '/InfoTransfer',
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               sessionStorage.setItem('newToken', response.data.token);
               /// se regresa el objeto completo
               return response.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function getBankStatement(clientID, productID, mes, year) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/Banca/" + clientID + "/" + productID + "/" + year + "/" + mes + "/BankStatement",
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
               /// se regresa el objeto completo
               return response.data;
            }
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function saveChangesClient(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + '/Client/V2/EditFisica', data,
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function saveChangesClientMoral(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + '/Client/V2/EditMoral', data,
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function CreateEditProductKuspit(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/ClientProduct/SaveProductKuspit', data,
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function EditComisionKuspit(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/ClientProduct/EditarComisionKuspit', data,
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}

export async function EditValidacionProdKuspit(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/ClientProduct/ValidacionProductoKuspit', data,
         {
            headers: {
               'Authorization': 'bearer ' + newToken,
               'Credential': global.Constants.credential
            }
         }).then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem('newToken', response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         }).then((data) => {
            resolve(data);
         }).catch((err) => {
            reject(err);
         });
   });
}