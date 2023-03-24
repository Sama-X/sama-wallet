import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { superviseState } from '@/store/modules/supervise/types'

const supervise_module: Module<superviseState, RootState> = {
    namespaced: true,
    state: {
        uid: null,
        level: 1,
        name: null,
        address: null,
        sex: null,
        status: null,
        date: null,
    },
    mutations: {},
    actions: {
        //@todo api
        async updateUser({ state, rootState, rootGetters, dispatch }, param) {
            state.name = param.data.name
            state.address = param.data.addr
            state.sex = param.data.sex
            state.status = param.data.status
            state.date = param.data.date

            const password = param.password
        },
        async updateLevel({ state, rootState, rootGetters, dispatch }, param) {
            state.level = param.level
        },
    },
    getters: {
        userLevel(state) {
            return state.level
        },
    },
}

export default supervise_module
