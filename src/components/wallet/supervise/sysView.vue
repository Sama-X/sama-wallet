<template>
    <div class="sys_view">
        <div class="header">
            <div>
                <button @click="tab = 'checking'" :active="tab === `checking`">待审核</button>
                <button @click="tab = 'checked'" :active="tab === `checked`">已审核</button>
            </div>
            <div style="flex-grow: 1"></div>
        </div>
        <div class="pages">
            <transition-group name="fade" mode="out-in">
                <sys-checking-view
                    v-show="tab === `checking`"
                    key="checkingView"
                ></sys-checking-view>
                <sys-checked-view v-show="tab === `checked`" key="checkedView"></sys-checked-view>
            </transition-group>
        </div>
    </div>
</template>

<script>
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import sysCheckingView from '@/components/wallet/supervise/sys/sysCheckingView.vue'
import sysCheckedView from '@/components/wallet/supervise/sys/sysCheckedView.vue'

@Component({
    components: {
        sysCheckingView,
        sysCheckedView,
    },
})
export default class sysView extends Vue {
    tab = 'checking'
}
</script>

<style scoped lang="scss">
@use '../../../main';

.sys_view {
    display: grid;
    grid-template-rows: max-content 1fr;

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