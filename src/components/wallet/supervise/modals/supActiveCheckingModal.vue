<template>
    <modal ref="modal" title="激活申请详情" @beforeClose="beforeClose">
        <div class="supActiveCheckingBody">
            <v-list dense>
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
                <v-list-item>意见</v-list-item>
                <v-list-item>
                    <v-textarea hide-details v-model="opinion"></v-textarea>
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
import {
    AvaSingle,
    HPlatformVMAPI,
    UserName,
    Password,
    JSON_SERVER,
    ConvertPrefix,
    Hash160,
    VeryHash160,
} from '@/js/platform'
import axios from 'axios'

@Component({
    components: {
        Modal,
    },
})
export default class supActiveCheckingModal extends Vue {
    detail = {
        id: 1,
        uid: '7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
        address: 'X-avax18pvlp39funywwrjmpd92akmh6jqxvhu63xfme',
        date: '2022.07.06',
        category: '地址激活',
        pwdVerify: '通过',
        licenseURL: '',
        certificationURL: '',
    }
    opinion = ''

    clear() {}

    onClickRefuseBtn() {
        // TODO: do refuse

        setTimeout(() => {
            this.close()
        }, 1000)
    }

    async onClickAgreeBtn() {
        // TODO: encrypt key with password, currently just hash160
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')

        const req = await axios({
            method: 'GET',
            url: `${JSON_SERVER}/active/${this.detail.id}`,
        })
        const uid = await req.data.uid
        const password = await req.data.password

        const jsonReq = await api.getCurrentUserCerts()
        const userCerts = await jsonReq.result.userCerts
        console.log(`current user Cert ${userCerts}`)

        const userInfo = userCerts.filter((o: any) => o.userID == uid)
        if (userInfo.length == 0) {
            console.error('No any information of user cert, please check your kyc!')
            setTimeout(() => {
                this.close()
            }, 1000)
            return
        }
        const hashedData = userInfo[0].cert.split('-')[2]
        if (!VeryHash160(password, uid, hashedData)) {
            console.error(`Can't verify your password or uid, please check it and request late!`)
            setTimeout(() => {
                this.close()
            }, 1000)
            return
        }

        const address = ConvertPrefix(this.detail.address)
        const from = ConvertPrefix(this.$store.state.address)
        try {
            const data = await api.submitUserKey(
                this.detail.uid,
                'KEY888888888',
                [from],
                [address],
                UserName,
                Password
            )
            console.info('submitUserKey: ', data.result)

            axios({
                method: 'PUT',
                url: `${JSON_SERVER}/active/${this.detail.id}`,
                data: {
                    ...this.detail,
                    status: 1,
                    category: 1,
                },
            })
                .then((resp) => {
                    console.log(`user active PUT ${resp.data}`)
                })
                .catch((err) => {
                    console.error(err)
                })
        } catch (e) {
            console.error(e)
        }

        setTimeout(() => {
            this.close()
        }, 1000)
    }

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
.supActiveCheckingBody {
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