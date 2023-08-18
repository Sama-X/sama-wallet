<template>
    <div class="stake_view">
        <div v-show="networkStatus !== 'connected'" class="empty">
            <p>{{ $t('stake.error_network') }}</p>
        </div>
        <div class="stake_content" v-show="networkStatus === 'connected'">
            <div class="role" v-if="currentRole != null">
                <div class="role_left">
                    <div class="role_item">{{ $t('stake.stake_type') }}: {{ currentRole }}</div>
                    <div class="role_item">
                        {{ $t('stake.stake_amount') }}: {{ showDND(stakeAmount) }} tDND
                    </div>
                    <div class="role_item">
                        {{ $t('stake.stake_expired_time') }}: {{ stakeExpireTime.toLocaleString() }}
                    </div>
                </div>
                <div class="role_right">
                    <div>{{ $t('stake.expect_reward') }}: {{ showDND(stakeReward) }} tDND</div>
                    <button :disabled="stakeReward.lte(0)" @click="claim">
                        {{ $t('stake.claim') }}
                    </button>
                </div>
            </div>
            <div class="role" v-else>
                <div>
                    <button @click="stake('7')">{{ $t('stake.stake_work_node') }}</button>
                    <span class="price">
                        &nbsp;{{ $t('stake.price') }}: {{ showDND(workerFee) }} tDND
                    </span>
                </div>
                <div>
                    <button @click="stake('6')">{{ $t('stake.stake_validate_node') }}</button>
                    <span class="price">
                        &nbsp;{{ $t('stake.price') }}: {{ showDND(validtorFee) }} tDND
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { bnToBig } from '@/helpers/helper'
import { AvaNetwork } from '@/js/AvaNetwork'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletType } from '@/js/wallets/types'
import { BN } from 'avalanche'
import axios from 'axios'
import Big from 'big.js'
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

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

    created() {
        setTimeout(() => {
            this.getStakeRole()
        }, 5000)
    }

    get networkStatus(): string {
        let stat = this.$store.state.Network.status
        return stat
    }

    get network(): AvaNetwork {
        return this.$store.state.Network.selectedNetwork
    }

    get chainID(): string {
        return this.network.chainId
    }

    get chainURL(): string {
        return this.network.url
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
        axios.post(this.chainURL + '/get_staker', formDataObj).then((res) => {
            const data = res.data.result || {}
            const stakes = data.stakes || []
            for (let staker of stakes) {
                if (staker.stakerType == 7) {
                    this.currentRole = String(this.$t('stake.stake_work_node'))
                } else if (staker.stakerType == 6) {
                    this.currentRole = String(this.$t('stake.stake_validate_node'))
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
        axios.post(this.chainURL + '/staker', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: 'Failure',
                    message: res.data.error.message,
                    type: 'error',
                })
            } else {
                this.$store.dispatch('Notifications/add', {
                    title: 'Success',
                    message: 'Stake Success',
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
        if (this.currentRole == String(this.$t('stake.stake_work_node'))) {
            staker_type = '7'
        }
        let formDataObj = new FormData()
        formDataObj.append('chain_id', this.chainID)
        formDataObj.append('address', '0x' + wallet.ethAddress)
        formDataObj.append('staker_type', staker_type)
        axios.post(this.chainURL + '/calc_reward', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: 'Failure',
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
        axios.post(this.chainURL + '/claim', formDataObj).then((res) => {
            if (res.data.error) {
                this.$store.dispatch('Notifications/add', {
                    title: 'Failure',
                    message: res.data.error.message,
                    type: 'error',
                })
            } else {
                this.$store.dispatch('Notifications/add', {
                    title: 'Success',
                    message: 'Claim Success',
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
