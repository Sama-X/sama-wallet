<template>
    <div class="copied_panel">
        <v-checkbox :label="explain" v-model="value" @change="change" class="checkbox"></v-checkbox>
    </div>
</template>
<script>
export default {
    props: {
        value: Boolean,
        explain: {
            type: String,
            default: 'Back up your mnemonic keyphrase!',
        },
    },
    model: {
        prop: 'value',
        event: 'change',
    },
    methods: {
        change() {
            this.$emit('change', this.value)
        },
    },
}
</script>

<style lang="scss">
@use "../../main";
.copied_panel {
    margin-top: 36px;
}
.checkbox {
    .v-input--selection-controls__input > .primary--text {
        color: var(--secondary-color) !important;
        caret-color: var(--secondary-color) !important;
    }
    .v-label,
    .v-label,
    .theme--light {
        color: white !important;
    }

    .v-input--selection-controls__input {
        > * {
            color: white !important;
        }
    }

    .v-input--selection-controls__ripple {
        color: white !important;
    }
}
</style>
