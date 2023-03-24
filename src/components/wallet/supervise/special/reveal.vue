<template>
    <div class="reveal">
        <reveal-detail-model ref="checkingDetailModal"></reveal-detail-model>
        <div class="filter">
            <div>状态</div>
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
import revealDetailModel from '@/components/wallet/supervise/special/models/revealDetailModel.vue'
import { Category, JSON_SERVER, Status } from '@/js/platform'
import axios from 'axios'

@Component({
    components: {
        revealDetailModel,
    },
})
export default class reveal extends Vue {
    $refs!: {
        checkingDetailModal: revealDetailModel
    }
    headers = [
        { text: '事件ID', value: 'actionID', align: 'center', sortable: false },
        { text: '申请日期', value: 'date', align: 'center', sortable: false },
        { text: '处理结果', value: 'status', align: 'center', sortable: false },
        { text: '操作', value: 'option', align: 'center', sortable: false },
    ]
    items = [
        {
            id: 1,
            actionID: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
            date: '2022.07.06',
            status: '未处理',
        },
        {
            id: 2,
            actionID: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
            date: '2022.07.08',
            status: '未处理',
        },
        {
            id: 3,
            actionID: 'X-avax18pvlp39funywwrjympd92akmh6jqxvhu63xfme',
            date: '2022.07.08',
            status: '未处理',
        },
    ]
    selectors = ['未处理', '已处理', '待处理']
    role = ''

    @Watch('role')
    onValueChange() {
        this.doSearch()
    }

    mounted() {
        axios({
            method: 'GET',
            url: `${JSON_SERVER}/decrypt`,
        })
            .then((resp) => {
                let items: any = []
                resp.data
                    .filter((o: any) => o.status == 0)
                    .map((o: any) => {
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

.reveal {
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