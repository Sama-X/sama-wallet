// @ts-nocheck
import { WeightedValidatorTx } from 'avalanche/src/apis/platformvm'
import { Serialization, SerializedEncoding } from 'avalanche/src/utils/serialization'
import BinTools from 'avalanche/src/utils/bintools'
import { DefaultNetworkID } from 'avalanche/src/utils'
import { Avalanche, BN, Buffer } from 'avalanche/src'
import {
    TransferableInput,
    TransferableOutput,
    AmountOutput,
    ParseableOutput,
} from 'avalanche/src/apis/platformvm'

const binTools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

export class RoleValidator extends WeightedValidatorTx {
    protected _typeName = 'RoleValidatorTx'
    protected _typeID = undefined

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            address: serialization.encoder(this.address, encoding, 'Buffer', 'nodeID'),
        }
    }

    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        this.address = serialization.decoder(fields['address'], encoding, 'nodeID', 'Buffer', 20)
    }

    protected address: Buffer = Buffer.alloc(20)

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
        this.address = binTools.copyFrom(bytes, offset, offset + 20)
        offset += 20
        return offset
    }

    toBuffer(): Buffer {
        const superbuff: Buffer = super.toBuffer()
        return Buffer.concat([superbuff, this.address])
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
        address: Buffer = undefined
    ) {
        super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, weight)
        if (typeof address !== undefined) {
            this.address = address
        }
    }
}

export class AddRoleValidator extends RoleValidator {
    protected _typeName = 'AddRoleValidatorTx'
    protected _typeID = undefined

    serialize(encoding: SerializedEncoding = 'hex'): object {
        const fields: object = super.serialize(encoding)
        return {
            ...fields,
            stakeOuts: this.stakeOuts.map((s) => s.serialize(encoding)),
            rewardOwners: this.rewardOwners.serialize(encoding),
        }
    }
    deserialize(fields: object, encoding: SerializedEncoding = 'hex') {
        super.deserialize(fields, encoding)
        this.stakeOuts = fields['stakeOuts'].map((s: object) => {
            const xferout: TransferableOutput = new TransferableOutput()
            xferout.deserialize(s, encoding)
            return xferout
        })
        this.rewardOwners = new ParseableOutput()
        this.rewardOwners.deserialize(fields['rewardOwners'], encoding)
    }

    protected stakeOuts: TransferableOutput[] = []
    protected rewardOwners: ParseableOutput = undefined

    getTxType(): number {
        return this._typeID
    }

    getStakeAmount(): BN {
        return this.getWeight()
    }

    getStakeAmountBuffer(): Buffer {
        return this.weight
    }

    getStakeOuts(): TransferableOutput[] {
        return this.stakeOuts
    }

    getStakeOutsTotal(): BN {
        let val: BN = new BN(0)
        for (let i: number = 0; i < this.stakeOuts.length; i++) {
            val = val.add((this.stakeOuts[`${i}`].getOutput() as AmountOutput).getAmount())
        }
        return val
    }

    getRewardOwners(): ParseableOutput {
        return this.rewardOwners
    }

    getTotalOuts(): TransferableOutput[] {
        return [...(this.getOuts() as TransferableOutput[]), ...this.getStakeOuts()]
    }

    fromBuffer(bytes: Buffer, offset: number = 0): number {
        offset = super.fromBuffer(bytes, offset)
        const numstakeouts = binTools.copyFrom(bytes, offset, offset + 4)
        offset += 4
        const outcount: number = numstakeouts.readUInt32BE(0)
        this.stakeOuts = []
        for (let i: number = 0; i < outcount; i++) {
            const xferout: TransferableOutput = new TransferableOutput()
            offset = xferout.fromBuffer(bytes, offset)
            this.stakeOuts.push(xferout)
        }
        this.rewardOwners = new ParseableOutput()
        offset = this.rewardOwners.fromBuffer(bytes, offset)
        return offset
    }

    toBuffer(): Buffer {
        const superbuff: Buffer = super.toBuffer()
        let bsize: number = superbuff.length
        const numouts: Buffer = Buffer.alloc(4)
        numouts.writeUInt32BE(this.stakeOuts.length, 0)
        const barr: Buffer[] = [super.toBuffer(), numouts]
        bsize += numouts.length
        this.stakeOuts = this.stakeOuts.sort(TransferableOutput.comparator())
        for (let i: number = 0; i < this.stakeOuts.length; i++) {
            const out: Buffer = this.stakeOuts[`${i}`].toBuffer()
            barr.push(out)
            bsize += out.length
        }
        const ro: Buffer = this.rewardOwners.toBuffer()
        barr.push(ro)
        bsize += ro.length
        return Buffer.concat(barr, bsize)
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
        stakeAmount: BN = undefined, // weight
        address: Buffer = undefined,
        stakeOuts: TransferableOutput[] = undefined,
        rewardOwners: ParseableOutput = undefined
    ) {
        super(
            networkID,
            blockchainID,
            outs,
            ins,
            memo,
            nodeID,
            startTime,
            endTime,
            stakeAmount,
            address
        )
        if (typeof stakeOuts !== undefined) {
            this.stakeOuts = stakeOuts
        }
        this.rewardOwners = rewardOwners
    }
}

export class AddSpvValidator extends AddRoleValidator {
    protected _typeName = 'AddSpvTx'
    protected _typeID = 23
}

export class AddSysOpValidator extends AddRoleValidator {
    protected _typeName = 'AddSysOpTx'
    protected _typeID = 24
}

export class AddSupervisorValidator extends AddRoleValidator {
    protected _typeName = 'AddSupervisorTx'
    protected _typeID = 25
}
