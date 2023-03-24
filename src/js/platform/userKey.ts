import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { bufferToNodeIDString } from 'avalanche/src/utils/helperfunctions'
import { User } from '@/js/platform/user'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class UserKey extends User {
    protected _typeName = 'SubmitUserKeyTx'
    protected _typeID = 30

    protected supervisor: Buffer = Buffer.alloc(20)

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            supervisor: serialization.encoder(this.supervisor, encoding, 'Buffer', 'nodeID'),
        }
    }
    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        this.supervisor = serialization.decoder(
            // @ts-ignore
            fields['supervisor'],
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

    getStartTime() {
        return binTools.fromBufferToBN(this.startTime)
    }

    getEndTime() {
        return binTools.fromBufferToBN(this.endTime)
    }

    fromBuffer(bytes: Buffer, offset: number = 0): number {
        offset = super.fromBuffer(bytes, offset)
        this.supervisor = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20

        return offset
    }

    toBuffer(): Buffer {
        const superBuffer: Buffer = super.toBuffer()
        const bSize: number = superBuffer.length + this.supervisor.length

        return Buffer.concat([superBuffer, this.supervisor], bSize)
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
        supervisor: Buffer,
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
        this.supervisor = supervisor
    }
}
