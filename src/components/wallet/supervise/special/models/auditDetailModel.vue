<template>
    <modal ref="modal" title="资料详情" @beforeClose="beforeClose">
        <div class="auditDetailModel">
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
                <v-list-item>意见</v-list-item>
                <v-list-item>
                    <v-textarea hide-details v-model="opinion" placeholder="驳回原因"></v-textarea>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-btn depressed @click="onClickRefuseBtn">驳回</v-btn>
                    </v-list-item-content>
                    <v-list-item-content class="content2">
                        <v-btn depressed color="primary" @click="onClickAgreeBtn">同意</v-btn>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
    </modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'
import axios from 'axios'
import {
    JSON_SERVER,
    CORS_ALL,
    MakeId,
    AvaSingle,
    UserID,
    UserName,
    Password,
    HPlatformVMAPI,
    Hash160,
    VeryHash160,
    ConvertPrefix,
} from '@/js/platform'

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
        name: 'SPV',
        address: '中华路1号',
        sex: '男',
        licenseURL: '',
        certificationURL: '',
        certificationURL2: '',
    }
    opinion = ''
    avalanche = new AvaSingle().getInstance()
    api = new HPlatformVMAPI(this.avalanche, '/ext/P')

    clear() {}

    async onClickRefuseBtn() {
        // TODO: do refuse
        const reason = this.opinion.trim()
        if (reason == '' || reason.length < 5) {
            return
        }
        await axios({
            method: 'PUT',
            url: `${JSON_SERVER}/kyc/${this.detail.id}`,
            data: {
                ...this.detail,
                status: 2,
                category: 0,
                reason: this.opinion,
            },
            ...CORS_ALL,
        }).catch((err) => {
            console.error(err)
        })
        setTimeout(() => {
            this.close()
        }, 1000)
    }

    async onClickAgreeBtn() {
        const req = await axios({
            method: 'GET',
            url: `${JSON_SERVER}/kyc/${this.detail.id}`,
        })
        const userPass = await req.data.password

        const uuid = UserID[0]
        const cert = `Cert-${MakeId(10)}-${Hash160(userPass, uuid)}`
        const submitter = this.$store.state.address

        console.info('submitUserCert before...', { uuid, cert, submitter })
        // submit data to blockchain
        const data = await this.api.submitUserCert(
            uuid,
            cert,
            [ConvertPrefix(submitter)],
            UserName,
            Password
        )
        console.log('submitUserCert to blockchain...', data.result.txID)

        await axios({
            method: 'PUT',
            url: `${JSON_SERVER}/kyc/${this.detail.id}`,
            data: {
                ...this.detail,
                status: 1,
                category: 0,
                cert: cert,
                uuid: uuid,
            },
            ...CORS_ALL,
        }).catch((err) => {
            console.error(err)
        })
        setTimeout(() => {
            this.close()
        }, 1000)
    }

    beforeClose() {}

    open(item: any) {
        this.detail = {
            ...this.detail,
            ...item,
        }
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