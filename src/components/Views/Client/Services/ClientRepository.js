export async function getClients() {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/Client/Clients',
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

export async function ReportUserExtern(clientID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/ClientUser/' + clientID,
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

export async function getClient(clientID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/Client/Info/' + clientID,
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

export async function saveChangesClient(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + '/Client/Edit', data,
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

export async function TransferToCC(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/STP/TransferToCC', data,
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

export async function CreateEditProduct(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/ClientProduct/SaveProduct', data,
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

export async function CreateEditProductTransfer(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/ClientProduct/SaveProductTransfer', data,
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

export async function getLastTranfers(id, idProducto) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/STP/' + id + '/' + idProducto + '/LastTransferClient',
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

export async function getLastPay(id, idProducto) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      // axios.get(global.Constants.url + global.Constants.port + '/STP/LastpayClient/' + id,
      axios.get(global.Constants.url + global.Constants.port + '/STP/' + id + '/' + idProducto + '/LastpayClient',

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

export async function getLastMovClient(id, idProducto) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/STP/' + id + '/' + idProducto + '/LastMovClient',
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

export async function getVendorList() {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/ClientProduct/vendor',
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

export async function getClientProductDetail(id) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/ClientProduct/Detail/' + id,
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

export async function getProductDetailTransfer(clientID, productID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/ClientProduct/ProductDetail/' + clientID + "/" + productID,
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

export async function getBanks() {
   return new Promise((resolve, reject) => {
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/Banks",
         {
            headers: {
               'Credential': global.Constants.credential
            }
         }).then((respose) => {
            if (respose.status === 200) {
               if (respose.data.code === 0) {
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

export async function getClientsAccount(clientID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/ClientsAccount",
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

export async function TransferToAccountE(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/STP/TransferToCE', data,
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

export async function TransferToCERequest(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/STP/TransferToCERequest', data,
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

export async function getTransferMasivOperation(clientID, productID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/TransferMasivOperation",
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

export async function LoadMasivTransferOperation(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + "/STP/LoadMasivTransferOperation", data,
         {
            headers: {
               Authorization: "bearer " + newToken,
               Credential: global.Constants.credential,
            },
         })
         .then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem("newToken", response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         })
         .then((data) => {
            resolve(data);
         })
         .catch((err) => {
            reject(err);
         });
   });
}

export async function getTransferPending(clientID, productID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/TransferPending",
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

export async function getCuentaTransfer(clientID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/Client/' + clientID + '/AccountTransfer',
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

export async function ConfirmTransfers(confirmacion) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/STP/ConfirmTransfer', confirmacion,
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

export async function SaveMasivTransferOperation(idTransferencia) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + "/STP/" + idTransferencia + "/SaveMasivTransferOperation", null,
         {
            headers: {
               Authorization: "bearer " + newToken,
               Credential: global.Constants.credential,
            },
         })
         .then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem("newToken", response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         })
         .then((data) => {
            resolve(data);
         })
         .catch((err) => {
            reject(err);
         });
   });
}

export async function SaveMasivTransferOperationAdmin(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + "/STP/SaveMasivTransferAdmin", data,
         {
            headers: {
               Authorization: "bearer " + newToken,
               Credential: global.Constants.credential,
            },
         })
         .then((response) => {
            if (response.status === 200) {
               ///solo si la api toco la capa logica se genera un nuevo token
               if (response.data.code !== 1000 && response.data.code !== 5000)
                  sessionStorage.setItem("newToken", response.data.token);
            }
            /// se regresa el objeto completo
            return response.data;
         })
         .then((data) => {
            resolve(data);
         })
         .catch((err) => {
            reject(err);
         });
   });
}

export async function InfoTransferMasive(idTransferencia) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/STP/' + idTransferencia + '/InfoTransferMasive',
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

export async function InfoTransferIndividual(idTransferencia) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + '/STP/' + idTransferencia + '/InfoTransfer',
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

export async function getBankStatement(clientID, productID, mes) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/" + mes + "/BankStatement",
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

export async function getReportTransfers(clientID, productID, fechaInicio, fechaFin) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/" + fechaInicio + "/" + fechaFin + "/Transfers",
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

export async function getReportTransfersFilter(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/STP/TransfersFilter', data,
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

export async function getReportPays(clientID, productID, fechaInicio, fechaFin) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/" + fechaInicio + "/" + fechaFin + "/pays",
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

export async function getReportMovements(clientID, productID, fechaInicio, fechaFin) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/" + fechaInicio + "/" + fechaFin + "/Movements",
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

// Tipo 1= Admin 2= Ejecutivo
export async function getReportMultiple(clientID, tipoID, productID, fechaInicio, fechaFin) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + tipoID + "/" + productID + "/" + fechaInicio + "/" + fechaFin + "/Volumen",
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
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + idTransfer + "/TransferPDF",
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
      axios.put(global.Constants.url + global.Constants.port + "/STP/TransferPDFGroup", data,
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

export async function getTransferPDFMasivo(idTransfer) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + idTransfer + "/TransferPDFMasivo",
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

// {{quality}}/STP/1/4/2024-10-01/2024-10-14/MovementsPDF
export async function getReportMovementsPDF(clientID, productID, fechaInicio, fechaFin) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + productID + "/" + fechaInicio + "/" + fechaFin + "/MovementsPDF",
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

export async function getReportVolumenPDF(clientID, tipoID, productID, fechaInicio, fechaFin) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/STP/" + clientID + "/" + tipoID + "/" + productID + "/" + fechaInicio + "/" + fechaFin + "/VolumenPDF",
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

export async function deleteAccountBank(id) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.put(global.Constants.url + global.Constants.port + '/STP/' + id + '/DeleteAccountBank', null,
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

export async function SaveProductBidireccionalTransfer(data) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.post(global.Constants.url + global.Constants.port + '/ClientProduct/SaveProductBidireccionalTransfer', data,
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

export async function GetCuentasHijas(clientID) {
   return new Promise((resolve, reject) => {
      var newToken = sessionStorage.getItem('newToken');
      const axios = require('axios');
      axios.get(global.Constants.url + global.Constants.port + "/ClientProduct/" + clientID + "/CuentasHijas",
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