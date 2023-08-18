<template>
    <div class="transfer_card">
        <!--        <h1>{{ $t('transfer.title') }}</h1>-->
        <div v-if="networkStatus !== 'connected'" class="disconnected">
            <p>{{ $t('transfer.disconnected') }}</p>
        </div>
        <div class="card_body" v-else>
            <FormC v-show="formType === 'C'">
                <ChainInput v-model="formType" :disabled="isConfirm"></ChainInput>
            </FormC>
            <div class="new_order_Form" v-show="formType === 'X'">
                <div>
                    <div class="to_address">
                        <h4>{{ $t('transfer.to') }}</h4>
                        <qr-input
                            v-model="addressIn"
                            class="qrIn hover_border"
                            placeholder="xxx"
                            :disabled="isConfirm"
                        ></qr-input>
                    </div>
                    <div>
                        <h4>Amount</h4>
                        <input
                            class="memo"
                            placeholder="Amount"
                            type="number"
                            :disabled="isConfirm"
                            v-model="memo"
                        />
                    </div>
                    <div class="fees">
                        <p>
                            {{ $t('transfer.fee_tx') }}
                            <span>{{ showDND(txFee) }} tDND</span>
                        </p>
                        <p>
                            {{ $t('transfer.total_avax') }}
                            <span>{{ showDND(totalUSD, 3) }} USD</span>
                        </p>
                    </div>
                    <div class="checkout">
                        <ul class="err_list" v-if="formErrors.length > 0">
                            <li v-for="err in formErrors" :key="err">
                                {{ err }}
                            </li>
                        </ul>
                        <template v-if="!isConfirm">
                            <v-btn
                                depressed
                                class="button_secondary"
                                :ripple="false"
                                @click="confirm"
                                :loading="isChecking"
                                :disabled="!canSend"
                                block
                            >
                                Confirm
                            </v-btn>
                        </template>
                        <template v-else-if="isConfirm && !isSuccess">
                            <v-btn
                                depressed
                                class="button_secondary"
                                :loading="isAjax"
                                :ripple="false"
                                @click="submit"
                                :disabled="!canSend"
                                block
                            >
                                {{ $t('transfer.send') }}
                            </v-btn>
                            <v-btn
                                text
                                block
                                small
                                style="margin-top: 20px !important; color: var(--primary-color)"
                                @click="cancelConfirm"
                            >
                                Cancel
                            </v-btn>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Ref } from 'vue-property-decorator'

import TxList from '@/components/wallet/transfer/TxList.vue'
import Big from 'big.js'

import NftList from '@/components/wallet/transfer/NftList.vue'

//@ts-ignore
import { QrInput } from '@avalabs/vue_components'
import { ava, avm, isValidAddress, bintools } from '../../AVA'
import FaucetLink from '@/components/misc/FaucetLink.vue'
import { ITransaction } from '@/components/wallet/transfer/types'
import { UTXO } from 'avalanche/dist/apis/avm'
import { Buffer, BN } from 'avalanche'
import TxSummary from '@/components/wallet/transfer/TxSummary.vue'
import { priceDict, IssueBatchTxInput } from '@/store/types'
import { WalletType } from '@/js/wallets/types'
import { bnToBig } from '@/helpers/helper'
import * as bip39 from 'bip39'
import FormC from '@/components/wallet/transfer/FormC.vue'
import { ChainIdType } from '@/constants'

import ChainInput from '@/components/wallet/transfer/ChainInput.vue'
import AvaAsset from '../../js/AvaAsset'
import { TxState } from '@/components/wallet/earn/ChainTransfer/types'
import { SingletonWallet } from '../../js/wallets/SingletonWallet'
import axios from 'axios'
import { AvaNetwork } from '@/js/AvaNetwork'

@Component({
    components: {
        FaucetLink,
        TxList,
        QrInput,
        NftList,
        TxSummary,
        FormC,
        ChainInput,
    },
})
export default class Transfer extends Vue {
    formType: ChainIdType = 'X'
    showAdvanced: boolean = false
    isAjax: boolean = false
    isChecking: boolean = false
    addressIn: string = ''
    memo: string = ''
    orders: ITransaction[] = []
    nftOrders: UTXO[] = []
    formErrors: string[] = []

    formAddress: string = ''
    formOrders: ITransaction[] = []
    formNftOrders: UTXO[] = []
    formMemo = ''

    isConfirm = false
    isSuccess = false
    txId = ''

    canSendAgain = false
    txState: TxState | null = null

    $refs!: {
        txList: TxList
        nftList: NftList
    }

    confirm() {
        let isValid = this.formCheck()
        if (!isValid) return

        this.formOrders = [...this.orders]
        this.formNftOrders = [...this.nftOrders]
        this.formAddress = this.addressIn
        this.formMemo = this.memo

        this.isConfirm = true
    }

    cancelConfirm() {
        this.formErrors = []
        this.formMemo = ''
        this.formOrders = []
        this.formNftOrders = []
        this.formAddress = ''
        this.isConfirm = false
    }

    updateTxList(data: ITransaction[]) {
        this.orders = data
    }

