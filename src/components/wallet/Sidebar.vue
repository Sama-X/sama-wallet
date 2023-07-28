<template>
    <div class="wallet_sidebar">
        <div class="stick">
            <div class="brand">
                <img v-if="$root.theme === 'day'" src="@/assets/wallet_logo.png" />
                <img v-else src="@/assets/wallet_logo.png" />
                <span class="slogan">GOLDSTREAM</span>
            </div>
            <div class="links">
                <router-link to="/wallet" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/portfolio_nav.png" />
                    <img v-else src="@/assets/sidebar/portfolio_nav_night.png" />
                    {{ $t('wallet.sidebar.portfolio') }}
                </router-link>
                <router-link to="/wallet/transfer" data-cy="wallet_transfer" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/transfer_nav.png" />
                    <img v-else src="@/assets/sidebar/transfer_nav_night.svg" />
                    {{ $t('wallet.sidebar.send') }}
                </router-link>
                <router-link to="/wallet/keys" data-cy="wallet_manage" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/manage_nav.png" />
                    <img v-else src="@/assets/sidebar/manage_nav_night.svg" />
                    {{ $t('wallet.sidebar.manage') }}
                </router-link>
            </div>
            <div class="bottom">
                <AccountMenu class="wallet_link"></AccountMenu>
                <LanguageSelect></LanguageSelect>
            </div>
        </div>
    </div>
</template>
<script>
import LanguageSelect from '@/components/misc/LanguageSelect/LanguageSelect'
import AccountMenu from '@/components/wallet/sidebar/AccountMenu'
export default {
    components: {
        AccountMenu,
        LanguageSelect,
    },
}
</script>
<style lang="scss" scoped>
@use "../../main";

.wallet_sidebar {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 1000;
    overflow: visible !important;

    .stick {
        width: 246px;
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--bg-wallet);
    }
    .alert_icon {
        color: #f00;
        flex-grow: 1;
        justify-content: flex-end;
    }

    .brand {
        height: 88px;
        display: flex;
        align-items: center;
        padding: 30px;

        img {
            width: 38px;
            height: 29px;
            flex-shrink: 0;
        }
        .slogan {
            color: #fff;
            font-family: PingFang SC;
            font-size: 18px;
            font-weight: 600;
            margin-left: 16px;
        }
    }

    .links {
        padding: 0 !important;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        font-size: 16px;

        a {
            opacity: 0.6;
            color: white;
            // color: var(--primary-color-light);
            text-decoration: none;

            img {
                opacity: 0.5;
            }
        }

        .wallet_link {
            height: 66px;
            display: flex;
            align-items: center;
            padding: 14px 24px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        a.router-link-exact-active {
            color: white !important;
            // color: var(--primary-color) !important;
            opacity: 1;
            background-color: #282828;

            img {
                opacity: 1;
            }
        }

        img {
            width: 20px;
            margin-right: 15px;
            object-fit: contain;
        }
    }
}
.wallet_export {
    span {
        display: block;
        margin-right: 15px;
        width: 20px;
    }
}
.bottom {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 30px;

    > * {
        padding: 0px 24px;
        margin-top: 4px;
    }
}

@include main.medium-device {
    .brand {
        height: 90px;
    }
    .links {
        font-size: 12px;
    }
}
</style>
