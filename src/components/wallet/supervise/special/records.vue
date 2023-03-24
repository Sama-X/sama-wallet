<template>
    <div class="records">
        <records-detail-model ref="checkingDetailModal"></records-detail-model>
        <div class="filter">
            <div @click="onLoad">结果</div>
            <div class="filterItem">
                <v-select
                    :items="selectors"
                    placeholder="请选择处理状态"
                    outlined
                    dense
                    hide-details
                    v-model="role"
                ></v-select>
            </div>
        </div>
        <v-data-table :headers="headers" :items="items" key="checkedTable">
            <template v-slot:item.result="{ item }">
                <span v-if="item.result == 1" style="color: #28d166">通过</span>
                <span v-if="item.result == 0" style="color: #ef2323">驳回</span>
            </template>
            <template v-slot:item.option="{ item }">
                <v-btn icon color="pink" @click="onClickDetailBtn(item)">
                    <img
                        src="../../../../../src/assets/supervise/icon_eye.svg"
                        width="20"
                        height="14"
                    />
                </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import recordsDetailModel from '@/components/wallet/supervise/special/models/recordsDetailModel.vue'
import axios from 'axios'
import { Category, JSON_SERVER, Status } from '@/js/platform'

@Component({
    components: {
        recordsDetailModel,
    },
})
export default class records extends Vue {
    $refs!: {
        checkingDetailModal: recordsDetailModel
    }
    headers = [
        { text: '姓名', value: 'name', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '性别', value: 'sex', align: 'center', sortable: false },
        { text: '处理结果', value: 'status', align: 'center', sortable: false },
        { text: '操作', value: 'option', align: 'center', sortable: false },
    ]
    items: any[] = []
    selectors = ['未处理', '已处理', '待处理']
    role = ''

    mounted() {
        this.onLoad()
    }

    onLoad() {
        axios.all([axios.get(`${JSON_SERVER}/kyc`), axios.get(`${JSON_SERVER}/decrypt`)]).then(
            axios.spread((resp1, resp2) => {
                const data = [].concat(resp1.data, resp2.data)
                let items: any[] = []
                data.filter((o: any) => o.status != 0).map((o: any) => {
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

    @Watch('role')
    onValueChange() {
        this.doSearch()
    }

    doSearch() {
        // search by role
    }

    onClickDetailBtn(item: any) {
        this.$refs.checkingDetailModal.open(item)
    }
}
</script>

<style scoped lang="scss">
@use '../../../../main';

.records {
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