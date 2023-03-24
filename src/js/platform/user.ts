import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { BaseTx } from 'avalanche/src/apis/platformvm'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { bufferToNodeIDString } from 'avalanche/src/utils/helperfunctions'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class User extends BaseTx {
    protected _typeName = 'submitUserTx'
    protected _typeID = 0

    protected userID: Buffer = Buffer.alloc(20)
    protected startTime: Buffer = Buffer.alloc(8)
    protected endTime: Buffer = Buffer.alloc(8)
    protected weight: Buffer
    protected addresses: Buffer[]
    protected key: string
    protected cert: string

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            userID: serialization.encoder(this.userID, encoding, 'Buffer', 'nodeID'),
            startTime: serialization.encoder(this.startTime, encoding, 'Buffer', 'decimalString'),
            endTime: serialization.encoder(this.endTime, encoding, 'Buffer', 'decimalString'),
            // weight: serialization.encoder(this.weight, encoding, 'Buffer', 'decimalString'),
            // TODO - array
            // key: serialization.encoder(this.key, encoding, 'decimalString', 'decimalString'),
            cert: serialization.encoder(this.cert, encoding, 'Buffer', 'hex'),
        }
    }
    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        // @ts-ignore
        this.userID = serialization.decoder(fields['userID'], encoding, 'nodeID', 'Buffer', 20)
        this.startTime = serialization.decoder(
            // @ts-ignore
            fields['startTime'],
            encoding,
            'decimalString',
            'Buffer',
            8
        )
        this.endTime = serialization.decoder(
            // @ts-ignore
            fields['endTime'],
            encoding,
            'decimalString',
            'Buffer',
            8
        )
        // this.weight = serialization.decoder(
        //     // @ts-ignore
        //     fields['weight'],
        //     encoding,
        //     'decimalString',
        //     'Buffer',
        //     8
        // )
        // this.key = serialization.decoder(
        //     // @ts-ignore
        //     fields['key'],
        //     encoding,
        //     'decimalString',
        //     'decimalString'
        // )
        this.cert = serialization.decoder(
            // @ts-ignore
            fields['cert'],
            encoding,
            'hex',
            'Buffer'
        )
        // TODO - deserialization
    }

    getUserID(): Buffer {
        return this.userID
    }

    getUserIDString(): string {
        return bufferToNodeIDString(this.userID)
    }

    getStartTime() {
        return binTools.fromBufferToBN(this.startTime)
    }

    getEndTime() {
        return binTools.fromBufferToBN(this.endTime)
    }

    fromBuffer(bytes: Buffer, offset: number = 0): number {
        offset = super.fromBuffer(bytes, offset)
        this.userID = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20
        this.startTime = binTools.copyFrom(bytes, offset, offset + 8)
        offset += 8
        this.endTime = binTools.copyFrom(bytes, offset, offset + 8)
        offset += 8
        // this.weight = binTools.copyFrom(bytes, offset, offset + 8)
        // offset += 8

        // // Addresses
        // const addressNum = binTools.copyFrom(bytes, offset, offset + 4)
        // offset += 4
        // let aCount = addressNum.readUInt32BE(0)
        // const addressArray = []
        // for (let i = 0; i < aCount; i++) {
        //     addressArray[i] = binTools.copyFrom(bytes, offset, offset + 20)
        //     offset += 20
        // }
        //
        // // Key
        // const keyNum = binTools.copyFrom(bytes, offset, offset + 2)
        // offset += 2
        // aCount = keyNum.readUInt16BE(0)
        // const keyBuf = binTools.copyFrom(bytes, offset, offset + aCount)
        // this.key = keyBuf.toString()
        // offset += keyBuf.length

        // Cert
        const certNum = binTools.copyFrom(bytes, offset, offset + 2)
        offset += 2
        const aCount = certNum.readUInt16BE(0)
        const certBuf = binTools.copyFrom(bytes, offset, offset + aCount)
        offset += certBuf.length
        this.cert = certBuf.toString()

        return offset
    }

    toBuffer(): Buffer {
        const superBuffer: Buffer = super.toBuffer()
        let bSize: number =
            superBuffer.length + this.userID.length + this.startTime.length + this.endTime.length
        // 8 + // weight
        // 4 + // array length + array element * size
        // (this.addresses == undefined ? 0 : this.addresses.length * 20) +
        // 2 + // string length + string
        // (this.key == undefined ? 0 : this.key.length) +

        // const addressLength: Buffer = Buffer.alloc(4)
        // addressLength.writeUInt32BE(this.addresses == undefined ? 0 : this.addresses.length, 0)

        const certBuf: Buffer = Buffer.from(this.cert, 'utf-8')
        const certLength: Buffer = Buffer.alloc(2)
        certLength.writeUInt16BE(certBuf.length, 0)
        bSize += 2
        bSize += certBuf.length

        // const keyBuf: Buffer = Buffer.from(this.key == undefined ? '' : this.key, 'utf-8')
        // const keyLength: Buffer = Buffer.alloc(2)
        // keyLength.writeUInt16BE(keyBuf.length, 0)

        const addressBuffer: Buffer =
            this.addresses == undefined ? Buffer.alloc(0) : Buffer.concat(this.addresses)

        return Buffer.concat(
            [
                superBuffer,
                this.userID,
                this.startTime,
                this.endTime,
                // this.weight,
                // addressLength,
                // addressBuffer,
                // keyLength,
                // keyBuf,
                certLength,
                certBuf,
            ],
            bSize
        )
    }

    constructor(
        networkID: number,
        blockchainID: Buffer,
        outs: TransferableOutput[],
        ins: TransferableInput[],
        memo: Buffer,
        userID: Buffer,
        startTime: BN,
        endTime: BN,
        cert: string,
        weight?: Buffer,
        addresses?: Buffer[],
        key?: string
    ) {
        super(networkID, blockchainID, outs, ins, memo)
        this.userID = userID
        this.startTime = binTools.fromBNToBuffer(startTime, 8)
        this.endTime = binTools.fromBNToBuffer(endTime, 8)
        this.cert = cert
        this.weight = weight == undefined ? Buffer.alloc(8) : weight
        // @ts-ignore
        this.addresses = addresses
        // @ts-ignore
        this.key = key
    }
}
