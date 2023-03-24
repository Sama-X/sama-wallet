import { JRPCAPI } from 'avalanche/src/common'
import {
    addSysOpParams,
    CurrentRecommendSysOpsResp,
    RecommendSysOpParams,
} from '@/js/platform/interfaces'
import { RequestResponseData } from 'avalanche/src/common'
import axios from 'axios'

export interface JsonResponseData {
    jsonrpc: string
    result: any
}

export class HPlatformVMAPI extends JRPCAPI {
    recommendSysOp = async (
        nodeID: string,
        sysOpAddr: string,
        username: string,
        password: string,
        from?: string[],
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const params: RecommendSysOpParams = {
            nodeID,
            sysOpAddr,
            username,
            password,
            from,
            changeAddr,
        }

        const response: RequestResponseData = await this.callMethod(
            'platform.recommendSysOp',
            params
        )
        return response.data
    }

    getCurrentRecommendSysOps = async (): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentRecommendSysOps',
            {}
        )

        return response.data
    }

    addSysOp = async (
        nodeID: string,
        stakeAmount: number,
        rewardAddress: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const params: addSysOpParams = {
            nodeID,
            stakeAmount,
            rewardAddress,
            from,
            username,
            password,
            changeAddr,
        }

        const response: RequestResponseData = await this.callMethod('platform.addSysOp', params)
        return response.data
    }

    getCurrentSysOps = async (nodeIDs?: string[]): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentValidators',
            {
                nodeIDs,
            }
        )

        return response.data
    }

    recommendSpv = async (
        nodeID: string,
        spvAddr: string,
        username: string,
        password: string,
        from?: string[],
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.recommendSpv', {
            nodeID,
            spvAddr,
            from,
            changeAddr,
            username,
            password,
        })

        return response.data
    }

    getCurrentRecommendSpvs = async (): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentRecommendSpvs',
            {}
        )

        return response.data
    }

    addSpv = async (
        nodeID: string,
        stakeAmount: number,
        rewardAddress: string,
        // from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.addSpv', {
            nodeID,
            stakeAmount,
            rewardAddress,
            changeAddr,
            username,
            password,
        })

        return response.data
    }

    getCurrentSpvs = async (nodeIDs?: string[]): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.getCurrentSpvs', {
            nodeIDs,
        })

        return response.data
    }

    recommendSupervisor = async (
        nodeID: string,
        supervisorAddr: string,
        username: string,
        password: string,
        from?: string[],
        changeAddr?: string[]
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.recommendSupervisor',
            {
                nodeID,
                supervisorAddr,
                from,
                changeAddr,
                username,
                password,
            }
        )

        return response.data
    }

    getCurrentRecommendSupervisor = async (): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentRecommendSupervisors',
            {}
        )

        return response.data
    }

    addSupervisor = async (
        nodeID: string,
        stakeAmount: number,
        rewardAddress: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.addSupervisor', {
            nodeID,
            stakeAmount,
            rewardAddress,
            from,
            username,
            password,
            changeAddr,
        })

        return response.data
    }

    getCurrentSupervisor = async (nodeIDs?: string[]): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentSupervisors',
            { nodeIDs }
        )

        return response.data
    }

    submitUserCert = async (
        userID: string,
        cert: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.submitUserCert', {
            userID,
            cert,
            from,
            changeAddr,
            username,
            password,
        })

        return response.data
    }

    getCurrentUserCerts = async (): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentUserCerts',
            {}
        )

        return response.data
    }

    submitUserKey = async (
        userID: string,
        key: string,
        from: string[],
        userAddrs: string[],
        username: string,
        password: string,
        changeAddr?: string[]
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.submitUserKey', {
            userID,
            key,
            from,
            userAddrs,
            changeAddr,
            username,
            password,
        })

        return response.data
    }

    getCurrentUserKeys = async (): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentUserCerts',
            {}
        )

        return response.data
    }

    submitProposal = async (
        actionID: string,
        userAddress: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.submitProposal', {
            actionID,
            userAddress,
            from,
            username,
            password,
            changeAddr,
        })

        return response.data
    }

    getCurrentProposals = async (): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod(
            'platform.getCurrentProposals',
            {}
        )

        return response.data
    }

    assentProposal = async (
        actionID: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.assentProposal', {
            actionID,
            from,
            changeAddr,
            username,
            password,
        })

        return response.data
    }

    getCurrentAssents = async (actionID?: string[]): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.getCurrentAssents', {
            actionID,
        })

        return response.data
    }

    submitDecInfo = async (
        actionID: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.submitDecInfo', {
            actionID,
            from,
            changeAddr,
            username,
            password,
        })

        return response.data
    }

    getCurrentDecInfos = async (actionID?: string[]): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.getCurrentDecInfos', {
            actionID,
        })

        return response.data
    }

    submitUrl = async (
        actionID: string,
        url: string,
        from: string[],
        username: string,
        password: string,
        changeAddr?: string[]
    ): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.submitUrl', {
            actionID,
            url,
            from,
            username,
            password,
            changeAddr,
        })

        return response.data
    }

    getCurrentUrls = async (actionID?: string[]): Promise<JsonResponseData> => {
        const response: RequestResponseData = await this.callMethod('platform.getCurrentUrls', {
            actionID,
        })

        return response.data
    }
}
