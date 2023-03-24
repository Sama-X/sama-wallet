<template>
    <modal ref="modal" @beforeClose="beforeClose">
        <div class="auditDetailModel">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content>提交时间</v-list-item-content>
                    <v-list-item-content>{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>提交地址</v-list-item-content>
                    <v-list-item-content>{{ detail.from }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>事件ID</v-list-item-content>
                    <v-list-item-content>{{ detail.actionID }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>异常地址</v-list-item-content>
                    <v-list-item-content>{{ detail.address }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>用户ID</v-list-item-content>
                    <v-list-item-content>{{ detail.uid }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>揭秘原因</v-list-item-content>
                    <v-list-item-content>{{ detail.reason }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>申请单位</v-list-item-content>
                    <v-list-item-content>{{ detail.apply_unit }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>资料URL</v-list-item-content>
                    <v-list-item-content>{{ detail.url }}</v-list-item-content>
                </v-list-item>
                <v-list-item>附件</v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-img class="annexImg" aspect-ratio="1.6" contain :src="detail.arrestURL">
                            <template v-slot:placeholder>
                                <div class="placeholder">逮捕令</div>
                            </template>
                        </v-img>
                    </v-list-item-content>
                    <v-list-item-content class="content2">
                        <v-img class="annexImg" aspect-ratio="1.6" contain :src="detail.punishURL">
                            <template v-slot:placeholder>
                                <div class="placeholder">行政处罚书</div>
                            </template>
                        </v-img>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="content2">
                        <v-btn
                            depressed
                            color="#e84970"
                            @click="onClickAddBtn"
                            width="291px"
                            height="36px"
                        >
                            <p style="color: #ffffff">提交</p>
                        </v-btn>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
    </modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'
import {
    JSON_SERVER,
    UserName,
    Password,
    AvaSingle,
    HPlatformVMAPI,
    ConvertPrefix,
} from '@/js/platform'
import axios, { AxiosResponse } from 'axios'

@Component({
    components: {
        Modal,
    },
})
export default class auditDetailModel extends Vue {
    detail = {
        id: 1,
        organ: '华链股份',
        date: '2022.07.06',
        from: '15mc5h9e9kaddvd488694t38wktsnqu8djl0358',
        actionID: '7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
        address: '1uneys3kpycmh5nr0vn9ha8cac3ta7e7tkl8dn4',
        uid: '9sxt3byiMiKVXK6AGgf1aN766pJ6fmfdd',
        reason: '经济犯罪',
        apply_unit: '中国公安部',
        url: 'www.baidu.com',
        arrestURL: '',
        punishURL: '',
    }
    opinion = ''
    preDetail: any = {}

    clear() {}

    async onClickAddBtn() {
        // TODO 1. last step, submit user url to blockchain
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')
        const submitter = this.$store.state.address

        const response: AxiosResponse = await axios({
            method: 'GET',
            url: `${JSON_SERVER}/kyc/${this.detail.id}`,
        })
        const respData = await response.data
        const url = [respData.name, respData.address, respData.sex, respData.licenseURL].join('-') // url information

        const data = await api.submitUrl(
            this.detail.actionID,
            url,
            [ConvertPrefix(submitter)],
            UserName,
            Password
        )
        console.info('submitUrl to blockchain: ', data.result)

        await axios({
            method: 'POST',
            url: `${JSON_SERVER}/url`,
            data: {
                actionID: this.detail.actionID,
                uid: this.detail.uid,
                url: url,
            },
        }).then((resp) => console.info('POST to url: ', resp.data))

        await axios({
            method: 'PUT',
            url: `${JSON_SERVER}/decrypt/${this.preDetail.id}`,
            data: {
                ...this.preDetail,
                status: 1,
                category: 3,
            },
        }).then((resp) => console.info(`PUT to decrypt: `, resp.data))

        this.close()
    }

    beforeClose() {}

    open(item: any) {
        this.detail = item
        this.preDetail = item
        // @ts-ignore
        this.$refs.modal.open()
    }

    close() {
        // @ts-ignore
        this.$refs.modal.close()
    }
}
</script>

<style scoped lang="scss">
.auditDetailModel {
    width: 632px;

    .annexImg {
        border-radius: 10px;
        background-color: #f5f6fa;

        .placeholder {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }

    .content2 {
        margin-left: 10px;
    }
}
</style>