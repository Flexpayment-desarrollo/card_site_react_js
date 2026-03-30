export const  encryptPassword = (password) => {
    const NodeRSA = require('node-rsa');

    const public_key = '-----BEGIN PUBLIC KEY-----\n'+
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2V8ZLqU17Ehjtk4e+8Jf\n'+
    'l2p6mAX3iK4d03VS7RdbJJGekoMdLLNFBOYZc1NyEZ7a7Wz2fLQ6Dc6c+ZWEjI3S\n'+
    'VQGQ0ecm9ygIReNDhTFhx0nSihc/HxaKKeKKRkuSO5x6ebdBMo3FBK9SjbudGAFo\n'+
    'Od1C2REnJ+fnm5xwz3ADBsSZj61pQ64fGqv4BWzk2EjnKj46VGSoiANo3SSXS/ww\n'+
    'sQVTGCNaSENY3CrlW1FVcUKoMI2yeYULGtbPN7bYOdEwABgV4LkW38CkAtyyd2Ad\n'+
    'rbrarG1a1/Xh8OKhRBGX2b/DxnJ9LSow7GylHH3YJTagNgnVEhoLLYLtuNCRjXuo\n'+
    'LQIDAQAB\n'+
    '-----END PUBLIC KEY-----';

    const key_public = new NodeRSA(public_key);

    key_public.setOptions({
        encryptionScheme: "pkcs1"
    });
    
    const encryptedString =  key_public.encrypt(password,'base64');

    return encryptedString;
}

export const  decryptId = (id) => {
    try{
    const NodeRSA = require('node-rsa');

    const public_key = '-----BEGIN PUBLIC KEY-----\n'+
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2V8ZLqU17Ehjtk4e+8Jf\n'+
    'l2p6mAX3iK4d03VS7RdbJJGekoMdLLNFBOYZc1NyEZ7a7Wz2fLQ6Dc6c+ZWEjI3S\n'+
    'VQGQ0ecm9ygIReNDhTFhx0nSihc/HxaKKeKKRkuSO5x6ebdBMo3FBK9SjbudGAFo\n'+
    'Od1C2REnJ+fnm5xwz3ADBsSZj61pQ64fGqv4BWzk2EjnKj46VGSoiANo3SSXS/ww\n'+
    'sQVTGCNaSENY3CrlW1FVcUKoMI2yeYULGtbPN7bYOdEwABgV4LkW38CkAtyyd2Ad\n'+
    'rbrarG1a1/Xh8OKhRBGX2b/DxnJ9LSow7GylHH3YJTagNgnVEhoLLYLtuNCRjXuo\n'+
    'LQIDAQAB\n'+
    '-----END PUBLIC KEY-----';

    const key_public = new NodeRSA(public_key);

    key_public.setOptions({
        encryptionScheme: "pkcs1"
    });
    
    const encryptedString =  key_public.decrypt(id,'utf8');

    return encryptedString;
    }
    catch(err){
    }
}
