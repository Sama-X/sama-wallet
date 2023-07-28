<template>
    <div class="home_view">
        <div class="header">
            <div class="left_header">
                <h1>{{ $t('portfolio.assets') }}</h1>
                <div class="tabs">
                    <button
                        @click="tab = 'fungibles'"
                        :active="tab === `fungibles`"
                        data-cy="wallet_fungible"
                    >
                        {{ $t('portfolio.assets1') }}
                    </button>
                    <button
                        @click="tab = 'collectibles'"
                        :active="tab === `collectibles`"
                        data-cy="wallet_nft"
                    >
                        {{ $t('portfolio.assets2') }}
                    </button>
                </div>
            </div>
            <div class="search hover_border">
                <img v-if="$root.theme === 'day'" src="@/assets/search.svg" />
                <img v-else src="@/assets/search_night.svg" />
                <input :placeholder="$t('portfolio.search')" v-model="search" />
            </div>
        </div>
        <div class="pages">
            <transition-group name="fade" mode="out-in">
                <fungibles
                    v-show="tab === `fungibles`"
                    key="fungibles"
                    :search="search"
                ></fungibles>
                <collectibles
                    v-show="tab === `collectibles`"
                    key="collectibles"
                    :search="search"
                ></collectibles>
            </transition-group>
        </div>
    </div>
</template>
<script>
import Fungibles from '@/components/wallet/portfolio/Fungibles'
import Collectibles from '@/components/wallet/portfolio/Collectibles'
export default {
    name: 'WalletHome',
    data() {
        return {
            search: '',
            tab: 'fungibles',
        }
    },
    components: {
        Fungibles,
        Collectibles,
    },
    watch: {
        tab() {
            this.search = ''
        },
    },
}
</script>
<style scoped lang="scss">
@use '../../main';

.home_view {
    display: grid;
    grid-template-rows: max-content 1fr;
}
.header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid transparent;
    flex-wrap: nowrap;
    white-space: nowrap;

    .left_header {
        display: flex;
        flex-direction: column;
        margin-right: 30px;
        justify-content: center;
        width: 100%;
        .tabs {
            padding-left: 20px;
        }
    }

    h1 {
        color: #fff;
        font-family: PingFang SC;
        font-size: 28px;
        font-weight: 600;
        margin-right: 30px;
    }

    button {
        padding: 8px 24px;
        font-size: 14px;
        font-weight: bold;
        margin: 0px 5px;
        text-transform: uppercase;
        outline: none !important;
        color: var(--primary-color-light);

        &[active] {
            color: var(--secondary-color);
            border-bottom: 2px solid var(--secondary-color);
        }
    }
}

.search {
    background-color: var(--bg);
    /*flex-grow: 1;*/
    height: 46px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 13px;
    flex-basis: 420px;
    flex-shrink: 1;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    $icon_w: 36px;

    img {
        border-radius: 4px;
        padding: 6px 0px;
        height: $icon_w;
        width: $icon_w;
        object-fit: contain;
    }

    input {
        margin-left: 6px;
        padding: 0px;
        outline: none;
        border: none !important;
        flex-grow: 1;
        color: white;
        // color: var(--primary-color);

        &::placeholder {
            color: #b3b7d3;
        }
    }
}

.pages {
    /*margin-top: 30px;*/
}

@include main.mobile-device {
    .header {
        display: block;

        > div {
            overflow: hidden;
            display: flex;
        }
        button {
            flex-grow: 1;
            border-radius: 0px;
            margin: 0;
            font-size: 12px;
        }
    }

    .search {
        margin: 15px 0px;
    }

    .pages {
        /*min-height: 100vh;*/
        /*padding-bottom: 30px;*/
    }
}

@include main.medium-device {
    .header {
        button {
            font-size: 13px;

            &[active] {
                border-bottom-width: 2px;
            }
        }
    }

    .search {
        //margin: 15px 0px;
        //flex-basis: 100%;
        flex-grow: 1;
        height: 36px;
        flex-basis: auto;

        img {
            padding: 6px;
            height: 22px;
            width: 22px;
        }
    }
}
</style>
