import BinTools from 'avalanche/src/utils/bintools'
import { Buffer } from 'avalanche'
import { AvalancheError, NodeIdError } from 'avalanche/src/utils/errors'
import createHash from 'create-hash'
import { KeyPair } from 'avalanche/src/apis/platformvm/keychain'
import { BaseTx, SECPCredential, Tx, UnsignedTx } from 'avalanche/src/apis/platformvm'
import { Credential, Signature } from 'avalanche/src/common/credentials'

const tools = BinTools.getInstance()

const USER_ID_ERROR_CODE: string = '1055'

export function uRng(): string {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    const buffer = Buffer.from(array)
    const hash = Buffer.from(createHash('ripemd160').update(buffer).digest())
    return `UserID-${tools.bufferToB58(hash)}`
}

export function Uid(): number {
    const array = new Uint8Array(6)
    window.crypto.getRandomValues(array)
    let sum: number = 0
    array.forEach((x: number) => {
        sum += x
    })
    return sum
}

export class UserIdError extends AvalancheError {
    constructor(m: string) {
        super(m, USER_ID_ERROR_CODE)
        Object.setPrototypeOf(this, UserIdError.prototype)
    }
}

export function UserIDStringToBuffer(pk: string): Buffer {
    if (!pk.startsWith('UserID-')) {
        throw new NodeIdError("Error - privateUserIDToBuffer: userID must start with 'UserID-'")
    }
    const pksplit: string[] = pk.split('-')
    return tools.cb58Decode(pksplit[pksplit.length - 1])
}

/*
    BaseTx -> Buffer
    Sign sha256(tx) in future
 */
export function Hash256(that: BaseTx): Buffer {
    const codecBuf: Buffer = Buffer.alloc(2)
    const txType: Buffer = Buffer.alloc(4)
    const baseBuff = that.toBuffer()

    codecBuf.writeUInt16BE(that.getCodecID(), 0)
    txType.writeUInt32BE(that.getTxType(), 0)
    const txBuff = Buffer.concat(
        [codecBuf, txType, baseBuff],
        codecBuf.length + txType.length + baseBuff.length
    )
    return Buffer.from(createHash('sha256').update(txBuff).digest())
}

export function SignHash(kc: KeyPair, that: BaseTx): Tx {
    const msg: Buffer = Hash256(that)

    const credentials: Credential[] = []
    // @ts-ignore
    const cred: Credential = new SECPCredential()
    const sigVal: Buffer = kc.sign(msg)
    const sig: Signature = new Signature()
    sig.fromBuffer(sigVal)
    cred.addSignature(sig)
    credentials.push(cred)

    return new Tx(new UnsignedTx(that), credentials)
}

export function MakeId(length: number) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export function ConvertPrefix(address: string) {
    const addr = `11111111111111111111111111111111LpoYY-${address.split('-')[1]}`
    return addr == undefined ? address : addr
}

export function Hash160(pass: string, data: string): string {
    return Buffer.from(
        createHash('rmd160')
            .update(pass + data)
            .digest()
    ).toString('hex')
}

export function VeryHash160(pass: string, data: string, hash: string): boolean {
    const hash_ = Hash160(pass, data)
    return hash_ == hash
}
