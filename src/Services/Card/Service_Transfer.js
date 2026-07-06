export async function getUserAccount() {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.get(global.Constants.url + global.Constants.port + '/Transfer/UserAccount',

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
        axios.post(global.Constants.url + global.Constants.port + '/Transfer/TransferToCE', data,
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

// {{develop}}/Transfer/InfoTransfer 
export async function InfoTransfer(data) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Transfer/InfoTransfer', data,
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

export async function getTransferPDF(data) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + "/Transfer/TransferPDF", data,
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