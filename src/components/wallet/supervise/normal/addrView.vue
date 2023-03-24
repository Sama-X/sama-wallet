<template>
    <div class="details_view" v-if="data.status == 1">
        <v-simple-table>
            <tbody>
                <tr>
                    <td>地址</td>
                    <td>{{ data.address }}</td>
                </tr>
                <tr>
                    <td>用户id</td>
                    <td>{{ data.uid }}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>已提交</td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>

    <div class="details_view" v-else>
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
                filled
                v-model="data.address"
            ></v-text-field>
        </div>
        <div class="col1">用户id</div>
        <div class="col1">
            <v-text-field
                class="inptuView"
                label="用户id"
                dense
                solo
                flat
                type="inptuView"
                hide-details
                v-model="data.uid"
                filled
            ></v-text-field>
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
            <v-btn @click="update">提交</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { JSON_SERVER, CORS_ALL } from '@/js/platform'
import axios from 'axios'

interface data {
    uid: null
    address: null
    status: number | null
}

@Component({
    components: {},
})
export default class addrView extends Vue {
    password = null

    data: data = {
        uid: null,
        address: null,
        status: null,
    }

    update() {
        this.data.status = 1

        axios({
            method: 'POST',
            url: `${JSON_SERVER}/active`,
            data: {
                ...this.data,
                password: this.password,
                date: new Date().toLocaleString('zh-CN'),
                status: 0,
                category: 1,
            },
            ...CORS_ALL,
        })
            .then((resp) => {
                console.log('active request POST: ', resp.data)
            })
            .catch((err) => console.error(err))
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
