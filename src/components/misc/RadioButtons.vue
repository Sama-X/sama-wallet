<template>
    <div class="radio_buts">
        <button
            v-for="(key, i) in keys"
            :key="key"
            @click="select(key)"
            :active="selection === key"
            class="hover_border"
        >
            {{ labels[i] }}
        </button>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'

@Component
export default class RadioButtons extends Vue {
    @Prop() labels!: string[]
    @Prop() keys!: string[]

    @Model('change', { type: String }) readonly selection!: string

    select(val: string) {
        this.$emit('change', val)
    }
}
</script>
<style scoped lang="scss">
@use '../../main';
.radio_buts {
    display: flex;
    flex-wrap: wrap;
}
button {
    word-break: normal;
    white-space: nowrap;
    font-weight: bold;
    font-size: 14px;
    width: 128px;
    padding: 4px 14px;
    height: 42px;
    color: #fff;
    background-color: var(--bg-wallet);
    font-family: PingFang SC;
    border-radius: 8px;
    margin-right: 6px;
    margin-bottom: 6px;
    transition-duration: 0.2s;
    font-family: Inconsolata, monospace;

    &:hover {
        background-color: #292929;
    }

    &[active] {
        border: 1px solid #999;
        background-color: #292929;
    }
}

@include main.medium-device {
    button {
        font-size: 11px;
        padding: 4px 8px;
    }
}
</style>
