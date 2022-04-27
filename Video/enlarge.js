import { ref } from 'vue'
export const openID = ref(0) //放大哪个视频
export function enlarge(temp) {
  openID.value = openID.value === temp ? 0 : temp
}
