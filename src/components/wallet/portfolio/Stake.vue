<template>
    <div class="stake_view">
        <div v-show="networkStatus !== 'connected'" class="empty">
            <p>{{ $t('portfolio.error_network') }}</p>
        </div>
        <div class="stake_content" v-show="networkStatus === 'connected'">
            <div class="role" v-if="currentRole != null">
                <div class="role_left">
                    <div class="role_item">质押: {{ currentRole }}</div>
                    <div class="role_item">质押数量: {{ showDND(stakeAmount) }} DND</div>
                    <div class="role_item">
                        质押到期时间: {{ stakeExpireTime.toLocaleString() }}
                    </div>
                </div>
                <div class="role_right">
                    <div>预计收益: {{ showDND(stakeReward) }} DND</div>
                    <button :disabled="stakeReward.lte(0)" @click="claim">领取奖励</button>
                </div>
            </div>
            <div class="role" v-else>
                <div>
                    <button @click="stake('7')">成为工作节点</button>
                    <span class="price">&nbsp;价格: {{ showDND(workerFee) }} DND</span>
                </div>
                <div>
                    <button @click="stake('6')">成为验证节点</button>
                    <span class="price">&nbsp;价格: {{ showDND(validtorFee) }} DND</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { bnToBig } from '@/helpers/helper'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletType } from '@/js/wallets/types'
import { samaUrl } from '@/samaIp'
import { BN } from 'avalanche'
import axios from 'axios'
import Big from 'big.js'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
    components: {},
})
export default class Stake extends Vue {
    currentRole: string = null
    workerFee: Big = bnToBig(new BN(10_000_000_000_000))
    validtorFee: Big = bnToBig(new BN(200_000_000_000_000))
    stakeReward: Big = bnToBig(new BN(0))
    stakeAmount: Big = bnToBig(new BN(0))
    stakeExpireTime: Date = null
    chainID: string = null

    created() {
        this.initLian()
        setTimeout(() => {
            this.getStakeRole()
        }, 3000)
    }

    initLian() {
        axios.post(samaUrl + '/get_block_chain').then((res) => {
            for (let i in res.data.result.blockchains) {
                if (res.data.result.blockchains[i].name == 'lq') {
                    let lian = res.data.result.blockchains[i].id
                    this.chainID = lian
                    return
                }
            }
        })
    }

    get networkStatus(): string {
        let stat = this.$store.state.Network.status
        return stat
    }

    get activeWallet(): WalletType | null {
        return this.$store.state.activeWallet
    }

    getStakeRole() {
        const wallet: WalletType = this.$store.state.activeWallet
        if (!wallet) {
            return
        }
        let formDataObj = new FormData()
        formDataObj.append('chain_id', this.chainID)
        formDataObj.append('address', '0x' + wallet.ethAddress)
        axios.post(samaUrl + '/get_staker', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: '获取质押失败',
                    message: res.data.error.message,
                    type: 'error',
                })
            }
            const data = res.data.result
            const stakes = data.stakes || []
            for (let staker of stakes) {
                if (staker.stakerType == 7) {
                    this.currentRole = '工作节点'
                } else if (staker.stakerType == 6) {
                    this.currentRole = '验证节点'
                }
                this.stakeAmount = new Big(staker.stakeAmount)
                let expireTime = new Date(staker.stakeTime * 1000)
                expireTime.setFullYear(expireTime.getFullYear() + 1)
                this.stakeExpireTime = expireTime
                setTimeout(() => {
                    this.calc_reward()
                }, 3000)
                return
            }
        })
    }

    stake(stakeType: string) {
        const wallet: WalletType = this.$store.state.activeWallet
        if (!wallet) {
            return
        }
        let privKeyObj = wallet as SingletonWallet
        let formDataObj = new FormData()
        formDataObj.append('chain_id', this.chainID)
        formDataObj.append('priv_key', privKeyObj.ethKey)
        formDataObj.append('staker_type', stakeType)
        axios.post(samaUrl + '/staker', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: '质押失败',
                    message: res.data.error.message,
                    type: 'error',
                })
            } else {
                this.$store.dispatch('Notifications/add', {
                    title: '质押成功',
                    message: '质押成功',
                    type: 'success',
                })
            }
        })
    }

    calc_reward() {
        const wallet: WalletType = this.$store.state.activeWallet
        if (!wallet) {
            return
        }
        let staker_type = '6'
        if (this.currentRole == '工作节点') {
            staker_type = '7'
        }
        let formDataObj = new FormData()
        formDataObj.append('chain_id', this.chainID)
        formDataObj.append('address', '0x' + wallet.ethAddress)
        formDataObj.append('staker_type', staker_type)
        axios.post(samaUrl + '/calc_reward', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: '计算奖励失败',
                    message: res.data.error.message,
                    type: 'error',
                })
            }
            let reward = new Big(res.data.result.base)
            reward = reward.add(new Big(res.data.result.yield))
            reward = reward.add(new Big(res.data.result.merit))

            this.stakeReward = reward
        })
    }

    claim() {
        const wallet: WalletType = this.$store.state.activeWallet
        if (!wallet) {
            return
        }
        let privKeyObj = wallet as SingletonWallet
        let formDataObj = new FormData()
        formDataObj.append('chain_id', this.chainID)
        formDataObj.append('priv_key', privKeyObj.ethKey)
        axios.post(samaUrl + '/claim', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: '领取奖励失败',
                    message: res.data.error.message,
                    type: 'error',
                })
            } else {
                this.$store.dispatch('Notifications/add', {
                    title: '领取奖励成功',
                    message: '领取奖励成功',
                    type: 'success',
                })
            }
        })
    }

    showDND(value: Big) {
        return value.div(new Big(10).pow(9)).toLocaleString(9).toLocaleString()
    }
}
</script>
<style scoped lang="scss">
@use '../../../main';
@use './portfolio';

.stake_view {
    display: flex;
    flex-direction: column;
    height: 100%;

    .stake_content {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;

        button {
            border: 1px solid transparent;
            padding: 10px;
            margin: 10px;
            background-color: var(--secondary-color);
            color: #fff;
            border-radius: 8px;

            &:hover {
                opacity: 0.8;
            }

            &:disabled {
                opacity: 0.5;
            }
        }

        .role {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex: 1;

            .role_left {
                flex: 1;
            }

            .role_right {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }

        .role_item {
            height: 40px;
            line-height: 40px;
            color: #fff;
        }
    }
}
</style>
