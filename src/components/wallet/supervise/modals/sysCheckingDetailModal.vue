<template>
    <modal ref="modal" title="资料详情" @beforeClose="beforeClose">
        <div class="sysCheckingDetailBody">
            <v-list dense>
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
                    <v-list-item-content class="listValue">
                        {{ detail.company }}
                    </v-list-item-content>
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
} from '@/js/platform'
import axios from 'axios'

@Component({
    components: {
        Modal,
    },
})
export default class sysCheckingDetailModal extends Vue {
    detail: any = {}
    opinion = ''

    clear() {}

    onClickRefuseBtn() {
        setTimeout(() => {
            this.close()
        }, 1000)
    }

    async onClickAgreeBtn() {
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')
        const address = this.$store.state.address

        switch (this.detail.role.toLowerCase()) {
            case 'spv':
                {
                    const data = await api.recommendSpv(
                        'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN',
                        ConvertPrefix(this.detail.address),
                        UserName,
                        Password,
                        [ConvertPrefix(address)]
                    )
                    console.log('recommendSpv: ', data.result)

                    axios({
                        method: 'GET',
                        url: `${JSON_SERVER}/permission/${this.detail.id}`,
                    })
                        .then((resp) => {
                            const weight = resp.data.weight
                            const submitter = resp.data.submitter
                            submitter.push(address)
                            axios({
                                method: 'PUT',
                                url: `${JSON_SERVER}/permission/${this.detail.id}`,
                                data: {
                                    ...this.detail,
                                    status: 1,
                                    weight: weight + 1,
                                    submitter,
                                },
                            })
                        })
                        .catch((err) => console.error(err))
                }
                break
            case 'sup':
                {
                    const data = await api.recommendSupervisor(
                        'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN',
                        ConvertPrefix(this.detail.address),
                        UserName,
                        Password,
                        [ConvertPrefix(address)]
                    )
                    console.log('recommendSupervisor: ', data.result)

                    axios({
                        method: 'GET',
                        url: `${JSON_SERVER}/permission/${this.detail.id}`,
                    })
                        .then((resp) => {
                            const weight = resp.data.weight
                            const submitter = resp.data.submitter
                            submitter.push(address)
                            axios({
                                method: 'PUT',
                                url: `${JSON_SERVER}/permission/${this.detail.id}`,
                                data: {
                                    ...this.detail,
                                    status: 1,
                                    weight: weight + 1,
                                    submitter,
                                },
                            })
                        })
                        .catch((err) => console.error(err))
                }
                break
            case 'sys':
                break
            default:
                break
        }

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
.sysCheckingDetailBody {
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