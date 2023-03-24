<template>
    <div class="supCheckedView">
        <sup-active-checked-modal ref="checkedDetailModal"></sup-active-checked-modal>
        <sup-reveal-launch-modal ref="revealLaunchModal"></sup-reveal-launch-modal>
        <sup-reveal-material-modal ref="revealMaterialModal"></sup-reveal-material-modal>
        <sup-review-modal ref="supReviewModal"></sup-review-modal>
        <div class="filter">
            <div @click="onLoad">申请类别</div>
            <div class="filterItem">
                <v-select
                    :items="categorySelectors"
                    placeholder="请选择类别"
                    outlined
                    dense
                    hide-details
                    v-model="category"
                ></v-select>
            </div>
            <div>结果</div>
            <div class="filterItem">
                <v-select
                    :items="resultSelectors"
                    placeholder="请选择结果"
                    outlined
                    dense
                    hide-details
                    v-model="result"
                ></v-select>
            </div>
        </div>
        <v-data-table :headers="headers" :items="items" key="checkedTable">
            <template v-slot:item.result="{ item }">
                <span v-if="item.result == 1" style="color: #28d166">通过</span>
                <span v-if="item.result == 0" style="color: #ef2323">驳回</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="actions">
                    <div @click="onClickDetailBtn(item)">
                        <img alt="" src="../../../assets/supervise/icon_visible.svg" />
                    </div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import supActiveCheckedModal from '@/components/wallet/supervise/modals/supActiveCheckedModal.vue'
import supRevealLaunchModal from '@/components/wallet/supervise/modals/supRevealLaunchModal.vue'
import supRevealMaterialModal from '@/components/wallet/supervise/modals/supRevealMaterialModal.vue'
import supReviewModal from '@/components/wallet/supervise/modals/supReviewModal.vue'
import axios from 'axios'
import { Category, JSON_SERVER, Status } from '@/js/platform'

@Component({
    components: {
        supActiveCheckedModal,
        supRevealLaunchModal,
        supRevealMaterialModal,
        supReviewModal,
    },
})
export default class supCheckedView extends Vue {
    $refs!: {
        checkedDetailModal: supActiveCheckedModal
        revealLaunchModal: supRevealLaunchModal
        revealMaterialModal: supRevealMaterialModal
        supReviewModal: supReviewModal
    }

    category = ''
    result = ''
    categorySelectors = ['全部', '地址激活', '提案复核', '揭秘事件']
    resultSelectors = ['全部', '通过', '驳回']
    headers = [
        { text: '用户地址', value: 'address', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '申请类别', value: 'category', align: 'center', sortable: false },
        { text: '审核结果', value: 'status', align: 'center', sortable: false },
        { text: '操作', value: 'actions', align: 'center', sortable: false },
    ]
    items: any[] = []

    async onLoad() {
        const address = this.$store.state.address

        axios.all([axios.get(`${JSON_SERVER}/active`), axios.get(`${JSON_SERVER}/proposal`)]).then(
            axios.spread((resp1, resp2) => {
                const data1 = resp1.data
                const data2 = resp2.data

                let items: any[] = []
                data1
                    .filter((o: any) => o.status != 0)
                    .map((o: any) => {
                        items.push({
                            ...o,
                            status: Status[o.status],
                            category: Category[o.category],
                        })
                    })

                data2
                    .filter((o: any) => o.submitter.indexOf(address) != -1)
                    .map((o: any) => {
                        items.push({
                            ...o,
                            status: Status[o.status],
                            category:
                                o.submitter.length >= 1 ? '揭秘事件提交资料' : Category[o.category],
                        })
                    })

                this.items = items
            })
        )
    }

    async mounted() {
        await this.onLoad()
    }

    @Watch('category')
    onCategoryChange() {
        this.doSearch()
    }

    @Watch('result')
    onResultChange() {
        this.doSearch()
    }

    doSearch() {
        // TODO: search by category
    }

    onClickDetailBtn(item: any) {
        if (item.category == '地址激活') {
            this.$refs.checkedDetailModal.open(item)
        } else if (item.category == '揭秘提案') {
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
@use '../../../main';

.supCheckedView {
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