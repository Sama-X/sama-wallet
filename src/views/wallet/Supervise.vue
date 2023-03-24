<template>
    <div class="home_view">
        <div class="header">
            <h1>{{ $t('supervise.title') }}</h1>
            <button @click="tab = 'normal'" :active="tab === `normal`" data-cy="normal">
                普通用户操作
            </button>
            <template v-if="supervise.level == 1">
                <button @click="tab = 'SPV'" :active="tab === `SPV`" data-cy="SPV">SPV操作</button>
            </template>
            <template v-else-if="supervise.level == 2">
                <button @click="tab = 'SUP'" :active="tab === `SUP`" data-cy="SUP">SUP操作</button>
            </template>
            <template v-else-if="supervise.level == 3">
                <button @click="tab = 'SYS'" :active="tab === `SYS`" data-cy="SYS">SYS操作</button>
            </template>
            <div style="flex-grow: 1"></div>
        </div>
        <div class="pages">
            <transition-group name="fade" mode="out-in">
                <normalView v-show="tab === `normal`" key="normal"></normalView>
                <specialView v-show="tab === `SPV`" key="SPV"></specialView>
                <sup-view v-show="tab === `SUP`" key="SUP"></sup-view>
                <sys-view v-show="tab === `SYS`" key="SYS"></sys-view>
            </transition-group>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import NormalView from '@/components/wallet/supervise/normalView.vue'
import SpecialView from '@/components/wallet/supervise/specialView.vue'
import SupView from '@/components/wallet/supervise/supView.vue'
import SysView from '@/components/wallet/supervise/sysView.vue'

@Component({
    name: 'Supervise',
    components: {
        NormalView,
        SpecialView,
        SupView,
        SysView,
    },
})
export default class Supervise extends Vue {
    tab = 'normal'

    get supervise() {
        let supervise = this.$store.state.Supervise
        return supervise
    }

    mounted() {
        /*
          TODO
            1. get current address from wallet
            2. query all spv, supervisor, sysop
            3. filter address belongs to and set level
         */
        const address = this.$store.state.address
        if (address == 'X-custom1ud3u64v72rywup4e5rhz0deznk6n296779xjx4') {
            this.$store.dispatch('Supervise/updateLevel', { level: 3 }) // 0 普通用户，1 SPV，2 Supervisor，3 SYS
        } else if (address == 'X-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p') {
            this.$store.dispatch('Supervise/updateLevel', { level: 1 })
        } else if (address == 'X-custom1uneys3kpycmh5nr0vn9ha8cac3ta7e7tkl8dn4') {
            this.$store.dispatch('Supervise/updateLevel', { level: 2 })
        }
    }
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
    align-items: center;
    border-bottom: 2px solid transparent;
    flex-wrap: nowrap;
    white-space: nowrap;

    h1 {
        font-weight: normal;
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
    background-color: var(--bg-light);
    border-radius: 4px;
    /*flex-grow: 1;*/
    height: 46px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 13px;
    flex-basis: 420px;
    flex-shrink: 1;
    border: 1px solid transparent;

    $icon_w: 36px;

    img {
        border-radius: 4px;
        padding: 10px 0px;
        background-color: var(--bg-wallet-light);
        /*height: 100%;*/
        height: $icon_w;
        width: $icon_w;
        object-fit: contain;
    }

    input {
        padding: 0px 16px;
        outline: none;
        border: none !important;
        flex-grow: 1;
        color: var(--primary-color);

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
