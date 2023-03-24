<template>
    <modal ref="modal" title="资料详情" @beforeClose="beforeClose">
        <div class="recordsDetailModel">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content>提交时间</v-list-item-content>
                    <v-list-item-content>{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>姓名</v-list-item-content>
                    <v-list-item-content>{{ detail.name }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>住址</v-list-item-content>
                    <v-list-item-content>{{ detail.address }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>性别</v-list-item-content>
                    <v-list-item-content>{{ detail.sex }}</v-list-item-content>
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
                    <v-list-item-content class="content2">
                        <v-img
                            class="annexImg"
                            aspect-ratio="1.6"
                            contain
                            :src="detail.certificationURL2"
                        >
                            <template v-slot:placeholder>
                                <div class="placeholder">资质证书</div>
                            </template>
                        </v-img>
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
export default class recordsDetailModel extends Vue {
    detail = {
        id: 1,
        organ: '华链股份',
        date: '2022.07.06',
        name: 'SPV',
        address: '中华路1号',
        sex: '男',
        licenseURL: '',
        certificationURL: '',
        certificationURL2: '',
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
.recordsDetailModel {
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