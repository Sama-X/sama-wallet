<template>
    <div class="audit">
        <!-- <div class="filter">
        <div>姓名</div>
    </div> -->
        <audit-detail-model ref="checkingDetailModal"></audit-detail-model>
        <v-data-table :headers="headers" :items="items" key="checkedTable">
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
import auditDetailModel from '@/components/wallet/supervise/special/models/auditDetailModel.vue'
import axios from 'axios'
import { Category, CORS_ALL, JSON_SERVER, Status } from '@/js/platform'

@Component({
    components: {
        auditDetailModel,
    },
})
export default class audit extends Vue {
    $refs!: {
        checkingDetailModal: auditDetailModel
    }
    headers = [
        { text: '姓名', value: 'name', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '性别', value: 'sex', align: 'center', sortable: false },
        { text: '住址', value: 'address', align: 'center', sortable: false },
        { text: '操作', value: 'option', align: 'center', sortable: false },
    ]
    items = [
        { id: 1, name: '张三', date: '2022.07.06', sex: '男', address: '中南山1号' },
        { id: 2, name: '李四', date: '2022.07.08', sex: '女', address: '中南山2号' },
        { id: 3, name: '王五', date: '2022.07.08', sex: '男', address: '中南山3号' },
    ]

    async mounted() {
        axios({
            method: 'GET',
            url: `${JSON_SERVER}/kyc`,
            ...CORS_ALL,
        })
            .then((resp) => {
                let data = resp.data
                let items: any[] = []
                data.filter((o: any) => o.status == 0).map((o: any) => {
                    items.push({
                        ...o,
                        status: Status[o.status],
                        category: Category[o.category],
                    })
                })
                this.items = items
            })
            .catch((err) => console.error(err))
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

.audit {
    .filter {
        display: flex;
        flex-direction: row;
    }
}
</style>