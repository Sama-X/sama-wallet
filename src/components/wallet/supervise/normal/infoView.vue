<template>
    <div class="details_view" v-if="supervise.status == 1">
        <v-simple-table>
            <tbody>
                <tr>
                    <td>姓名</td>
                    <td>{{ data.name }}</td>
                </tr>
                <tr>
                    <td>地址</td>
                    <td>{{ data.address }}</td>
                </tr>
                <tr>
                    <td>性别</td>
                    <td>{{ data.sex }}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>已提交待审核</td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
    <div class="details_view" v-else-if="supervise.status == 2">
        <v-simple-table>
            <tbody>
                <tr>
                    <td>姓名</td>
                    <td>{{ data.name }}</td>
                </tr>
                <tr>
                    <td>地址</td>
                    <td>{{ data.address }}</td>
                </tr>
                <tr>
                    <td>性别</td>
                    <td>{{ data.sex }}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>已审核</td>
                </tr>
                <tr>
                    <td>用户id</td>
                    <td>{{ data.uid }}</td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
    <div class="details_view" v-else>
        <div class="col1">姓名</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="姓名"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.name"
            ></v-text-field>
        </div>
        <div class="col1">地址</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="地址"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.address"
            ></v-text-field>
        </div>
        <div class="col1">性别</div>
        <div class="col1">
            <v-select
                class="inptuView"
                label="性别"
                :items="sexitems"
                append-icon=""
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.sex"
            ></v-select>
        </div>
        <div class="col1">资料上传</div>
        <div class="col1" style="display: block">
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
            ></v-file-input>
        </div>
        <div class="col1">密码</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="密码"
                dense
                solo
                flat
                type="password"
                hide-details
                v-model="password"
            ></v-text-field>
        </div>
        <div class="col1">
            <v-btn @click="updateUserinfo">提交</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { superviseState } from '@/store/modules/supervise/types'
import { JSON_SERVER, CORS_ALL } from '@/js/platform'
import { Uid } from '@/js/platform'
import axios from 'axios'

@Component({
    components: {},
})
export default class infoView extends Vue {
    password = null
    data: superviseState = {
        uid: null,
        level: null,
        name: null,
        address: null,
        sex: null,
        status: null,
        date: null,
    }

    sexitems = ['男', '女']

    get supervise() {
        let supervise = this.$store.state.Supervise
        return supervise
    }

    mounted() {
        this.data = this.supervise
    }

    updateUserinfo() {
        const data = { ...this.data, password: this.password, status: 0, category: 0 }
        if (data.uid == null) {
            data.uid = Uid()
            data.date = new Date().toLocaleString('zh-CN')
        }

        axios({
            method: 'POST',
            url: `${JSON_SERVER}/kyc`,
            data: {
                ...data,
            },
            ...CORS_ALL,
        }).catch((err) => console.error(err))

        this.data.status = 1
        let param = {
            data: this.data,
            category: 0,
            password: this.password,
        }
        this.$store.dispatch('Supervise/updateUser', param)

        // console.log(this.supervise)
    }
}
</script>
<style scoped lang="scss">
@use '../../../../main';

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
