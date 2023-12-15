import { ref, type Ref } from "vue"

interface Options {
  manual?: boolean
  onSuccess?: (res: any, params: any) => void
}
const useRequest = <T>(
  p: (params?: any) => Promise<any>,
  options: Options = {manual: false, onSuccess: () => undefined}
) => {
  const {manual, onSuccess} = options
  const loading = ref(false)
  const data: Ref<T | undefined> = ref(undefined)
  const run = async (params?: any) => {
    loading.value = true
    return p(params)
      .then(res => {
        data.value = res?.data || res
        onSuccess?.(data.value, params)
      })
      .finally(() => {
        loading.value = false
      })
  }
  if(!manual) {
    run()
  }
  return {
    data,
    run,
    loading
  }
}
export default useRequest