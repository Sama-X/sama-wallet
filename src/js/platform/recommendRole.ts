// @ts-nocheck
import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { DefaultNetworkID } from 'avalanche/src/utils'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import { TransferableInput, TransferableOutput } from 'avalanche/src/apis/platformvm'
import { RoleValidator } from '@/js/platform/role'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class RecommendRole extends RoleValidator {
    protected _typeName = 'RecommendRoleTx'
    protected _typeID = undefined

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            referrer: serialization.encoder(this.referrer, encoding, 'Buffer', 'nodeID'),
        }
    }

    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        this.referrer = serialization.decoder(fields['referrer'], encoding, 'nodeID', 'Buffer', 20)
    }

    protected referrer: Buffer = Buffer.alloc(20)

    getTxType(): number {
        return this._typeID
    }

    getStakeAmount(): BN {
        return this.getWeight()
    }

    getStakeAmountBuffer(): Buffer {
        return this.weight
    }

    fromBuffer(bytes: Buffer, offset: number = 0): number {
        offset = super.fromBuffer(bytes, offset)
        this.referrer = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20
        return offset
    }

    toBuffer(): Buffer {
        const superbuff: Buffer = super.toBuffer()
        return Buffer.concat([superbuff, this.referrer])
    }

    constructor(
        networkID: number = DefaultNetworkID,
        blockchainID: Buffer = Buffer.alloc(32, 16),
        outs: TransferableOutput[] = undefined,
        ins: TransferableInput[] = undefined,
        memo: Buffer = undefined,
        nodeID: Buffer = undefined,
        startTime: BN = undefined,
        endTime: BN = undefined,
        weight: BN = undefined,
        address: Buffer = undefined,
        referrer: Buffer = undefined
    ) {
        super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, weight, address)
        if (typeof referrer !== undefined) {
            this.referrer = address
        }
    }
}

export class RecommendSpv extends RecommendRole {
    protected _typeName = 'RecommendSpvTx'
    protected _typeID = 27
}

export class RecommendSysOp extends RecommendRole {
    protected _typeName = 'RecommendSysOpTx'
    protected _typeID = 26
}

export class RecommendSupervisor extends RecommendRole {
    protected _typeName = 'RecommendSupervisorTx'
    protected _typeID = 28
}
