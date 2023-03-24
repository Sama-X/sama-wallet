<template>
    <modal ref="modal" title="提案详情" @beforeClose="beforeClose">
        <div class="supReviewBody">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content class="listLabel">提交时间</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">提交发起地址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.address }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">事件ID</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.eventId }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">异常地址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.abnormalAddress }}
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
                        <v-btn depressed color="primary" @click="onClickAgreeBtn">通过</v-btn>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
    </modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'

@Component({
    components: {
        Modal,
    },
})
export default class supReviewModal extends Vue {
    detail = {
        id: 1,
        eventId: '7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
        address: 'X-avax18pvlp39funywwrjmpd92akmh6jqxvhu63xfme',
        abnormalAddress: 'X-avax18pvlp39funywwrjmpd92akmh6jqxvhu63xfme',
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
        // TODO: do refuse

        this.close()
    }

    onClickAgreeBtn() {
        // TODO: do agree

        this.close()
    }

    beforeClose() {}

    open(item: any) {
        // @ts-ignore
        this.$refs.modal.open()

        // TODO: request item detail
    }

    close() {
        // @ts-ignore
        this.$refs.modal.close()
    }
}
</script>

<style scoped lang="scss">
.supReviewBody {
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