<template>
    <div class="access_card">
        <div class="content">
            <h1>Private Key</h1>
            <!-- <img class="logo router-link-active" src="@/assets/priviteKeyBg.png" /> -->
            <!-- <h6>Drops are limited to 1 request in 24 hours.</h6> -->
            <form @submit.prevent="access">
                <v-text-field
                    class="pass"
                    label="Private Key"
                    dense
                    solo
                    flat
                    type="password"
                    v-model="privatekey"
                    hide-details
                ></v-text-field>
                <!-- <v-text-field
                    class="pass"
                    label="Hexadecimal Address (0x...)"
                    dense
                    solo
                    flat
                    type="password"
                    v-model="privatekey"
                    hide-details
                ></v-text-field> -->
                <p class="err">{{ error }}</p>
                <!-- <div class="redWord">This is a testnet faucet. Funds are not real.</div> -->
                <v-btn
                    class="ava_button button_primary"
                    @click="access"
                    :loading="isLoading"
                    :disabled="!canSubmit"
                    depressed
                >
                    Access Wallet
                    <!-- REQUEST 2 SAMA -->
                </v-btn>
            </form>
            <router-link to="/access" class="link">Cancel</router-link>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ImportKeyfileInput } from '@/store/types'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { privateToAddress } from 'ethereumjs-util'
import { bintools } from '@/AVA'
import { Buffer } from 'avalanche'
import { strip0x } from '@avalabs/avalanche-wallet-sdk'

@Component
export default class PrivateKey extends Vue {
    privatekey: string = ''
    isLoading: boolean = false
    error: string = ''
    async access() {
        if (!this.canSubmit || this.isLoading) return
        let parent = this
        this.error = ''
        this.isLoading = true
        let key = strip0x(this.privatekey)

        try {
            let res = await this.$store.dispatch('accessWalletSingleton', key)
            this.onsuccess()
        } catch (e) {
            this.onerror('Invalid Private Key.')
        }
    }
    onsuccess() {
        this.isLoading = false
        // this.privatekey = ''
    }
    onerror(e: any) {
        this.error = e
        this.privatekey = ''
        this.isLoading = false
    }
    get canSubmit(): boolean {
        if (!this.privatekey) {
            return false
        }
        return true
    }
}
</script>
<style scoped lang="scss">
@use '../../main';
.pass {
    background-color: var(--bg) !important;
}
.ava_button {
    width: 100%;
    margin-bottom: 22px;
}
.access_card {
    /*max-width: 80vw;*/
    background-color: var(--bg-light);
    padding: main.$container-padding;
    width: 100%;
    /*max-width: 240px;*/
    /*max-width: 1000px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
}
.content {
    width: 340px;
    max-width: 100%;
    margin: 0px auto;
    .logo {
        height: 60px;
        max-height: none !important;
        object-fit: contain;
        margin: 20px auto;
    }
    h6 {
        text-align: left;
        margin: 20px 0;
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
    }
}
h1 {
    font-size: main.$m-size;
    font-weight: 400;
    margin-bottom: 30px;
}
.file_in {
    margin: 30px auto 10px;
    font-size: 13px;
    border: none !important;
    background-color: var(--bg) !important;
    /*min-width: 200px*/
}
a {
    color: main.$primary-color-light !important;
    text-decoration: underline !important;
    margin: 10px 0 20px;
}
.link {
    color: var(--secondary-color);
}
.remember {
    margin: 12px 0;
}
.err {
    font-size: 13px;
    color: var(--error);
    margin: 14px 0px !important;
}
@media only screen and (max-width: main.$mobile_width) {
    h1 {
        font-size: main.$m-size-mobile;
    }
    .but_primary {
        width: 100%;
    }
}
</style>
