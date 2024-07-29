import { ref } from 'vue'
import { defineStore } from 'pinia'
function initState() {
    return {
        isFlag: false,
        count: 0
    }
}
export const useDataStore = defineStore('Data', {
    state: () => ({
        isflag: false,
        count: 0
    }),
    actions: {
        add80() {
            this.count += 80
        }
    }

})


