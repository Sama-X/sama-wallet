<template>
    <div class="home_view">
        <div class="header">
            <div>
                <button @click="tab = 'auditList'" :active="tab == 'auditList'" data-cy="auditList">
                    资料审核
                </button>
                <button
                    @click="tab = 'revealList'"
                    :active="tab === `revealList`"
                    data-cy="revealList"
                >
                    揭秘事件
                </button>
                <button
                    @click="tab = 'recordsList'"
                    :active="tab === `recordsList`"
                    data-cy="recordsList"
                >
                    审核记录
                </button>
            </div>
            <div style="flex-grow: 1"></div>
        </div>
        <div class="pages">
            <transition-group name="fade" mode="out-in">
                <auditList v-show="tab === `auditList`" key="auditList"></auditList>
                <revealList v-show="tab === `revealList`" key="revealList"></revealList>
                <recordsList v-show="tab === `recordsList`" key="recordsList"></recordsList>
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import auditList from '@/components/wallet/supervise/special/audit.vue'
import revealList from '@/components/wallet/supervise/special/reveal.vue'
import recordsList from '@/components/wallet/supervise/special/records.vue'

@Component({
    components: {
        auditList,
        revealList,
        recordsList,
    },
})
export default class specialView extends Vue {
    @Prop() search!: string
    tab = 'auditList'
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
