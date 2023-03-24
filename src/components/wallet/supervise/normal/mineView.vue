<template>
    <div class="details_view">
        <mineInfoDetailModal ref="mineInfoDetail"></mineInfoDetailModal>
        <mineAddrDetailModal ref="mineAddrDetail"></mineAddrDetailModal>
        <mineSpecDetailModal ref="mineSpecDetail"></mineSpecDetailModal>
        <mineSpecOperateModal ref="mineSpecOperate"></mineSpecOperateModal>
        <mineDecyDetailModal ref="mineDecyDetail"></mineDecyDetailModal>
        <div class="filter">
            <div @click="loadData">申请类别</div>
            <div class="filterItem">
                <v-select
                    :items="categorySelector"
                    placeholder="全部"
                    outlined
                    dense
                    hide-details
                    v-model="category"
                ></v-select>
            </div>
            <div>当前环节</div>
            <div class="filterItem">
                <v-select
                    :items="statusSelectors"
                    placeholder="全部"
                    outlined
                    dense
                    hide-details
                    v-model="status"
                ></v-select>
            </div>
        </div>
        <v-data-table :headers="headers" :items="items" key="checkedTable">
            <template v-slot:item.actions="{ item }">
                <div class="actions">
                    <div
                        @click="onClicOperateBtn(item)"
                        v-show="item.category == 'SPV申请' && item.status == '已通过'"
                    >
                        <img alt="" src="@/assets/supervise/icon_finance.svg" />
                    </div>
                    <div @click="onClickDetailBtn(item)">
                        <img alt="" src="@/assets/supervise/icon_visible.svg" />
                    </div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import axios from 'axios'
import { JSON_SERVER, CORS_ALL, Status, Category } from '@/js/platform'
import mineInfoDetailModal from '@/components/wallet/supervise/normal/modals/mineInfoDetailModal.vue'
import mineAddrDetailModal from '@/components/wallet/supervise/normal/modals/mineAddrDetailModal.vue'
import mineSpecDetailModal from '@/components/wallet/supervise/normal/modals/mineSpecDetailModal.vue'
import mineSpecOperateModal from '@/components/wallet/supervise/normal/modals/mineSpecOperateModal.vue'
import mineDecyDetailModal from '@/components/wallet/supervise/normal/modals/mineDecyDetailModal.vue'

@Component({
    components: {
        mineInfoDetailModal,
        mineAddrDetailModal,
        mineSpecDetailModal,
        mineSpecOperateModal,
        mineDecyDetailModal,
    },
})
export default class mineView extends Vue {
    $refs!: {
        mineInfoDetail: mineInfoDetailModal
        mineAddrDetail: mineAddrDetailModal
        mineSpecDetail: mineSpecDetailModal
        mineSpecOperate: mineSpecOperateModal
        mineDecyDetail: mineDecyDetailModal
    }

    category = ''
    status = ''
    categorySelector = ['全部', '资料审核', '地址激活', 'SPV申请', '揭秘申请']
    statusSelectors = ['全部', '已通过', '未通过', '审批中']
    headers = [
        { text: '申请类别', value: 'category', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '当前环节', value: 'status', align: 'center', sortable: false },
        { text: '操作', value: 'actions', align: 'center', sortable: false },
    ]
    items = [
        { id: 1, status: '已通过', date: '2022.07.06', category: '资料审核' },
        { id: 2, status: '已通过', date: '2022.07.08', category: '地址激活' },
        { id: 3, status: '已通过', date: '2022.07.08', category: 'SPV申请' },
        { id: 4, status: '已通过', date: '2022.07.08', category: '揭秘申请' },
    ]

    async loadData() {
        axios
            .all([
                axios.get(`${JSON_SERVER}/kyc`),
                axios.get(`${JSON_SERVER}/active`),
                axios.get(`${JSON_SERVER}/proposal`),
                axios.get(`${JSON_SERVER}/permission`),
            ])
            .then(
                axios.spread((resp1, resp2, resp3, resp4) => {
                    const data = [].concat(resp1.data, resp2.data, resp3.data, resp4.data)
                    let items: any[] = []
                    data.map((o: any) => {
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
        await this.loadData()
    }

    @Watch('category')
    onCategoryChange() {
        this.doSearch()
    }

    @Watch('status')
    onStatusChange() {
        this.doSearch()
    }

    doSearch() {
        // TODO: search by category
    }

    onClickDetailBtn(item: any) {
        if (item.category == '资料审核') {
            this.$refs.mineInfoDetail.open(item)
        }

        if (item.category == '地址激活') {
            this.$refs.mineAddrDetail.open(item)
        }

        if (item.category == '权限申请') {
            this.$refs.mineSpecDetail.open(item)
        }

        if (item.category == '揭秘提案') {
            this.$refs.mineDecyDetail.open(item)
        }
    }

    onClicOperateBtn(item: any) {
        if (item.category == 'SPV申请') {
            this.$refs.mineSpecOperate.open(item.id, item.category)
        }
    }
}
</script>
<style scoped lang="scss">
@use "../../../../main";

.details_view {
    display: flex;
    flex-direction: column;
    height: 100%;
}

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
</style>
