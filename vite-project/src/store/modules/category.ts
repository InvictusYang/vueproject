//商品分类全局组件仓库
import {defineStore} from "pinia";
import {reqC1, reqC2, reqC3} from "@/api/product/attr";
import {ref} from "vue";
import type {CategoryResponseData} from "@/api/product/attr/type.ts";
import type {CategoryState} from "@/store/modules/types/type.ts";

let useCategoryStore = defineStore('category', (): CategoryState => {
    let c1Arr = ref<any>([])
    let c1Id = ref<number | string>('')
    let c2Arr = ref<any>([])
    let c2Id = ref<number | string>('')
    let c3Arr = ref<any>([])
    let c3Id = ref<number | string>('')

    async function getC1() {
        let result: CategoryResponseData = await reqC1()
        if (result.code == 200) {
            c1Arr.value = result.data//不要忘了value
        }
    }

    async function getC2() {
        let result: CategoryResponseData = await reqC2(c1Id.value)
        if (result.code == 200) {
            c2Arr.value = result.data
        }
    }

    async function getC3() {
        let result: CategoryResponseData = await reqC3(c2Id.value)
        if (result.code == 200) {
            c3Arr.value = result.data
        }
    }

    return {c1Id, c2Id, c3Id, c1Arr, c2Arr, c3Arr, getC1, getC2, getC3}
})

export default useCategoryStore