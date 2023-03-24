<template>
    <modal ref="modal" title="资料详情" @beforeClose="beforeClose">
        <div class="sysCheckedDetailBody">
            <v-list dense>
                <v-list-item>
                    <v-list-item-content class="listLabel">状态</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.result }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">申请角色</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.role }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">提交时间</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">机构名</v-list-item-content>
                    <v-list-item-content class="listValue">{{ detail.organ }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">机构地址</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.address }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="listLabel">机构网页</v-list-item-content>
                    <v-list-item-content class="listValue">
                        {{ detail.website }}
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
export default class sysCheckedDetailModal extends Vue {
    detail = {
        id: 1,
        result: '已通过',
        organ: '华链股份',
        date: '2022.07.06',
        role: 'SPV',
        address: '中华路1号',
        website: 'www.huachain.net',
        licenseURL: '',
        certificationURL: '',
    }

    clear() {}

    beforeClose() {}

    open(item: Number) {
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
.sysCheckedDetailBody {
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