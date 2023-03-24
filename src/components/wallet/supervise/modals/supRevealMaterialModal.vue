<template>
    <modal ref="modal" title="揭秘申请详情" @beforeClose="beforeClose">
        <div class="supRevealMaterialBody">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content class="listLabel">提交时间</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">提交地址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.from }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">事件ID</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.actionID }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">异常地址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.address }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">揭秘原因</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.reason }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">申请单位</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.organization }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">用户ID</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.userId }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">SPV</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.spv }}</v-list-item-content>
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
                    <v-list-item-content>
                        <v-btn depressed @click="onClickRefuseBtn">驳回</v-btn>
                    </v-list-item-content>
                    <v-list-item-content class="content2">
                        <v-btn depressed color="primary" @click="onClickAgreeBtn">提交</v-btn>
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
    AvaSingle,
    HPlatformVMAPI,
    UserName,
    Password,
    ConvertPrefix,
    JSON_SERVER,
} from '@/js/platform'
import axios from 'axios'

@Component({
    components: {
        Modal,
    },
})
export default class supRevealMaterialModal extends Vue {
    detail = {
        id: 1,
        actionID: '7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
        address: 'X-avax18pvlp39funywwrjmpd92akmh6jqxvhu63xfme',
        from: 'X-avax18pvlp39funywwrjmpd92akmh6jqxvhu63xfme',
        reason: '经济犯罪',
        organization: '中国公安部',
        userId: '9sxt3byiMiKVXK6AGgf1aN766pJ6fmfdd',
        spv: '15mc5h9e9kaddvd488694t38wktsnqu8djl0358',
        date: '2022.07.06',
        submitter: '',
        category: '地址激活',
        pwdVerify: '通过',
        arrestURL: '',
        punishURL: '',
    }

    clear() {}

    onClickRefuseBtn() {
        // TODO: do refuse
        this.close()
    }

    async onClickAgreeBtn() {
        /*
        TODO 1.supervisor -> get user id from active log, submit user id and action id to decrypt
             2.spv -> get information from decrypt log, get url from kyc, url && decrypt info to submit url     
      */
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')
        const from = this.$store.state.address

        const abnormal = this.detail.address
        axios({
            method: 'GET',
            url: `${JSON_SERVER}/active`,
        }).then((resp) => {
            const info = resp.data.filter(
                (o: any) => o.address.split('-')[1] == abnormal.split('-')[1]
            )
            if (info.length == 0) {
                throw new Error(`Active user not found! abnormal address: ${abnormal}`)
            }
            const uid = info[0].uid
            axios({
                method: 'POST',
                url: `${JSON_SERVER}/decrypt`,
                data: {
                    address: this.detail.address,
                    actionID: this.detail.actionID,
                    from: this.detail.from,
                    submitter: this.detail.submitter,
                    reason: this.detail.reason,
                    status: 0,
                    category: 3,
                    date: new Date().toLocaleString('zh-CN'),
                    uid: uid,
                },
            }).catch((err) => console.error(err))
        })

        const data = await api.submitDecInfo(
            this.detail.actionID,
            [ConvertPrefix(from)],
            UserName,
            Password
        )
        console.info(`submit decInfo... `, data.result)

        setTimeout(() => {
            this.close()
        }, 1000)
    }

    beforeClose() {}

    open(item: any) {
        this.detail = item
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
.supRevealMaterialBody {
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

    .listLabel {
        flex: 1;
    }

    .listValue {
        flex: 3;
    }

    .content2 {
        margin-left: 10px;
    }
}
</style>