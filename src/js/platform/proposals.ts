import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { BaseTx } from 'avalanche/src/apis/platformvm'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { bufferToNodeIDString } from 'avalanche/src/utils/helperfunctions'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class Proposals extends BaseTx {
    protected _typeName = 'ProposalTx'
    // @ts-ignore
    protected _typeID = undefined

    protected actionID: Buffer = Buffer.alloc(20)
    protected startTime: Buffer = Buffer.alloc(8)
    protected endTime: Buffer = Buffer.alloc(8)
    protected address: Buffer = Buffer.alloc(20)

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            actionID: serialization.encoder(this.actionID, encoding, 'Buffer', 'nodeID'),
            startTime: serialization.encoder(this.startTime, encoding, 'Buffer', 'decimalString'),
            endTime: serialization.encoder(this.endTime, encoding, 'Buffer', 'decimalString'),
            address: serialization.encoder(this.address, encoding, 'Buffer', 'decimalString'),
        }
    }
    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        // @ts-ignore
        this.actionID = serialization.decoder(fields['actionID'], encoding, 'nodeID', 'Buffer', 20)
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
        this.address = serialization.decoder(
            // @ts-ignore
            fields['address'],
            encoding,
            'decimalString',
            'decimalString'
        )
    }

    getActionID(): Buffer {
        return this.actionID
    }

    getActionID2String(): string {
        return bufferToNodeIDString(this.actionID)
    }

    getStartTime() {
        return binTools.fromBufferToBN(this.startTime)
    }

    getEndTime() {
        return binTools.fromBufferToBN(this.endTime)
    }

    fromBuffer(bytes: Buffer, offset: number = 0): number {
        offset = super.fromBuffer(bytes, offset)
        this.actionID = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20
        this.startTime = binTools.copyFrom(bytes, offset, offset + 8)
        offset += 8
        this.endTime = binTools.copyFrom(bytes, offset, offset + 8)
        offset += 8
        this.address = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20

        return offset
    }

    toBuffer(): Buffer {
        const superBuff: Buffer = super.toBuffer()
        const bSize: number =
            superBuff.length +
            this.actionID.length +
            this.startTime.length +
            this.endTime.length +
            this.address.length

        return Buffer.concat([this.actionID, this.startTime, this.endTime, this.address], bSize)
    }

    constructor(
        networkID: number,
        blockchainID: Buffer,
        outs: TransferableOutput[],
        ins: TransferableInput[],
        memo: Buffer,
        actionID: Buffer,
        startTime: BN,
        endTime: BN,
        address: string
    ) {
        super(networkID, blockchainID, outs, ins, memo)
        this.actionID = actionID
        this.startTime = binTools.fromBNToBuffer(startTime, 8)
        this.endTime = binTools.fromBNToBuffer(endTime, 8)
        this.address = binTools.stringToAddress(address)
    }
}
