import { encryptPassword } from 'Global/EncryptPassword';

export async function getCards() {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.get(global.Constants.url + global.Constants.port + '/Card',
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

export async function getCardDetail(data) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Card/Info', data,
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

export async function cambiarEstatusCard(data) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.put(global.Constants.url + global.Constants.port + "/Card/Status", data,
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

export async function watchNIP(data) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Card/NIP', data,
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

export async function getMovements(datos) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Card/Movements ', datos,
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

export async function getCVVDinamico(datos) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Card/CVC', datos,
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

export async function registerCard(datos) {
    let data = {
        CardNumber: encryptPassword(datos.CardNumber),
        Expires: encryptPassword(datos.Expires),
    };
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Card/Register ', data,
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

export async function createCardTH(datos) {
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Card/CreateTH', datos,
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

export async function getCity(city) {
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.get(global.Constants.urlCatalogos + global.Constants.port + "/CatalogoProspecto/" + city + "/Municipio",
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

export async function getColony(estado, ciudad) {
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.get(global.Constants.urlCatalogos + global.Constants.port + "/CatalogoProspecto/" + estado + "/" + ciudad + "/Colonia",
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

export async function getState() {
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.get(global.Constants.urlCatalogos + global.Constants.port + '/CatalogoProspecto/Estado',
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

export async function getGender() {
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.get(global.Constants.urlCatalogos + global.Constants.port + '/CatalogoProspecto/Genero',
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

export async function getIdentification() {
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.get(global.Constants.urlCatalogos + global.Constants.port + '/CatalogoProspecto/IdentificacionOficial',
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