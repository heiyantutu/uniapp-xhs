import { MapSysDicRes2Goods } from "../../domain/goods/dto";
import useRequest from "@/hooks/useRequest";
import api from "@/utils/api";
import { useGoodsStore } from "../../store/useGoodsStore";
import * as R from "ramda";
import useServiceInfo from "@/pagesG/store/useServiceInfo";
import config from "@/utils/config";
import { useBaseStore } from "@/pagesG/store/useBaseStore";

const useFetch = () => {
  const { setGoods } = useGoodsStore();
  const baseStore = useBaseStore()
  const { run: runGetService } = useServiceInfo("008");
  const { loading, run: runGoodList } = useRequest(
    () =>
      api.mapSysDic({
        hotelCode: baseStore.base.hotelCode,
        hotelGroupCode: config.hotelGroupCode,
        categorys: "article",
        classType1: "T",
      }),
    {
      manual: true,
      onSuccess: (res) => {
        const goods = MapSysDicRes2Goods(res.labelList)
        setGoods(goods)
      },
    }
  );

  const run = () => {
    runGoodList();
    runGetService();
  };
  return {
    loading,
    run,
  };
};

export default useFetch;
