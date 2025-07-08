import {defineStore} from "pinia";
import {ref} from "vue";

export const useMerchantInfoStore = defineStore('merchantInfo',
    () => {
        // 定义变量
        const merchantInfo = ref({})

        // 设置值
        const setMerchantInfo = (newMerchantInfo) => {
            merchantInfo.value = newMerchantInfo
        }

        // 清理值
        const removeMerchantInfo = () => {
            merchantInfo.value = {}
        }

        return {
            merchantInfo, setMerchantInfo, removeMerchantInfo
        }
    },
    {
        persist: true
    });