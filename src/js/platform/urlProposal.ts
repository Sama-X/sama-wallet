import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { bufferToNodeIDString } from 'avalanche/src/utils/helperfunctions'
import { Proposals } from '@/js/platform/proposals'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class UrlProposal extends Proposals {
    protected _typeName = 'SubmitUrlTx'
    // @ts-ignore
    protected _typeID = 33

    protected spv: Buffer = Buffer.alloc(20)
    protected url: string = ''

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            spv: serialization.encoder(this.spv, encoding, 'Buffer', 'nodeID'),
            url: serialization.encoder(this.url, encoding, 'decimalString', 'decimalString'),
        }
    }
    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        // @ts-ignore
        this.spv = serialization.decoder(
            // @ts-ignore
            fields['spv'],
            encoding,
            'nodeID',
            'Buffer',
            20
        )
        this.url = serialization.decoder(
            // @ts-ignore
            fields['url'],
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
        this.spv = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20

        // Url, string format, [length(4) + data]
        const urlNum = binTools.copyFrom(bytes, offset, offset + 4)
        offset += 4
        const aCount = urlNum.readUInt32BE(0)
        const urlBuf = binTools.copyFrom(bytes, offset, offset + aCount)
        offset += urlBuf.length
        this.url = urlBuf.toString()

        return offset
    }

    toBuffer(): Buffer {
        const superBuff: Buffer = super.toBuffer()
        let bSize: number = superBuff.length + this.spv.length + 4 // url length data

        const urlBuf: Buffer = Buffer.from(this.url, 'utf-8')
        const urlLength: Buffer = Buffer.alloc(4)
        urlLength.writeUInt32BE(urlBuf.length, 0)

        bSize += urlBuf.length

        return Buffer.concat([superBuff, this.spv, urlLength, urlBuf], bSize)
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
        address: string,
        spv: Buffer,
        url?: string
    ) {
        super(networkID, blockchainID, outs, ins, memo, actionID, startTime, endTime, address)
        this.spv = spv
        // @ts-ignore
        this.url = url
    }
}
