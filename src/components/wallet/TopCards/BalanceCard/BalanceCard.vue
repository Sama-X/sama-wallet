<template>
    <div class="balance_card">
        <UtxosBreakdownModal ref="utxos_modal"></UtxosBreakdownModal>
        <div class="fungible_card">
            <div class="header">
                <div class="refresh">
                    <Spinner v-if="isUpdateBalance" class="spinner"></Spinner>
                    <button v-else @click="initBlance(1)">
                        <img src="@/assets/sync.svg" alt="refresh" />
                    </button>
                </div>
                <h4>{{ $t('top.title2') }}</h4>
                <template v-if="!isBreakdown">
                    <button class="breakdown_toggle" @click="toggleBreakdown">
                        <fa icon="eye"></fa>
                        {{ $t('top.balance.show') }}
                    </button>
                </template>
                <button @click="showUTXOsModal" class="breakdown_toggle">
                    <!-- <RedoOutlined /> -->
                </button>
            </div>
            <div class="balance_row">
                <p class="balance" data-cy="wallet_balance" v-if="!balanceTextRight">
                    {{ showDND(infoNumber) }} tDND
                </p>
                <p class="balance" data-cy="wallet_balance" v-else>
                    {{ showDND(infoNumber) }}
                    tDND
                </p>
            </div>
            <div class="balance_desc">
                <p class="balance_usd">
                    <b>$ {{ showDND(infoNumber) }}</b>
                    USD
                </p>
                <p class="balance_usd" style="background-color: transparent">
                    <b>1 tDND</b>
                    =
                    <b>${{ avaxPriceText }}</b>
                    USD
                </p>
            </div>
        </div>
        <NftCol class="nft_card"></NftCol>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'
import AvaAsset from '@/js/AvaAsset'
import Spinner from '@/components/misc/Spinner.vue'
import NftCol from './NftCol.vue'
import Tooltip from '@/components/misc/Tooltip.vue'

import Big from 'big.js'
import { BN } from 'avalanche/dist'
import { ONEAVAX } from 'avalanche/dist/utils'
import { bnToBig } from '@/helpers/helper'
import { priceDict } from '@/store/types'
import { WalletType } from '@/js/wallets/types'
import UtxosBreakdownModal from '@/components/modals/UtxosBreakdown/UtxosBreakdownModal.vue'
import axios from 'axios'
import { AvaNetwork } from '@/js/AvaNetwork'

@Component({
    components: {
        UtxosBreakdownModal,
        Spinner,
        NftCol,
        Tooltip,
    },
    filters: {
        cleanAvaxBN(val: BN) {
            let big = Big(val.toString()).div(Big(ONEAVAX.toString()))
            return big.toLocaleString()
        },
    },
})
export default class BalanceCard extends Vue {
    isBreakdown = true
    infoNumber: Big = Big(0)

    created() {
        this.initBlance(0)
        setInterval(() => {
            this.initBlance(0)
        }, 10000)
    }
    $refs!: {
        utxos_modal: UtxosBreakdownModal
    }

    get network(): AvaNetwork {
        return this.$store.state.Network.selectedNetwork
    }

    initBlance(type: number) {
        let wallet: WalletType = this.$store.state.activeWallet
        if (!wallet) return
        wallet.isFetchUtxos = true
        let formDataObj = new FormData()
        formDataObj.append('chain_id', this.network.chainId)
        formDataObj.append('address', '0x' + wallet.ethAddress)

        axios
            .post(`${this.network.url}/get_blance`, formDataObj)
            .then((res) => {
                const balance = res.data.result.balance
                this.infoNumber = Big(balance)

                if (type == 1) {
                    this.$store.dispatch('Notifications/add', {
                        title: 'update',
                        message: 'update balance',
                        type: 'success',
                    })
                }
                localStorage.setItem('infoNumber', this.infoNumber + '')
                this.$emit('samaInfoChange', this.infoNumber)
            })
            .finally(() => {
                setTimeout(() => {
                    wallet.isFetchUtxos = false
                }, 2000)
            })
    }

    showUTXOsModal() {
        this.$refs.utxos_modal.open()
    }
    get ava_asset(): AvaAsset | null {
        let ava = this.$store.getters['Assets/AssetAVA']
        return ava
    }

    toggleBreakdown() {
        this.isBreakdown = !this.isBreakdown
    }

    get avmUnlocked(): BN {
        if (!this.ava_asset) return new BN(0)
        return this.ava_asset.amount
    }

