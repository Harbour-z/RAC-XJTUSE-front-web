import {defineStore} from "pinia";
import {ref} from "vue";

export const useAdminInfoStore = defineStore('adminInfo',
    () => {
        // 定义变量
        const adminInfo = ref({})

        // 设置值
        const setAdminInfo = (newAdminInfo) => {
            adminInfo.value = newAdminInfo
        }

        // 清理值
        const removeAdminInfo = () => {
            adminInfo.value = {}
        }

        return {
            adminInfo, setAdminInfo, removeAdminInfo
        }
    },
    {
        persist: true
    });