<template>
    <modal ref="modal" title="Extended Public Key (Beta)" class="modal_main">
        <div class="singleton_modal_body">
            <p>This extended public key is used to derive all your X and P chain addresses.</p>
            <p class="key_raw">
                <span>
                    Path:
                    <b>m/44'/9000'/0'</b>
                </span>
                <br />
                <br />
                {{ xpub }}
            </p>
            <p class="warning_text">
                Warning: This extended public key can be used to derive your wallet's addresses and
                should be shared with caution.
            </p>
        </div>
    </modal>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/modals/Modal.vue'

@Component({
    components: {
        Modal,
    },
})
export default class XpubModal extends Vue {
    @Prop({ default: '' }) xpub!: string

    open(): void {
        let modal = this.$refs.modal as Modal
        modal.open()
    }
}
</script>
<style scoped lang="scss">
.singleton_modal_body {
    width: 520px;
    max-width: 100%;
    padding: 20px;
}

.key_raw {
    text-align: center;
    word-break: break-all;
    background-color: var(--bg);
    margin: 15px 0px !important;
    border-radius: 2px;
    padding: 6px 12px;

    span {
        font-size: 16px;
    }
}

.warning_text {
    border: 1px solid var(--secondary-color);
    margin-top: 30px !important;
    margin-bottom: 20px !important;
    border-radius: 8px;
    padding: 10px 20px;
    color: var(--secondary-color);
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 500;
}
</style>
