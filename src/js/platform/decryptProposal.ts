import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { bufferToNodeIDString } from 'avalanche/src/utils/helperfunctions'
import { Proposals } from '@/js/platform/proposals'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class DecryptProposal extends Proposals {
    protected _typeName = 'SubmitDecryptProposalTx'
    // @ts-ignore
    protected _typeID = 31

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
        // @ts-ignore
        this.supervisor = serialization.decoder(
            // @ts-ignore
            fields['supervisor'],
            encoding,
            'nodeID',
            'Buffer',
            20
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
        this.supervisor = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20
        return offset
    }

    toBuffer(): Buffer {
        const superBuff: Buffer = super.toBuffer()
        const bSize: number = superBuff.length + this.supervisor.length
        return Buffer.concat([superBuff, this.supervisor], bSize)
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
        supervisor: Buffer
    ) {
        super(networkID, blockchainID, outs, ins, memo, actionID, startTime, endTime, address)
        // @ts-ignore
        this.supervisor = supervisor
    }
}

export class AssentProposal extends DecryptProposal {
    protected _typeName = 'SubmitAssentProposalTx'
    protected _typeID = 34
}