    get avmLocked(): BN {
        if (!this.ava_asset) return new BN(0)
        return this.ava_asset.amountLocked
    }

    get evmUnlocked(): BN {
        if (!this.wallet) return new BN(0)
        // convert from ^18 to ^9
        let bal = this.wallet.ethBalance
        return bal.div(new BN(Math.pow(10, 9).toString()))
    }

    get totalBalance(): BN {
        if (!this.ava_asset) return new BN(0)

        let tot = this.ava_asset.getTotalAmount()
        // add EVM balance
        tot = tot.add(this.evmUnlocked)
        return tot
    }

    get totalBalanceBig(): Big {
        if (this.ava_asset) {
            let denom = this.ava_asset.denomination
            let bigTot = bnToBig(this.totalBalance, denom)
            // let bigTot = bnToBig(this.totalBalance, denom)
            return bigTot
        }
        return Big(0)
    }

    get avaxPriceText() {
        return 1
        // return this.priceDict.usd
    }

    get totalBalanceUSD(): Big {
        let usdPrice = this.priceDict.usd
        let usdBig = this.totalBalanceBig.times(Big(usdPrice))
        return usdBig
    }

    get totalBalanceUSDText(): string {
        if (this.isUpdateBalance) return '--'
        return this.totalBalanceUSD.toLocaleString(2)
    }
    // should be unlocked (X+P), locked (X+P) and staked and lockedStakeable
    get balanceText(): number {
        if (this.ava_asset !== null) {
            let denom = this.ava_asset.denomination
            // return this.totalBalanceBig.toLocaleString(denom)
            return denom
        } else {
            // return '?'

            return 0
        }
    }

    get balanceTextLeft(): number {
        // if (this.isUpdateBalance) return '--'
        let text = this.balanceText

        // if (text.includes('.')) {
        //     let left = text.split('.')[0]
        //     return left
        // }
        return text
    }

    get balanceTextRight(): number {
        if (this.isUpdateBalance) return 0
        // if (this.isUpdateBalance) return ''
        let text = this.balanceText
        // if (text.includes('.')) {
        //     let right = text.split('.')[1]
        //     return right
        // }
        // return ''
        return 0
    }

    // Locked balance is the sum of locked AVAX tokens on X and P chain
    get balanceTextLocked(): string {
        if (this.isUpdateBalance) return '--'

        if (this.ava_asset !== null) {
            let denom = this.ava_asset.denomination
            let tot = this.platformLocked.add(this.platformLockedStakeable)
            // let otherLockedAmt = this.platformLocked.add(this.platformLockedStakeable)
            let pLocked = Big(tot.toString()).div(Math.pow(10, denom))
            let amt = this.ava_asset.getAmount(true)
            amt = amt.add(pLocked)

            return amt.toLocaleString(denom)
        } else {
            return '--'
        }
    }

    get balanceTextMultisig() {
        if (this.isUpdateBalance) return '--'

        if (this.ava_asset !== null) {
            let denom = this.ava_asset.denomination
            return bnToBig(this.avmMultisig.add(this.platformMultisig), denom).toLocaleString()
        } else {
            return '--'
        }
    }

    get avmMultisig(): BN {
        if (this.ava_asset !== null) {
            return this.ava_asset.amountMultisig
        } else {
            return new BN(0)
        }
    }

    get platformBalance() {
        return this.$store.getters['Assets/walletPlatformBalance']
    }

    get platformUnlocked(): BN {
        return this.platformBalance.available
    }

    get platformMultisig(): BN {
        return this.platformBalance.multisig
    }

    get platformLocked(): BN {
        return this.platformBalance.locked
    }

    get platformLockedStakeable(): BN {
        return this.platformBalance.lockedStakeable
    }

    get unlockedText() {
        if (this.isUpdateBalance) return '--'

        if (this.ava_asset) {
            let xUnlocked = this.ava_asset.amount
            let pUnlocked = this.platformUnlocked

            let denom = this.ava_asset.denomination

            let tot = xUnlocked.add(pUnlocked).add(this.evmUnlocked)

            let amtBig = bnToBig(tot, denom)

            return amtBig.toLocaleString(denom)
        } else {
            return '--'
        }
    }

