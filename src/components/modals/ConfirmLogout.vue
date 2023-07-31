<template>
    <modal ref="modal" title="Confirm Logout" class="modal_main" :can_close="false">
        <div class="confirm_body">
            <p style="text-align: center">
                {{ $t('logout.confirmation') }}
            </p>

            <div class="logout_panel">
                <v-btn class="ava_button button_primary" @click="submit" :loading="isLoading">
                    {{ $t('logout.button_conf') }}
                </v-btn>
                <button class="ava_button_secondary" @click="close">
                    {{ $t('logout.button_cancel') }}
                </button>
            </div>
        </div>
    </modal>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/modals/Modal.vue'
import CopyText from '@/components/misc/CopyText.vue'

@Component({
    components: {
        Modal,
        CopyText,
    },
})
export default class ConfirmLogout extends Vue {
    isLoading = false
    @Prop({ default: '' }) phrase!: string

    open(): void {
        let modal = this.$refs.modal as Modal
        modal.open()
    }

    close(): void {
        let modal = this.$refs.modal as Modal
        modal.close()
    }

    async submit() {
        this.isLoading = true
        await this.$store.dispatch('logout')
        await this.$store.dispatch('Notifications/add', {
            title: 'Logout',
            message: 'You have successfully logged out of your wallet.',
        })
        this.isLoading = false
        this.close()
    }
}
</script>
<style scoped lang="scss">
.confirm_body {
    width: 400px;
    max-width: 100%;
    padding: 30px;

    p {
        padding: 60px 0px;
    }

    .logout_panel {
        display: flex;
        align-items: space-between;
    }
    .logout_panel button {
        height: 50px;
        flex-shrink: 0;
        flex: 1;
        padding: 0;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1) !important;

        &:hover {
            background: var(--secondary-color) !important;
            opacity: 1;
        }

        &:last-child {
            margin-left: 20px;
        }
    }
}
</style>
