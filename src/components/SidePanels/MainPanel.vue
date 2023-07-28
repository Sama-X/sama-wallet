<template>
    <div class="main_panel">
        <transition name="fade" mode="out-in">
            <transaction-history-panel class="panel_content"></transaction-history-panel>
        </transition>
    </div>
</template>
<script>
import TransactionHistoryPanel from './TransactionHistoryPanel'
import DayNightToggle from '@/components/misc/DayNightToggle'

export default {
    components: {
        TransactionHistoryPanel,
        DayNightToggle,
    },
}
</script>
<style scoped lang="scss">
@use '../../main';

.main_panel {

}

.hover_but {
    transition-duration: 0.2s;
    cursor: pointer;
    &:hover {
        box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.3);
    }
}

.panel_content {
    overflow: auto;
    background-color: var(--bg-wallet-light);
    height: 100%;
}

@include main.medium-device {
    .panel_nav {
        padding: 12px 16px;
    }
}
</style>
