<template>
    <div class="details_view">
        <div class="col1">异常地址</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="异常地址"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.address"
            ></v-text-field>
        </div>
        <div class="col1">揭秘原因</div>
        <div class="col1">
            <v-select
                class="inptuView"
                label="揭秘原因"
                :items="causItems"
                append-icon=""
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.reason"
            ></v-select>
        </div>
        <div class="col1">申请单位</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="申请单位"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.company"
            ></v-text-field>
        </div>
        <div class="col1">证明文件</div>
        <div class="col1" style="display: block">
            <v-file-input
                class="inptuView"
                label="证明文件"
                style="width: 205px"
                truncate-length="15"
                :clearable="false"
                prepend-icon=""
                dense
                solo
                flat
                outlined
                hide-details
            ></v-file-input>
        </div>
        <div class="col1">
            <v-btn @click="update">提交</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
    AvaSingle,
    JSON_SERVER,
    HPlatformVMAPI,
    ActionID,
    ConvertPrefix,
    UserName,
    Password,
} from '@/js/platform'
import axios from 'axios'

interface data {
    address: string | null
    reason: string | null
    company: string | null
}

@Component({
    components: {},
})
export default class decyView extends Vue {
    causItems = ['经济犯罪', '其他原因']
    data: data = {
        address: null,
        reason: null,
        company: null,
    }

    async update() {
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')
        const from: string = this.$store.state.address

        const data = await api.submitProposal(
            ActionID[0],
            // @ts-ignore
            ConvertPrefix(this.data.address),
            [ConvertPrefix(from)],
            UserName,
            Password
        )
        console.log('submitProposal: ', data.result)

        axios({
            method: 'POST',
            url: `${JSON_SERVER}/proposal`,
            data: {
                ...this.data,
                actionID: ActionID[0],
                from: from,
                status: 0,
                submitter: [],
                category: 3,
                date: new Date().toLocaleString('zh-CN'),
            },
        })
            .then((resp) => console.log('submitProposal to server: ', resp.data))
            .catch((err) => console.error(err))
    }
}
</script>
<style scoped lang="scss">
@use "../../../../main";

.details_view {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.col1 {
    border-radius: 3px;
    background-color: var(--bg-light);
    border: 1px solid transparent;
    //display: flex;
    display: grid;
    grid-template-columns: max-content 1fr;
    width: 100%;
    box-sizing: border-box;
    //overflow: auto;
    padding: 8px 14px;
    position: relative;

    //&:hover {
    //    border-color: var(--primary-color-light);
    //}
    //&:focus-within {
    //    border-color: var(--secondary-color);
    //}
}

.inptuView {
    background-color: var(--bg-light);
    color: var(--primary-color);
    // padding: 6px 14px;
}
</style>
