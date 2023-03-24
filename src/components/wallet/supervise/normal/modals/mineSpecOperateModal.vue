<template>
    <modal ref="modal" title="特权申请" @beforeClose="beforeClose">
        <div class="mineAddr">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content class="listLabel">状态</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.result }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">申请时间</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">用户地址</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.addr }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">用户id</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.uid }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">角色</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.role }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">金额</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.amount }}SAMA
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">有效期</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.expiryTime }}
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
                            <div class="result">{{ detail.result }}</div>
                            <div class="date">{{ detail.examineDate }}</div>
                            <div class="opinion">{{ detail.examineOpinion }}</div>
                        </div>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content style="text-align: center">
                        <div class="col1">
                            <v-btn @click="update">质押</v-btn>
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
export default class mineSpecOperateModal extends Vue {
    detail = {
        id: 1,
        result: '已通过',
        date: '1111-11-11',
        addr: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
        uid: '00000000000',
        role: 'spv',
        amount: 1999,
        expiryTime: '1111-11-11',
        licenseURL: '',
        certificationURL: '',
        examineUserId: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
        examineOpinion: '',
        examineDate: '2022.07.08',
    }

    clear() {}

    beforeClose() {}

    open(itemId: Number, category: String) {
        // @ts-ignore
        this.$refs.modal.open()

        // TODO: request item detail
    }

    close() {
        // @ts-ignore
        this.$refs.modal.close()
    }

    update() {
        //@todo
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
            text-align: center;

            //&:hover {
            //    border-color: var(--primary-color-light);
            //}
            //&:focus-within {
            //    border-color: var(--secondary-color);
            //}
        }
    }
}
</style>