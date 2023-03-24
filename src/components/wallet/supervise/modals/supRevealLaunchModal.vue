<template>
    <modal ref="modal" title="揭秘申请详情" @beforeClose="beforeClose">
        <div class="supRevealLaunchBody">
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
                <v-list-item>意见</v-list-item>
                <v-list-item>
                    <v-textarea hide-details v-model="opinion"></v-textarea>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-btn depressed @click="onClickRefuseBtn">驳回</v-btn>
                    </v-list-item-content>
                    <v-list-item-content class="content2">
                        <v-btn depressed color="primary" @click="onClickAgreeBtn">发起提案</v-btn>
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
    ConvertPrefix,
    ActionID,
    UserName,
    Password,
    JSON_SERVER,
} from '@/js/platform'
import axios from 'axios'

@Component({
    components: {
        Modal,
    },
})
export default class supRevealLaunchModal extends Vue {
    detail = {
        id: 1,
        actionID: '7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
        from: '',
        address: '',
        reason: '经济犯罪',
        organization: '中国公安部',
        date: '2022.07.06',
        category: '地址激活',
        pwdVerify: '通过',
        arrestURL: '',
        punishURL: '',
    }
    opinion = ''

    clear() {}

    onClickRefuseBtn() {
        /*
          TODO: reject proposal
         */
        setTimeout(() => {
            this.close()
        }, 1000)
    }

    async onClickAgreeBtn() {
        /*
          TODO: check agreement count
            if (count > 2/3) then agreement count += 1 && submit decInfo to blockchain
            else agreement count += 1
         */
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')
        const submitter: string = this.$store.state.address
        const data = await api.assentProposal(
            ActionID[0],
            [ConvertPrefix(submitter)],
            UserName,
            Password
        )
        console.info('assentProposal: ', data.result)

        axios({
            method: 'GET',
            url: `${JSON_SERVER}/proposal/${this.detail.id}`,
        }).then((resp) => {
            const _submitter = resp.data.submitter == null ? [] : resp.data.submitter
            _submitter.push(submitter)
            axios({
                method: 'PUT',
                url: `${JSON_SERVER}/proposal/${this.detail.id}`,
                data: {
                    ...this.detail,
                    status: 1,
                    submitter: _submitter,
                    category: 3,
                },
            }).catch((err) => console.error(err))
        })

        setTimeout(() => {
            this.close()
        }, 1000)
    }

    beforeClose() {}

    open(item: any) {
        // @ts-ignore
        this.$refs.modal.open()
        this.detail = item
    }

    close() {
        // @ts-ignore
        this.$refs.modal.close()
    }
}
</script>

<style scoped lang="scss">
.supRevealLaunchBody {
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