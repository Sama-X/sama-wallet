<template>
    <div class="sysCheckedView">
        <sys-checked-detail-modal ref="checkedDetailModal"></sys-checked-detail-modal>
        <div class="filter">
            <div>姓名</div>
            <div class="filterItem">
                <v-text-field
                    placeholder="请输入姓名"
                    outlined
                    dense
                    hide-details
                    v-model="organName"
                    @blur="doSearch"
                    @keydown.enter="doSearch"
                ></v-text-field>
            </div>
            <div>结果</div>
            <div class="filterItem">
                <v-select
                    :items="selectors"
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
                    <div @click="onClickDetailBtn(item.id)">
                        <img alt="" src="../../../assets/supervise/icon_visible.svg" />
                    </div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import sysCheckedDetailModal from '@/components/wallet/supervise/modals/sysCheckedDetailModal.vue'
import axios from 'axios'
import { JSON_SERVER, Status, Category } from '@/js/platform'

@Component({
    components: {
        sysCheckedDetailModal,
    },
})
export default class sysCheckedView extends Vue {
    $refs!: {
        checkedDetailModal: sysCheckedDetailModal
    }

    organName = ''
    result = ''
    selectors = ['全部', '通过', '驳回']
    headers = [
        { text: '机构名', value: 'organ', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '申请角色', value: 'role', align: 'center', sortable: false },
        { text: '处理结果', value: 'status', align: 'center', sortable: false },
        { text: '操作', value: 'actions', align: 'center', sortable: false },
    ]
    items: any = []

    @Watch('result')
    onValueChange() {
        this.doSearch()
    }

    mounted() {
        const address = this.$store.state.address

        axios({
            method: 'GET',
            url: `${JSON_SERVER}/permission`,
        }).then((resp) => {
            let items: any[] = []
            resp.data
                .filter((o: any) => o.submitter.indexOf(address) != -1)
                .map((o: any) => {
                    items.push({
                        ...o,
                        status: Status[o.status],
                        category: Category[o.category],
                    })
                })
            this.items = items
        })
    }

    doSearch() {
        // search by organName && result
    }

    onClickDetailBtn(item: any) {
        this.$refs.checkedDetailModal.open(item)
    }
}
</script>

<style scoped lang="scss">
@use '../../../main';

.sysCheckedView {
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