import { v4 as uuidv4 } from 'uuid';

const BASE62_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function encodeBase62(num: number): string {
    let base62 = '';
    while (num > 0) {
        base62 = BASE62_CHARSET[num % 62] + base62;
        num = Math.floor(num / 62);
    }
    return base62;
}

export function generateShortCode(): string {
    const rawUuid = uuidv4();

    // first 8 bytes (16 hex characters) of the UUID
    const hexString = rawUuid.replace(/-/g, '').substring(0, 16);
    
    // hex string to decimal number
    const decimalValue = BigInt('0x' + hexString);

    // encoding decimal number using Base62
    const shortCode = encodeBase62(Number(decimalValue));

    return shortCode.substring(0, 8);
}

