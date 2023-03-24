<template>
    <modal ref="modal" title="揭秘申请" @beforeClose="beforeClose">
        <div class="mineInfo">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content class="listLabel">状态</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.status }}</v-list-item-content>
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
                <!--                <v-list-item>-->
                <!--                    <v-list-item-content class="listLabel">申请单位</v-list-item-content>-->
                <!--                    <v-list-item-content class="listValue">{{ detail.status }}</v-list-item-content>-->
                <!--                </v-list-item>-->
                <v-list-item>
                    <v-list-item-content class="listLabel">姓名</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.name }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">住址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.location }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">性别</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.sex }}</v-list-item-content>
                </v-list-item>
                <v-list-item>附件</v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-img class="annexImg" aspect-ratio="1.6" contain :src="detail.licenseURL">
                            <template v-slot:placeholder>
                                <div class="placeholder">照片</div>
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
                                <div class="placeholder">证件</div>
                            </template>
                        </v-img>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>审批流程</v-list-item>
                <v-list-item>
                    <v-list-item-content class="examineContent">
                        <div class="examineUser">
                            <img alt="" src="@/assets/supervise/icon_user.svg" />
                            <div class="username">{{ detail.examineUserId }}</div>
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
export default class mineDecyDetailModal extends Vue {
    detail = {
        id: 1,
        status: '已通过',
        sex: '男',
        reason: '',
        location: '',
        address: '住址住址',
        name: '姓名姓名',
        licenseURL: '',
        certificationURL: '',
        examineUserId: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
        examineOpinion: '',
        date: '2022.07.08',
    }

    clear() {}

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
.mineInfo {
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