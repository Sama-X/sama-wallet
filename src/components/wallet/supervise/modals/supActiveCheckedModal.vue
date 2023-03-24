<template>
    <modal ref="modal" title="激活申请详情" @beforeClose="beforeClose">
        <div class="supActiveCheckedBody">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content class="listLabel">状态</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.status }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">提交时间</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">用户地址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.address }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">用户ID</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.uid }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">密码校验</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.pwdVerify }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>附件</v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-img class="annexImg" aspect-ratio="1.6" contain :src="detail.licenseURL">
                            <template v-slot:placeholder>
                                <div class="placeholder">营业执照</div>
                            </template>
                        </v-img>
                    </v-list-item-content>
                    <v-list-item-content class="content2">
                        <v-img
                            class="annexImg"
                            aspect-ratio="1.6"
                            contain
                            :src="detail.certificationURL"
                        >
                            <template v-slot:placeholder>
                                <div class="placeholder">资质证书</div>
                            </template>
                        </v-img>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>审批流程</v-list-item>
                <v-list-item>
                    <v-list-item-content class="examineContent">
                        <div class="examineUser">
                            <img alt="" src="../../../../assets/supervise/icon_user.svg" />
                            <div class="username">{{ detail.uid }}</div>
                        </div>
                        <div class="examineInfo">
                            <div class="result">{{ detail.status }}</div>
                            <div class="date">{{ detail.date }}</div>
                            <div class="opinion">{{ detail.examineOpinion }}</div>
                        </div>
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
export default class supActiveCheckedModal extends Vue {
    detail = {
        id: 1,
        status: '已通过',
        uid: '7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
        address: 'X-avax18pvlp39funywwrjmpd92akmh6jqxvhu63xfme',
        date: '2022.07.06',
        category: '地址激活',
        pwdVerify: '通过',
        licenseURL: '',
        certificationURL: '',
        examineUserId: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
        examineOpinion: '',
        examineDate: '2022.07.08',
    }

    clear() {}

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
.supActiveCheckedBody {
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

    .examineContent {
        border-radius: 4px;
        background-color: #f5f6fa;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .examineUser {
            width: 100%;
            display: flex;
            flex-direction: row;

            img {
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }

            .username {
                line-height: 24px;
            }
        }

        .examineInfo {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            .date {
                margin-left: 20px;
            }
        }
    }
}
</style>