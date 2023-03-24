<template>
    <modal ref="modal" title="地址激活" @beforeClose="beforeClose">
        <div class="mineAddr">
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
                    <v-list-item-content class="listLabel">用户id</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.uid }}</v-list-item-content>
                </v-list-item>
                <v-list-item>审批流程</v-list-item>
                <v-list-item>
                    <v-list-item-content class="examineContent">
                        <div class="examineUser">
                            <img alt="" src="@/assets/supervise/icon_user.svg" />
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
export default class mineAddrDetailModal extends Vue {
    detail = {
        id: 1,
        status: '已通过',
        date: '1111-11-11',
        address: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
        uid: '00000000000',
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
        // TODO: request item detail
    }

    close() {
        // @ts-ignore
        this.$refs.modal.close()
    }
}
</script>

<style scoped lang="scss">
.mineAddr {
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