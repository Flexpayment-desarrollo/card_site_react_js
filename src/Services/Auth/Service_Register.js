import { encryptPassword } from 'Global/EncryptPassword';

export async function validateCode(datos) {

    const data2 = {
        Telefono: encryptPassword(datos.Telefono),
        Correo: encryptPassword(datos.Correo),
    }
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/register/Validate ', data2,
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

export async function registerUser(datos) {
    const data2 = {
        Nombre: datos.Nombre,
        ApellidoPaterno: datos.ApellidoPaterno,
        ApellidoMaterno: datos.ApellidoMaterno,
        FechaNacimiento: datos.FechaNacimiento,
        RFC: datos.RFC,
        Correo: encryptPassword(datos.Correo),
        Telefono: encryptPassword(datos.Telefono),
        Password: encryptPassword(datos.Password),
        Pin: encryptPassword(datos.Pin),
    }
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/Register ', data2,
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

export async function calcRFC(person) {
    const dataValue = {
        Nombre: person.Nombre,
        ApellidoPaterno: person.Paterno,
        ApellidoMaterno: person.Materno,
        FechaNacimiento: person.FechaNacimiento
    }
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/register/RFC', dataValue,
            {
                headers: {
                    'Authorization': 'bearer ' + newToken,
                    'Credential': global.Constants.credential
                }
            }).then((response) => {
                if (response.status === 200) {
                    ///solo si la api toco la capa logica se genera un nuevo token
                    if (response.data.code !== 1000 && response.data.code !== 5000);
                    //console.log(response)
                    //sessionStorage.setItem('newToken', response.data.token);
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

// Metodo para enviar el sms

export async function validateRecover(email) {
    const correo = {
        Correo: encryptPassword(email)
    }
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/register/ValidateRecover', correo,
            {
                headers: {
                    'Credential': global.Constants.credential
                }
            }).then((respose) => {
                if (respose.status === 200) {
                    if (respose.data.code === 0) {
                        return respose.data;
                    } else {
                        throw respose;
                    }
                }
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
    });
}

export async function sendRecoverPassword(data) {
    const datos = {
        Correo: encryptPassword(data.Correo),
        Password: encryptPassword(data.Password),
        Pin: encryptPassword(data.Pin)
    }
    return new Promise((resolve, reject) => {
        const axios = require('axios');
        axios.put(global.Constants.url + global.Constants.port + '/register/RecoverPass', datos,
            {
                headers: {
                    'Credential': global.Constants.credential
                }
            }).then((respose) => {
                if (respose.status === 200) {
                    return respose.data;
                }
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
    });
}