<template>
    <div v-if="isEVMSupported">
        <label>{{ $t('transfer.source_chain.title') }}</label>
        <div class="chain_select">
            <button :active="formType === 'X'" @click="set('X')">X</button>
            <!-- <button :active="formType === 'C'" @click="set('C')">C</button> -->
        </div>
        <div class="content">
            <h6>No Data</h6>

            <!-- <img class="logo router-link-active" src="@/assets/priviteKeyBg.png" />
            <h6>Drops are limited to 1 request in 24 hours.</h6>
            <div>
                <input
                    type="text"
                    v-model="addressUrl"
                    placeholder="addressUrl"
                    style="
                        background: var(--primary-color) !important;
                        line-height: 40px;
                        padding: 0 10px;
                        margin: 10px 0;
                        width: 340px;
                        color: white;
                    "
                />
            </div>
            <div v-if="!isAddress" style="color: red">You must set the URL.</div>
            <div v-if="isSuccess" style="color: green">Transfer succeeded</div>
            <div class="redWord">This is a testnet faucet. Funds are not real.</div>
            <div>
                <button
                    :active="formType === 'X'"
                    @click="receiveFunc()"
                    style="
                        background-color: var(--primary-color) !important;
                        color: white !important;
                        text-decoration: none;
                        padding: 5px 10px;
                        border-radius: 4px;
                        margin-top: 10px;
                        width: 340px;
                        text-align: center;
                    "
                >
                    REQUEST 2 SAMA
                </button>
            </div> -->
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'
import { ChainIdType } from '@/constants'
import { CurrencyType } from '@/components/misc/CurrencySelect/types'
import axios from 'axios'
import { ava, avm, isValidAddress, bintools } from '../../../AVA'
import AvaAsset from '../../../js/AvaAsset'

@Component
export default class ChainInput extends Vue {
    addressUrl = ''
    isLian = '26xtZpN5tohRZhVLwusazxjm7nmJMRqbeAtoRwJxDVpFgdqqqF'
    isAddress = true
    isSuccess = false
    @Model('change', { type: String }) readonly formType!: CurrencyType
    @Prop({ default: false }) disabled!: boolean

    set(val: ChainIdType) {
        if (this.disabled) return
        this.$emit('change', val)
    }

    get wallet() {
        return this.$store.state.activeWallet
    }

    get isEVMSupported() {
        this.getLian()
        return this.wallet.ethAddress
    }

    getLian() {
        axios
            .post('http://154.40.42.152:9666/ext/bc/P', {
                jsonrpc: '2.0',
                method: 'platform.getBlockchains',
                params: {},
                id: 1,
            })
            .then((res) => {
                for (let i in res.data.result.blockchains) {
                    if (res.data.result.blockchains[i].name == 'sama2') {
                        return res.data.result.blockchains[i]
                    }
                }
            })
    }
    receiveFunc() {
        let _this = this
        if (!this.addressUrl) {
            _this.isAddress = false
            return false
        } else {
            let lian = _this.getLian()
            if (lian) {
                axios
                    .post('http://154.40.42.152:9666/ext/bc/' + lian + '/public', {
                        jsonrpc: '2.0',
                        method: 'samavm.transfer',
                        params: {
                            to: _this.addressUrl,
                            units: 1000000,
                            privKey: 'PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN',
                        },
                        id: 1,
                    })
                    .then((res) => {
                        _this.isAddress = true
                        _this.addressUrl = ''
                        _this.initAmout()
                    })
            }
        }
    }
    async initAmout() {
        // const res = await avm.getAssetDescription('AVAX')
        // const id = bintools.cb58Encode(res.assetID)
        let _this = this
        let lian = _this.getLian()
        if (lian) {
            axios
                .post('http://154.40.42.152:9666/ext/bc/' + lian + '/public', {
                    jsonrpc: '2.0',
                    method: 'samavm.balance',
                    params: {
                        address: '0x' + _this.wallet.ethAddress,
                    },
                    id: 1,
                })
                .then((resData) => {
                    // _this.samaInfoNumber = resData.data.result.balance
                    _this.isSuccess = true
                    // const asset = new AvaAsset(
                    //     id,
                    //     res.name,
                    //     res.symbol,
                    //     resData.data.result.balance
                    // )
                    // const asset = new AvaAsset(
                    //     '2TGBXcnwx5PqiXWiqxAKUaNSqDguXNh1mxnp82jui68hxJSZAx',
                    //     'sama',
                    //     'SAMA',
                    //     resData.data.result.balance
                    // )
                    // _this.$store.commit('addAsset', asset)
                })
        }
    }
}
</script>
<style scoped lang="scss">
@use '../../../main';
label {
    color: var(--primary-color-light);
}
.chain_select {
    display: flex;
    width: max-content;
    > button {
        //border: 1px solid var(--primary-color);
        //margin-right: 14px;
        padding-right: 14px;
        opacity: 0.2;
        transition-duration: 0.1s;
        cursor: pointer;
        color: var(--primary-color);
        //background-color: var(--bg-light);
        display: flex;
        align-items: center;
        font-size: 28px;

        &:hover {
            opacity: 1;
        }
        &[active] {
            //background-color: var(--secondary-color);
            color: var(--secondary-color);
            //border-color: var(--primary-color-light);
            opacity: 1;
        }
    }
}
.content {
    width: 340px;
    text-align: left;
    max-width: 100%;
    margin: 0px auto;
    .logo {
        height: 30px;
        max-height: none !important;
        object-fit: contain;
        margin: 10px auto;
    }
    h6 {
        text-align: center;
        font-size: 16px;
        margin: 10px 0;
        color: var(--primary-color-light);
    }
    .redWord {
        height: 48px;
        line-height: 48px;
        border-radius: 4px;
        border: 1px solid #e84142;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e84142;
        margin-bottom: 10px;
        text-align: center;
    }
}

@include main.mobile-device {
    .chain_select {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 14px;
        > button {
            margin: 0;
            justify-content: center;
            text-align: center;
            background-color: var(--bg-light);
            color: var(--primary-color-light);

            &[active] {
                //background-color: var(--secondary-color);
                color: var(--primary-color);
                //color: #fff;
            }
        }
    }
}
</style>
