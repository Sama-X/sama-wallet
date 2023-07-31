<template>
    <div class="export_wallet">
        <p v-if="isDesc" class="explain">{{ $t('keys.export_key_desc') }}</p>
        <form @submit.prevent="download">
            <label>Password (min 9 characters)</label>
            <v-text-field
                type="password"
                placeholder="Password"
                v-model="pass"
                hide-details
                outlined
                dense
                class="formIn"
            ></v-text-field>
            <label>Confirm Password</label>
            <v-text-field
                type="password"
                placeholder="Confirm Password"
                v-model="passConfirm"
                hide-details
                outlined
                dense
                class="formIn"
            ></v-text-field>
            <p class="err">{{ err }}</p>
            <v-btn
                type="submit"
                :disabled="!isValid"
                :loading="isLoading"
                depressed
                block
                class="button_primary"
            >
                Export Wallet
            </v-btn>
        </form>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { ExportWalletsInput } from '@/store/types'

@Component
export default class ExportWallet extends Vue {
    isLoading: boolean = false
    pass: string = ''
    passConfirm: string = ''
    err: string = ''

    @Prop() wallets!: MnemonicWallet[]
    @Prop({ default: true }) isDesc!: boolean

    get isValid(): boolean {
        return this.pass.length >= 9 && this.pass === this.passConfirm ? true : false
    }

    clear() {
        this.isLoading = false
        this.pass = ''
        this.passConfirm = ''
        this.err = ''
    }

    async download() {
        this.isLoading = true
        this.err = ''

        if (!this.wallets) {
            this.isLoading = false
            this.err = 'No wallet selected.'
            return
        }

        let input: ExportWalletsInput = {
            password: this.pass,
            wallets: this.wallets,
        }
        setTimeout(() => {
            this.$store.dispatch('exportWallets', input).then((res) => {
                this.isLoading = false
                this.pass = ''
                this.passConfirm = ''
                this.$store.dispatch('Notifications/add', {
                    title: 'Key File Export',
                    message: 'Your keys are downloaded.',
                })
                // @ts-ignore
                this.$emit('success')
            })
        }, 200)
    }
}
</script>
<style lang="scss">
.export_wallet {
    > p {
        margin: 0px 20px !important;
    }
    form > label {
        margin: 0px 20px !important;
    }
    padding-top: 10px;
    .formIn {
        margin: 16px 20px !important;
        .v-input__slot {
            background-color: var(--bg-night) !important;
        }

        .v-text-field__slot input::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
        }

        .v-text-field__details {
            padding: 0;
        }

        fieldset {
            border: none;
        }
    }
    .button_primary {
        border-radius: 8px;
        flex-shrink: 0;
        height: 50px !important;
        border: 1px solid var(--secondary-color);
        margin-top: 30px !important;
        margin-bottom: 10px;
        font-size: 16px;
        &:hover {
            opacity: 1 !important;
            background-color: var(--secondary-color) !important;
        }
    }
}
</style>
<style lang="scss">
.export_wallet {
    fieldset {
        border: none !important;
    }
}
</style>
<style scoped lang="scss">
@use '../../../main';
@use '../../../light_theme';

.export_wallet {
    font-size: 14px;
    font-family: PingFang SC;
}
.explain {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 20px !important;
}

label {
    color: #fff;
}

.formIn {
    background-color: var(--bg-night) !important;
    font-size: 14px;
    border-radius: 4px;
}

.button_primary {
    margin-top: 10px;
}

.err {
    margin: 4px 0 !important;
    color: var(--error);
}
</style>