    updateNftList(val: UTXO[]) {
        this.nftOrders = val
    }

    formCheck() {
        this.isChecking = true
        this.formErrors = []
        let err = []

        let addr = this.addressIn

        if (!isValidAddress(addr)) {
            err.push('Invalid address.')
        }
        var reg = /^\d+[.]?\d{0,9}$/

        if (!this.memo) {
            err.push('You must set the Amount.')
        } else if (!reg.test(this.memo)) {
            err.push('Up to nine decimal places after the decimal')
        }

        this.formErrors = err
        this.isChecking = false
        if (err.length === 0) {
            return true
        } else {
            this.$store.dispatch('Notifications/add', {
                text: err.join('<br>'),
                type: 'error',
            })
            return false
        }
    }

    showDND(value: Big, length: number = 9) {
        return value.div(new Big(10).pow(9)).toLocaleString(length).toLocaleString()
    }

    startAgain() {
        this.clearForm()
        this.cancelConfirm()
    }

    clearForm() {
        this.addressIn = ''
        this.memo = ''

        if (this.hasNFT) {
            this.$refs.nftList.clear()
        }
    }

    async onsuccess(txId: string) {
        setTimeout(() => {
            this.isAjax = false
            this.isSuccess = false
            this.isConfirm = false
            this.memo = ''
            this.addressIn = ''
            this.txId = ''
        }, 1000)
        this.$store.dispatch('Notifications/add', {
            title: this.$t('transfer.success_title'),
            message: this.$t('transfer.success_msg'),
            type: 'success',
        })
    }

    updateSendAgainLock() {
        if (!this.wallet.isFetchUtxos) {
            this.canSendAgain = true
        } else {
            setTimeout(() => {
                this.updateSendAgainLock()
            }, 1000)
        }
    }

    onerror(err: any) {
        this.formErrors = [err]
        this.isAjax = false
        this.isConfirm = false
        this.$store.dispatch('Notifications/add', {
            title: this.$t('transfer.error_title'),
            message: this.$t('transfer.error_msg'),
            type: 'error',
        })
    }

    submit() {
        let _this = this
        this.isAjax = true
        this.formErrors = []

        let privKeyObj = this.wallet as SingletonWallet
        let formDataObj = new FormData()
        let amount = Big(this.memo).times(1_000_000_000)
        formDataObj.append('chain_id', this.network.chainId)
        formDataObj.append('address', this.formAddress)
        formDataObj.append('priv_key', privKeyObj.ethKeyBech)
        formDataObj.append('amount', amount.toString())
        axios
            .post(this.network.url + '/transfer', formDataObj)
            .then((res) => {
                this.canSendAgain = false
                if (res.data.error) {
                    _this.onerror(res.data.error.message)
                    return
                }
                _this.onsuccess(res.data.result.txId)
            })
            .catch((err) => {
                _this.onerror(err)
            })
    }
    async initAmout() {
        console.log('object')
    }

    async waitTxConfirm(txId: string) {
        let status = await avm.getTxStatus(txId)
        if (status === 'Unknown' || status === 'Processing') {
            // if not confirmed ask again
            setTimeout(() => {
                this.waitTxConfirm(txId)
            }, 500)
            return false
        } else if (status === 'Dropped') {
            // If dropped stop the process
            this.txState = TxState.failed
            return false
        } else {
            // If success display success page
            this.txState = TxState.success
            this.onsuccess(txId)
        }
    }

    get network(): AvaNetwork {
        return this.$store.state.Network.selectedNetwork
    }

    get networkStatus(): string {
        let stat = this.$store.state.Network.status
        return stat
    }

    get hasNFT(): boolean {
        // return this.$store.getters.walletNftUTXOs.length > 0
        return this.$store.state.Assets.nftUTXOs.length > 0
    }

    get faucetLink() {
        let link = process.env.VUE_APP_FAUCET_LINK
        if (link) return link
        return null
    }
    get canSend() {
        if (!this.addressIn) return false

        // if (
        //     this.orders.length > 0 &&
        //     this.totalTxSize.eq(new BN(0)) &&
        //     this.nftOrders.length === 0
        // ) {
        //     return false
        // }

        // if (this.orders.length === 0 && this.nftOrders.length === 0) return false

        return true
    }
    get totalTxSize() {
        let res = new BN(0)
        for (var i = 0; i < this.orders.length; i++) {
            let order = this.orders[i]
            if (order.amount) {
                res = res.add(this.orders[i].amount)
            }
        }

        return res
    }
    get avaxTxSize() {
        let res = new BN(0)
        for (var i = 0; i < this.orders.length; i++) {
            let order = this.orders[i]
            if (!order.asset) continue
            if (order.amount && order.asset.id === this.avaxAsset.id) {
                res = res.add(this.orders[i].amount)
            }
        }

        return res
    }
    get avaxAsset(): AvaAsset {
        return this.$store.getters['Assets/AssetAVA']
    }

    get wallet(): WalletType {
        return this.$store.state.activeWallet
    }

    get txFee(): Big {
        let fee = avm.getTxFee()
        return bnToBig(fee)
    }

