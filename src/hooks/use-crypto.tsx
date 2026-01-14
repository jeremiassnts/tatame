import { AES, Utf8 } from 'crypto-es';

export function useCrypto() {
    const SECRET_KEY = process.env.EXPO_PUBLIC_ENCRYPT_KEY as string;

    function encrypt(data: any) {
        const json = JSON.stringify(data);
        const encrypted = AES.encrypt(json, SECRET_KEY).toString()
        return encrypted;
    }

    function decrypt(encrypted: string) {
        const decrypted = AES.decrypt(encrypted, SECRET_KEY).toString(Utf8);
        return JSON.parse(decrypted);
    }

    return {
        encrypt,
        decrypt,
    }
}