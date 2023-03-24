<template>
    <div class="supCheckingView">
        <sup-active-checking-modal ref="activeCheckingModal"></sup-active-checking-modal>
        <sup-reveal-launch-modal ref="revealLaunchModal"></sup-reveal-launch-modal>
        <sup-reveal-material-modal ref="revealMaterialModal"></sup-reveal-material-modal>
        <sup-review-modal ref="supReviewModal"></sup-review-modal>
        <div class="filter">
            <div @click="onLoad">申请类别</div>
            <div class="filterItem">
                <v-select
                    :items="selectors"
                    placeholder="请选择类别"
                    outlined
                    dense
                    hide-details
                    v-model="category"
                ></v-select>
            </div>
        </div>
        <v-data-table :headers="headers" :items="items" key="checkingTable">
            <template v-slot:item.actions="{ item }">
                <div class="actions">
                    <div @click="onClickDetailBtn(item)">
                        <img alt="" src="../../../../assets/supervise/icon_visible.svg" />
                    </div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import supActiveCheckingModal from '@/components/wallet/supervise/modals/supActiveCheckingModal.vue'
import supRevealLaunchModal from '@/components/wallet/supervise/modals/supRevealLaunchModal.vue'
import supRevealMaterialModal from '@/components/wallet/supervise/modals/supRevealMaterialModal.vue'
import supReviewModal from '@/components/wallet/supervise/modals/supReviewModal.vue'
import { JSON_SERVER, Status, Category } from '@/js/platform'
import axios from 'axios'

@Component({
    components: {
        supActiveCheckingModal,
        supRevealLaunchModal,
        supRevealMaterialModal,
        supReviewModal,
    },
})
export default class supCheckingView extends Vue {
    $refs!: {
        activeCheckingModal: supActiveCheckingModal
        revealLaunchModal: supRevealLaunchModal
        revealMaterialModal: supRevealMaterialModal
        supReviewModal: supReviewModal
    }

    category = ''
    selectors = ['全部', '地址激活', '提案复核', '揭秘事件', '揭秘事件提交资料']
    headers = [
        { text: '用户地址', value: 'address', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '申请类别', value: 'category', align: 'center', sortable: false },
        { text: '操作', value: 'actions', align: 'center', sortable: false },
    ]
    items: any[] = []

    @Watch('category')
    onValueChange() {
        this.doSearch()
    }

    async onLoad() {
        const address = this.$store.state.address

        axios.all([axios.get(`${JSON_SERVER}/active`), axios.get(`${JSON_SERVER}/proposal`)]).then(
            axios.spread((resp1, resp2) => {
                const data1 = resp1.data
                const data2 = resp2.data
                let items: any[] = []
                data1
                    .filter((o: any) => o.status == 0)
                    .map((o: any) => {
                        items.push({
                            ...o,
                            status: Status[o.status],
                            category: Category[o.category],
                        })
                    })

                data2
                    .filter((o: any) => o.submitter.indexOf(address) == -1)
                    .map((o: any) => {
                        items.push({
                            ...o,
                            status: Status[o.status],
                            category: Category[o.category],
                        })
                    })
                this.items = items
            })
        )
    }

    async mounted() {
        await this.onLoad()
    }

    doSearch() {
        // TODO: search by category
    }

    onClickDetailBtn(item: any) {
        if (item.category == '地址激活') {
            this.$refs.activeCheckingModal.open(item)
        } else if (item.category == '揭秘事件') {
            this.$refs.revealLaunchModal.open(item)
        } else if (item.category == '揭秘事件提交资料') {
            this.$refs.revealMaterialModal.open(item)
        } else if (item.category == '提案复核') {
            this.$refs.supReviewModal.open(item)
        }
    }
}
</script>

<style scoped lang="scss">
@use '../../../../main';

.supCheckingView {
    .filter {
        display: flex;
        flex-direction: row;
        align-items: center;

        .filterItem {
            width: 200px;
            margin: 0 10px;
        }
    }

    .actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        img {
            width: 24px;
            height: 24px;
        }
    }
}
</style>