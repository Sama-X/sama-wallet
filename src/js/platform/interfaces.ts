export interface RecommendSysOpParams {
    nodeID: string
    sysOpAddr: string
    from?: string[]
    changeAddr?: string
    username: string
    password: string
}

export interface sysOps {
    txID: string
    startTime: string
    endTime: string
    owner: string
    stakeAmount?: string
    nodeID: string
    uptime: string
    connected: boolean
    referrer: string
}

export interface CurrentRecommendSysOpsResp {
    sysOps?: sysOps[]
}

export interface addSysOpParams {
    nodeID: string
    stakeAmount: number
    rewardAddress: string
    from?: string[]
    changeAddr?: string
    username: string
    password: string
}

export interface addSysOpsResp {
    txID: string
    changeAddr: string
}

export interface getCurrentSysOpsParams {
    nodeIDs?: string[]
}
