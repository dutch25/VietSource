import CryptoJS from 'crypto-js'

const SECRET_BYTES = [
    97, 87, 70, 185, 63, 17, 140, 53, 164, 121, 8, 237, 238, 206, 230, 191,
    157, 236, 152, 202, 75, 173, 194, 129, 184, 99, 44, 241, 234, 224, 240, 27
]

// Pre-create WordArray from secret
function getSecretWordArray(): CryptoJS.lib.WordArray {
    const words: number[] = []
    for (let i = 0; i < SECRET_BYTES.length; i += 4) {
        words.push(
            (SECRET_BYTES[i] << 24) |
            (SECRET_BYTES[i + 1] << 16) |
            (SECRET_BYTES[i + 2] << 8) |
            SECRET_BYTES[i + 3]
        )
    }
    return CryptoJS.lib.WordArray.create(words, SECRET_BYTES.length)
}

const secretWA = getSecretWordArray()
const tokKey = CryptoJS.HmacSHA256('tok', secretWA)
const encKey = CryptoJS.HmacSHA256('enc', secretWA)

/**
 * Generate token for DamCoNuong reader endpoint
 * @param chapterPath e.g. "moi-noi-choi-mot-kieu/40"
 */
export function generateToken(chapterPath: string): string {
    const sigWA = CryptoJS.HmacSHA256(chapterPath, tokKey)
    const sigBytes: number[] = []
    for (let i = 0; i < 4; i++) {
        const w = sigWA.words[i]
        sigBytes.push((w >>> 24) & 0xff, (w >>> 16) & 0xff, (w >>> 8) & 0xff, w & 0xff)
    }
    const tokPayload = new Uint8Array([1, ...sigBytes])
    const words: number[] = []
    for (let i = 0; i < tokPayload.length; i += 4) {
        let word = 0
        for (let j = 0; j < 4; j++) {
            if (i + j < tokPayload.length) {
                word |= tokPayload[i + j] << (24 - j * 8)
            }
        }
        words.push(word)
    }
    const tokWA = CryptoJS.lib.WordArray.create(words, tokPayload.length)
    return CryptoJS.enc.Base64.stringify(tokWA)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

/**
 * Decrypt payload returned by DamCoNuong reader endpoint
 * @param encBase64Url base64url encoded ciphertext returned in `e` field
 * @param token generated token used in URL
 */
export function decryptPages(encBase64Url: string, token: string): string[] {
    let b64 = encBase64Url.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) {
        b64 += '='
    }

    const cipherWA = CryptoJS.enc.Base64.parse(b64)
    const totalBytes = cipherWA.sigBytes
    // Format: 12 bytes IV, followed by ciphertext, followed by 16 bytes auth tag
    const ctBytes = totalBytes - 12 - 16
    if (ctBytes <= 0) {
        return []
    }

    // IV for AES-GCM starts counter at 2 in standard CTR keystream
    const ivWords = [cipherWA.words[0], cipherWA.words[1], cipherWA.words[2], 0x00000002]
    const ivWA = CryptoJS.lib.WordArray.create(ivWords, 16)

    const ctWords: number[] = []
    for (let i = 0; i < Math.ceil(ctBytes / 4); i++) {
        ctWords.push(cipherWA.words[3 + i])
    }
    const ctWA = CryptoJS.lib.WordArray.create(ctWords, ctBytes)

    const decKeyWA = CryptoJS.HmacSHA256(token, encKey)

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ctWA } as any,
        decKeyWA,
        {
            iv: ivWA,
            mode: CryptoJS.mode.CTR,
            padding: CryptoJS.pad.NoPadding,
        }
    )

    const decStr = decrypted.toString(CryptoJS.enc.Utf8)
    const data = JSON.parse(decStr)
    if (data && Array.isArray(data.p)) {
        return data.p
    }

    return []
}