    get pBalanceText() {
        if (!this.ava_asset) return '--'
        if (this.isUpdateBalance) return '--'

        let denom = this.ava_asset.denomination
        let bal = this.platformUnlocked
        let bigBal = Big(bal.toString())
        bigBal = bigBal.div(Math.pow(10, denom))

        if (bigBal.lt(Big('1'))) {
            return bigBal.toLocaleString(9)
        } else {
            return bigBal.toLocaleString(3)
        }
    }

    get stakingAmount(): BN {
        return this.$store.getters['Assets/walletStakingBalance']
    }

    get stakingText() {
        let balance = this.stakingAmount
        if (!balance) return '0'
        if (this.isUpdateBalance) return '--'

        let denom = 9
        let bigBal = Big(balance.toString())
        bigBal = bigBal.div(Math.pow(10, denom))

        if (bigBal.lt(Big('1'))) {
            return bigBal.toString()
        } else {
            return bigBal.toLocaleString()
        }
    }

    get wallet(): WalletType | null {
        return this.$store.state.activeWallet
    }

    get isUpdateBalance(): boolean {
        if (!this.wallet) return true
        return this.wallet.isFetchUtxos
    }

    get priceDict(): priceDict {
        return this.$store.state.prices
    }

    get hasLocked(): boolean {
        return (
            !this.avmLocked.isZero() ||
            !this.platformLocked.isZero() ||
            !this.platformLockedStakeable.isZero()
        )
    }
    get hasMultisig(): boolean {
        return !this.avmMultisig.isZero() || !this.platformMultisig.isZero()
    }
    showDND(value: Big) {
        return value.div(new Big(10).pow(9)).toLocaleString(9).toLocaleString()
    }
}
</script>
<style scoped lang="scss">
@use '../../../../main';
.balance_card {
    display: grid;
    grid-template-columns: auto;
    column-gap: 20px;
}

.nft_card {
    // border-left: 2px solid var(--bg-light);
}
.fungible_card {
    height: 100%;
    display: flex !important;
    flex-direction: column;
}

.where_info {
    grid-row: 2;
    grid-column: 1/3;
    margin-top: 8px;
    /*max-width: 460px;*/
}
.header {
    height: 52px;
    display: flex;
    align-items: center;

    h4 {
        margin-left: 12px;
        flex-grow: 1;
        font-size: 20px;
    }
}
h4 {
    font-weight: normal;
}

.alert_cont {
    margin: 0;
}

.balance_row {
    align-items: center;
    margin-top: 12px;
}
.balance {
    font-size: 32px;
    white-space: normal;
    font-weight: 500;
}

.balance_desc {
    display: flex;
    flex-direction: row;
    margin-top: 18px;
}

.balance_usd {
    border-radius: 4px;
    width: max-content;
    background: #262626;
    color: rgba(255, 255, 255, 0.6);
    font-family: PingFang SC;
    font-size: 16px;
    padding: 7px 12px;
    margin-right: 6px !important;
}

.refresh {
    width: 20px;
    height: 20px;
    color: var(--primary-color);

    button {
        outline: none !important;
    }
    img {
        object-fit: contain;
        width: 100%;
    }

    .spinner {
        color: var(--primary-color) !important;
    }
}
.buts {
    width: 100%;
    text-align: right;
}
.buts button {
    font-size: 18px;
    margin: 0px 18px;
    margin-right: 0px;
    position: relative;
    outline: none !important;
}

.buts img {
    height: 20px;
    width: 20px;
    object-fit: contain;
    outline: none !important;
}
.buts button[tooltip]:hover:before {
    border-radius: 4px;
    /*left: 0;*/
    left: 0;
    transform: translateX(-50%);
    content: attr(tooltip);
    position: absolute;
    background-color: #303030;
    bottom: 100%;
    color: #ddd;
    width: max-content;
    max-width: 100px;
    font-size: 14px;
    padding: 4px 8px;
}

.alt_info > div {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    column-gap: 0px;
    margin-top: 12px;
    > div {
        position: relative;
        padding: 0 24px;
        border-right: 2px solid var(--bg-light);
        &:first-of-type {
            padding-left: 0;
        }
        &:last-of-type {
            border: none;
        }
    }

    label {
        font-size: 13px;
        color: var(--primary-color-light);
    }
}

.nft_card {
    padding-left: 20px;
}

.breakdown_toggle {
    color: var(--primary-color-light);
    font-size: 13px;
    outline: none !important;
    margin-left: 12px;

    &:hover {
        color: var(--secondary-color);
    }
}
</style>
