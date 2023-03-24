<template>
    <div class="sysCheckingView">
        <sys-checking-detail-modal ref="checkingDetailModal"></sys-checking-detail-modal>
        <div class="filter">
            <div>角色</div>
            <div class="filterItem">
                <v-select
                    :items="selectors"
                    placeholder="请选择角色"
                    outlined
                    dense
                    hide-details
                    v-model="role"
                ></v-select>
            </div>
        </div>
        <v-data-table :headers="headers" :items="items" key="checkingTable">
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
import sysCheckingDetailModal from '@/components/wallet/supervise/modals/sysCheckingDetailModal.vue'
import axios from 'axios'
import { Category, JSON_SERVER, Status } from '@/js/platform'

@Component({
    components: {
        sysCheckingDetailModal,
    },
})
export default class sysCheckingView extends Vue {
    $refs!: {
        checkingDetailModal: sysCheckingDetailModal
    }

    role = ''
    selectors = ['全部', 'SPV', 'Supervisor', 'SystemOperator']
    headers = [
        { text: '机构名', value: 'organ', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '申请角色', value: 'role', align: 'center', sortable: false },
        { text: '地址', value: 'address', align: 'center', sortable: false },
        { text: '操作', value: 'actions', align: 'center', sortable: false },
    ]
    items: any = []

    mounted() {
        const address = this.$store.state.address

        axios({
            method: 'GET',
            url: `${JSON_SERVER}/permission`,
        }).then((resp) => {
            let items: any[] = []

            resp.data
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
    }

    @Watch('role')
    onValueChange() {
        this.doSearch()
    }

    doSearch() {
        // TODO: search by role
    }

    onClickDetailBtn(item: any) {
        this.$refs.checkingDetailModal.open(item)
    }
}
</script>

<style scoped lang="scss">
@use '../../../main';

.sysCheckingView {
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