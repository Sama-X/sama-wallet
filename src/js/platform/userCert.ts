import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { bufferToNodeIDString } from 'avalanche/src/utils/helperfunctions'
import { User } from '@/js/platform/user'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class UserCert extends User {
    protected _typeName = 'SubmitUserCertTx'
    protected _typeID = 29

    protected spv: Buffer = Buffer.alloc(20)

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            spv: serialization.encoder(this.spv, encoding, 'Buffer', 'nodeID'),
        }
    }
    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        this.spv = serialization.decoder(
            // @ts-ignore
            fields['spv'],
            encoding,
            'nodeID',
            'Buffer',
            20
        )
    }

    getNodeID(): Buffer {
        return this.userID
    }

    getNodeIDString(): string {
        return bufferToNodeIDString(this.userID)
    }

    getCodecID(): number {
        return 0
    }

    getTxType(): number {
        return this._typeID
    }

    getStartTime() {
        return binTools.fromBufferToBN(this.startTime)
    }

    getEndTime() {
        return binTools.fromBufferToBN(this.endTime)
    }

    fromBuffer(bytes: Buffer, offset: number = 0): number {
        offset = super.fromBuffer(bytes, offset)
        this.spv = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20

        return offset
    }

    toBuffer(): Buffer {
        const superBuffer: Buffer = super.toBuffer()
        const bSize: number = superBuffer.length + this.spv.length

        return Buffer.concat([superBuffer, this.spv], bSize)
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
        spv: Buffer,
        weight?: Buffer,
        addresses?: Buffer[],
        key?: string
    ) {
        super(
            networkID,
            blockchainID,
            outs,
            ins,
            memo,
            userID,
            startTime,
            endTime,
            cert,
            weight,
            addresses,
            key
        )
        this.spv = spv
    }
}
