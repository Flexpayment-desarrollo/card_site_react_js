import { encryptPassword } from 'Global/EncryptPassword';

export async function disperseWallet(datos) {
    let data = {
        Id: datos.Id,
        NIP: encryptPassword(datos.NIP),
        Amount: datos.Amount,
        Latitud: datos.Latitud,
        Longitud: datos.Longitud,
        Dispersion: datos.Dispersion
    };
    return new Promise((resolve, reject) => {
        var newToken = sessionStorage.getItem('newToken');
        const axios = require('axios');
        axios.post(global.Constants.url + global.Constants.port + '/wallet/Dispers ', data,
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