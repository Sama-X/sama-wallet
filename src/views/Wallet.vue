<template>
    <div class="wallet_container">
        <div class="wallet_view" ref="wallet_view">
            <UpdateKeystoreModal v-if="isManageWarning"></UpdateKeystoreModal>
            <transition name="fade" mode="out-in">
                <sidebar class="panel sidenav"></sidebar>
            </transition>
            <div class="wallet_main">
                <div class="top_panel">
                    <ConfirmLogout ref="logout"></ConfirmLogout>
                    <div class="panel_nav">
                        <!-- <DayNightToggle class="hover_but"></DayNightToggle> -->
                        <network-menu class="net_menu"></network-menu>
                        <button @click="logout" class="logout">
                            {{ $t('logout.button') }}
                        </button>
                    </div>
                </div>
                <div class="body_panel">
                    <div class="body_left_panel">
                        <top-info class="wallet_top"></top-info>
                        <transition name="page_fade" mode="out-in">
                            <keep-alive
                                :exclude="['cross_chain', 'activity', 'advanced', 'earn', 'manage', 'studio']"
                            >
                                <router-view id="wallet_router" :key="$route.path"></router-view>
                            </keep-alive>
                        </transition>
                    </div>
                    <transition name="page_fade" mode="out-in">
                        <main-panel class="panel right_panel"></main-panel>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopInfo from '@/components/wallet/TopInfo.vue'
import Sidebar from '@/components/wallet/Sidebar.vue'
import MainPanel from '@/components/SidePanels/MainPanel.vue'
import UpdateKeystoreModal from '@/components/modals/UpdateKeystore/UpdateKeystoreModal.vue'
import ConfirmLogout from '@/components/modals/ConfirmLogout.vue'
import NetworkMenu from '@/components/NetworkSettings/NetworkMenu.vue'

const TIMEOUT_DURATION = 60 * 7 // in seconds
const TIMEOUT_DUR_MS = TIMEOUT_DURATION * 1000

@Component({
    components: {
        Sidebar,
        MainPanel,
        TopInfo,
        UpdateKeystoreModal,
        ConfirmLogout,
        NetworkMenu,
    },
})
export default class Wallet extends Vue {
    intervalId: ReturnType<typeof setTimeout> | null = null
    logoutTimestamp = Date.now() + TIMEOUT_DUR_MS
    isLogOut = false

    // Set the logout timestamp to now + TIMEOUT_DUR_MS
    resetTimer() {
        this.logoutTimestamp = Date.now() + TIMEOUT_DUR_MS
    }

    checkLogout() {
        let now = Date.now()
        // Logout if current time is passed the logout timestamp
        if (now >= this.logoutTimestamp && !this.isLogOut) {
            this.isLogOut = true
            this.$store.dispatch('timeoutLogout')
        } else {
            if (this.isLogOut) {
                this.$store.dispatch('logout')
            }
        }
    }

    created() {
        this.resetTimer()
        this.intervalId = setInterval(() => {
            this.checkLogout()
            // this.$router.push(this.$route.path)
        }, 1000)
    }

    unload(event: BeforeUnloadEvent) {
        // user has no wallet saved
        if (!localStorage.getItem('w') && this.hasVolatileWallets && this.isLogOut) {
            event.preventDefault()
            this.isLogOut = false
            event.returnValue = ''
            this.$router.push('/wallet/keys')
            this.resetTimer()
        }
    }

    mounted() {
        if (!this.$store.state.activeWallet) {
            this.isLogOut = true
        }
        let view = this.$refs.wallet_view as HTMLDivElement

        view.addEventListener('mousemove', this.resetTimer)
        view.addEventListener('mousedown', this.resetTimer)

        window.addEventListener('beforeunload', this.unload)
    }

    beforeDestroy() {
        let view = this.$refs.wallet_view as HTMLDivElement
        // Remove Event Listeners
        view.removeEventListener('mousemove', this.resetTimer)
        view.removeEventListener('mousedown', this.resetTimer)
        window.removeEventListener('beforeunload', this.unload)
    }

    destroyed() {
        clearInterval(this.intervalId!)
    }

    get isManageWarning(): boolean {
        if (this.$store.state.warnUpdateKeyfile) {
            return true
        }
        return false
    }

    get hasVolatileWallets() {
        return this.$store.state.volatileWallets.length > 0
    }

    logout() {
        // @ts-ignore
        this.$refs.logout.open()
    }
}
</script>

<style lang="scss" scoped>
@use '../main';

.wallet_container {
    height: 100%;
    background-color: var(--bg-wallet);
}
.wallet_view {
    padding-bottom: 0;
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100%;
    background-color: var(--bg-wallet);
}

.sidenav {
    background-color: var(--bg-wallet-light);
}

.panel {
    overflow: auto;
    height: 100%;
}

.top_panel {
    background-color: var(--bg-wallet-light);
    height: 88px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .logout {
        margin-left: auto;
    }
    .panel_nav {
        display: grid;
        grid-template-columns: max-content max-content 1fr;
        padding: 24px 16px;
        font-size: 14px;

        > * {
            outline: none !important;
            padding: 4px 8px;
            border-radius: 4px;
        }
    }
}

.wallet_main {
    display: grid;
    grid-template-rows: max-content 1fr;
    grid-gap: 20px;

    .body_panel {
        display: grid;
        grid-template-columns: 1fr 300px;
        grid-gap: 20px;
        padding: 0 30px;
        padding-bottom: 23px;
        .body_left_panel {
            display: grid;
            grid-template-rows: max-content 1fr;
            grid-gap: 20px;
        }
    }
}

.right_panel {
    border-radius: 8px;
}

#wallet_router {
    padding: 22px 20px;
    background-color: var(--bg-wallet-light);
    border-radius: 8px;
}

.page_fade-enter-active,
.page_fade-leave-active {
    transition: all 0.2s;
}
.page_fade-enter, .page_fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}

@include main.mobile-device {
    .wallet_view {
        display: block;
        column-gap: 9px;
    }
    .wallet_main {
        grid-gap: 9px;
        padding-top: 0;
    }

    .wallet_sidebar {
        display: none;
    }
}

@include main.medium-device {
    .wallet_view {
        .body_panel {
            grid-template-columns: 1fr 240px !important;
        }
    }

    .wallet_main {
    }

    #wallet_router {
        padding: 12px 18px;
    }
}
</style>
