<template>
    <div class="details_view" v-if="data.status === 0">
        <v-simple-table>
            <tbody>
                <tr>
                    <td>当前角色</td>
                    <td>{{ data.role }}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>{{ data.result }}</td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>

    <div class="details_view" v-else-if="data.status === 1">
        <v-simple-table>
            <tbody>
                <tr>
                    <td>当前角色</td>
                    <td>{{ data.role }}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>{{ data.result }}</td>
                </tr>
                <tr>
                    <td>质押状态</td>
                    <td>{{ data.amount }}</td>
                </tr>
                <tr>
                    <td>有效期</td>
                    <td>{{ data.expiryTime }}</td>
                </tr>
            </tbody>
            <div class="col1">
                <v-btn @click="update">质押</v-btn>
            </div>
        </v-simple-table>
    </div>

    <div class="details_view" v-else>
        <div class="col1">申请角色</div>

        <div class="col1">
            <v-select
                class="inptuView"
                label="申请角色"
                :items="applyitems"
                append-icon=""
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.apply"
            ></v-select>
        </div>

        <div class="col1">推荐地址</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="推荐地址"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.address"
            ></v-text-field>
        </div>

        <div class="col1">机构名</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="机构名"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.company"
            ></v-text-field>
        </div>

        <div class="col1">公司主页</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="公司主页"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.website"
            ></v-text-field>
        </div>

        <div class="col1">资质文件</div>
        <div class="col1">
            <v-file-input
                class="inptuView"
                label="资料上传"
                style="width: 205px"
                truncate-length="15"
                :clearable="false"
                prepend-icon=""
                dense
                solo
                flat
                outlined
                hide-details
                multiple
                chips
            ></v-file-input>
        </div>
        <div class="col1">
            <v-btn @click="apply">提交</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import axios from 'axios'
import {
    AvaSingle,
    JSON_SERVER,
    HPlatformVMAPI,
    Password,
    UserName,
    ConvertPrefix,
} from '@/js/platform'

interface data {
    role: string | null
    status: number | null
    pledgeStatus: number | null
    expiryTime: string | null
    apply: string | null
    company: string | null
    website: string | null
    address: string | null
}

@Component({
    components: {},
})
export default class specialView extends Vue {
    applyitems = ['spv', 'sup', 'sys']
    password = null
    data: any = {
        role: 'spv',
        status: 3,
        result: '',
        amount: 30,
        expiryTime: '2021.01.01-2023.01.01',
        apply: 'spv',
        company: '机构机构',
        website: '网站网站',
        address: '',
    }

    status = ['审核中', '审核通过']

    mounted() {
        const address = this.$store.state.address

        axios({
            method: 'GET',
            url: `${JSON_SERVER}/permission`,
        }).then((resp) => {
            let data = resp.data.filter((o: any) => o.address == address)
            let item: any
            if (data.filter((o: any) => o.submitter.length >= 2).length != 0) {
                item = data[0]
                item.result = this.status[item.status]
                item.status = 1
                item.amount = 30
                this.data = item
            } else if (data.length != 0) {
                item = data[0]
                item.result = this.status[item.status]
                this.data = item
            }
        })
    }

    async update() {
        const avalanche = new AvaSingle().getInstance()
        const api = new HPlatformVMAPI(avalanche, '/ext/P')
        const address = this.$store.state.address
        const data = await api.addSpv(
            'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN',
            this.data.amount,
            ConvertPrefix(address),
            UserName,
            Password
        )
        console.info('addSpv: ', data.result)
    }

    apply() {
        const from = this.$store.state.address
        axios({
            method: 'POST',
            url: `${JSON_SERVER}/permission`,
            data: {
                ...this.data,
                from,
                date: new Date().toLocaleString('zh-CN'),
                submitter: [],
                status: 0,
                category: 2,
            },
        })
        this.data.status = 0
        this.data.result = this.status[0]
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

.col1 {
    border-radius: 3px;
    background-color: var(--bg-light);
    border: 1px solid transparent;
    //display: flex;
    display: grid;
    grid-template-columns: max-content 1fr;
    width: 100%;
    box-sizing: border-box;
    //overflow: auto;
    padding: 8px 14px;
    position: relative;

    //&:hover {
    //    border-color: var(--primary-color-light);
    //}
    //&:focus-within {
    //    border-color: var(--secondary-color);
    //}
}

.inptuView {
    background-color: var(--bg-light);
    color: var(--primary-color);
    // padding: 6px 14px;
}
</style>