    get totalUSD(): Big {
        let amount = Big(this.memo || '0').times(1_000_000_000)
        let total = amount.add(this.txFee)
        let usdPrice = this.priceDict.usd || 1
        let usdBig = total.times(usdPrice)
        return usdBig
    }

    get addresses() {
        return this.$store.state.addresses
    }

    get priceDict(): priceDict {
        return this.$store.state.prices
    }

    get nftUTXOs(): UTXO[] {
        return this.$store.state.Assets.nftUTXOs
    }

    deactivated() {
        this.startAgain()
    }

    activated() {
        this.clearForm()

        if (this.$route.query.chain) {
            let chain = this.$route.query.chain as string
            if (chain === 'X') {
                this.formType = 'X'
            } else {
                this.formType = 'C'
            }
        }

        if (this.$route.query.nft) {
            let utxoId = this.$route.query.nft as string
            let target = this.nftUTXOs.find((el) => {
                return el.getUTXOID() === utxoId
            })

            if (target) {
                this.$refs.nftList.addNft(target)
            }
        }
    }
}
</script>

<style lang="scss">
.advanced_panel {
    .v-expansion-panel-header {
        padding: 0;
        font-size: 12px;
        font-weight: normal;
        color: #2c3e50;
        min-height: auto !important;
        margin-bottom: 10px;
    }
    .v-expansion-panel-content__wrap {
        padding: 0 !important;
    }

    .v-icon {
        font-size: 12px;
    }
}
</style>
<style scoped lang="scss">
@use '../../main';

$padLeft: 24px;
$padTop: 8px;

.disconnected {
    padding: 30px;
    text-align: center;
    background-color: var(--bg-light);
}

.explain {
    font-size: 12px;
    color: var(--primary-color-light);
}
h1 {
    font-weight: normal;
}
h4 {
    display: block;
    text-align: left;
    font-size: 12px;
    font-weight: bold;
    margin: 12px 0;
}

.send_to {
    display: flex;
    margin-bottom: 10px;
}

.addressIn >>> input {
    color: var(--bg) !important;
    padding: 5px 6px !important;
    text-align: center;
    letter-spacing: 2px;
    font-size: 12px;
}

.addressIn >>> input::-webkit-input-placeholder {
    color: var(--primary-color-light) !important;
}

.addressIn .v-input__slot:before {
    display: none;
}

.readerBut {
    margin-top: 4px;
    display: flex;
    background-color: #404040;
    /*cursor: pointer;*/
}
.readerBut button {
    opacity: 0.6;
    outline: none;
    padding: 6px 12px;
    margin: 0px auto;
}
.readerBut:hover button {
    opacity: 1;
}

.memo {
    font-size: 14px;
    background-color: var(--bg-light);
    resize: none;
    width: 100%;
    height: 80px;
    border-radius: 2px;
    padding: 4px 12px;
    color: white !important;
}

.radio_buttons {
    margin-top: 15px;
}

.tx_info {
    text-align: left;
    font-size: 14px;
}

.new_order_Form {
    display: grid;
    grid-template-columns: auto;
    column-gap: 45px;
}

.new_order_Form > div {
    /*padding: 10px 0;*/
    margin-bottom: 15px;
}
.lists {
    /*padding-right: 45px;*/
    border-right: 1px solid var(--bg-light);
    grid-column: 1/3;

    /*> div{*/
    /*    margin: 14px 0;*/
    /*}*/
}

.tx_list {
    margin-bottom: 14px;
}

.fees {
    margin: 14px 0;
    border-top: 1px solid var(--bg-light);
    padding-top: 14px;
}

.fees p {
    text-align: left;
    font-size: 13px;
    color: var(--primary-color-light);
}

.fees span {
    float: right;
}

.qrIn .readerIn {
    background-color: white !important;
}

label {
    color: var(--primary-color-light);
    font-size: 12px;
    font-weight: bold;
    margin: 2px 0 !important;
}

.faucet {
    margin-top: 20px;
}

.advanced {
    padding: 20px 0px !important;
    margin-bottom: 20px;
}

.advanced .advancedBody {
    transition-duration: 0.2s;
}

.err_list {
    font-size: 12px;
    color: var(--error);
    margin: 6px 0;
}

.checkout {
    margin-top: 14px;
}

.confirm_val {
    background-color: var(--bg-light);
    word-break: break-all;
    padding: 8px 16px;
}
.button_secondary,
.theme--light.v-btn.v-btn--disabled {
    color: white !important;
}

//@media only screen and (max-width: 600px) {
//    .order_form {
//        display: block;
//    }
//    .asset_select button {
//        flex-grow: 1;
//        word-break: break-word;
//    }
//}

@include main.medium-device {
    .new_order_Form {
        grid-template-columns: auto;
        column-gap: 25px;
    }
}

@include main.mobile-device {
    .transfer_card {
        display: block;
        grid-template-columns: none;
    }

    .but_primary {
        width: 100%;
    }

    .new_order_Form {
        display: block;
        grid-template-columns: none;
    }

    .tx_list {
        padding: 0;
        border: none;
    }

    .lists {
        border: none;
    }
}
</style>
