import useRequest from "@/hooks/useRequest"
import { useBaseStore } from "@/pagesG/store/useBaseStore"
import { useServiceStore } from "@/pagesG/store/useServiceStore"
import api from "@/utils/api"
import { ref } from "vue"

const useServePerson = () => {
  const user = ref()
  const baseStore = useBaseStore()
  const serviceStore = useServiceStore()
  const { run, loading } = useRequest(
    (dutyDate: string) =>
      api.queryUserInfo({
        deptCode: '001', // 客房部
        roomCode: baseStore.base.areaCode,
        serverCode: serviceStore.service.serviceItemCode,
        dutyDate,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        user.value = res[0]
      },
    }
  )
  return {
    run,
    loading,
    user
  }
}

export default useServePerson
