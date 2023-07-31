<template>
    <modal ref="modal" :title="title" @beforeClose="beforeClose">
        <div class="export_body">
            <p class="selection_num">
                {{ $t('keys.export_key_info', [wallets.length]) }}
            </p>
            <export-wallet
                @success="handleExportSuccess"
                :wallets="wallets"
                ref="export"
            ></export-wallet>
        </div>
    </modal>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'
import ExportWallet from '@/components/wallet/manage/ExportWallet.vue'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'

@Component({
    components: {
        Modal,
        ExportWallet,
    },
})
export default class ExportKeys extends Vue {
    isActive: boolean = false
    title: string = 'Export Keys'

    $refs!: {
        modal: Modal
        export: ExportWallet
    }

    @Prop() wallets!: MnemonicWallet[]

    beforeClose() {
        this.$refs.export.clear()
    }

    open() {
        this.$refs.modal.open()
    }

    close() {
        this.isActive = false
    }

    handleExportSuccess() {
        // @ts-ignore
        this.$refs.modal.close()
        this.close()
    }
}
</script>

<style scoped lang="scss">
@use '../../main';

.export_body {
    padding: 20px;
    width: 100%;
    max-width: 480px;
    min-height: 315px;
}

.selection_num {
    color: #fff;
    font-family: PingFang SC;
    font-size: 16px;
    padding-left: 20px;
}

.explain {
    text-align: center;
}

@include main.mobile-device {
    .export_body {
        max-width: 100%;
    }
}
</style>

<style lang="scss">
@use '../../main';

.v-tab.v-tab {
    font-weight: 700;
}

.v-tabs-slider-wrapper {
    color: main.$secondary-color;
    caret-color: main.$secondary-color;
    height: 3px !important;
}
</style>
