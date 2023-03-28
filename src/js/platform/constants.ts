import { Avalanche } from 'avalanche/src'

export const MINUTE_MS = 60000
export const HOUR_MS = MINUTE_MS * 60
export const DAY_MS = HOUR_MS * 24
export type ChainIdType = 'X' | 'P' | 'C'
export type KYCType = 'Request' | 'Submit'

export const JSON_SERVER: string = 'http://192.168.0.188:3000'
export const NODE_SERVER: string = 'http://192.168.0.188:9666'
export const AVA_LOCAL: string = '192.168.0.188'
export const AVA_PORT: number = 9650
export const AVA_PROTOCOL: string = 'http'
export const AVA_LOCAL_ID: number = 1
export const AVA_NET_ID: number = 8888

export type SYSTEM_ROLE = 'SysOp' | 'Supervisor' | 'Spv' // TODO - Normal user???

export class AvaSingle {
    private static _ava: Avalanche

    getInstance(): Avalanche {
        if (!AvaSingle._ava) {
            AvaSingle._ava = new Avalanche(AVA_LOCAL, AVA_PORT, AVA_PROTOCOL, AVA_NET_ID)
        }
        return AvaSingle._ava
    }
}

export const CORS_ALL = {
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
}

export const UserName = 'yutest'

export const Password = 'yt64854331'

export const Category = ['资料审核', '地址激活', '权限申请', '揭秘提案', '揭秘事件']

export const Status = ['已提交，审核中', '审核通过', '未通过']

export const UserID: string[] = [
    'UserID-9sxt3byiMiL3AEWx81eVb8eUKpHX1pQQG',
    'UserID-9sxt3byiMiL3AEWx81eVaYgnNePfRkiv',
    'UserID-9sxt3byiMiL3AEWx8NSeH3AR91uZy6dNk',
    'UserID-9sxt3byiMiL3AEWx8NSeH3AR8VXf5mazc',
    'UserID-9sxt3byiMiKVYjqzNxrYycAaPQnUyCNEZ',
    'UserID-9sxt3byiMiKVYjqzNxrYycAaPSH9wyRBX',
]

export const ActionID: string[] = ['ActionID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg']
