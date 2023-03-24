<template>
    <div class="home_view">
        <div class="header">
            <div>
                <button @click="tab = 'infoView'" :active="tab === `infoView`">资料提交</button>
                <button @click="tab = 'addrView'" :active="tab === `addrView`">地址激活</button>
                <button @click="tab = 'specView'" :active="tab === `specView`">特权申请</button>
                <button @click="tab = 'decyView'" :active="tab === `decyView`">揭秘申请</button>
                <button @click="tab = 'mineView'" :active="tab === `mineView`">我的申请</button>
            </div>
            <div style="flex-grow: 1"></div>
        </div>
        <div class="pages">
            <transition-group name="fade" mode="out-in">
                <infoView v-show="tab === `infoView`" key="infoView"></infoView>
                <addrView v-show="tab === `addrView`" key="addrView"></addrView>
                <specView v-show="tab === `specView`" key="specView"></specView>
                <decyView v-show="tab === `decyView`" key="decyView"></decyView>
                <mineView v-show="tab === `mineView`" key="mineView"></mineView>
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import infoView from '@/components/wallet/supervise/normal/infoView.vue'
import addrView from '@/components/wallet/supervise/normal/addrView.vue'
import specView from '@/components/wallet/supervise/normal/specView.vue'
import decyView from '@/components/wallet/supervise/normal/decyView.vue'
import mineView from '@/components/wallet/supervise/normal/mineView.vue'

@Component({
    components: {
        infoView,
        addrView,
        specView,
        decyView,
        mineView,
    },
})
export default class normalView extends Vue {
    tab = 'infoView'
}
</script>
<style scoped lang="scss">
@use '../../../main';

.details_view {
    display: flex;
    flex-direction: column;
    height: 100%;
}

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
}
</style>
