import dayjs from "dayjs";
import { ref } from "vue";

const useDatePicker = () => {
  const getInitialValue = () => {
    const now = dayjs();
    return now
      .set("minute", Math.floor(now.get("minutes") / 10) * 10)
      .add(10, "minutes")
      .toDate();
  };

  const date = ref<Date>(getInitialValue());
  const onConfirm = (v: Date) => {
    if(v.getTime() < new Date().getTime()) {
      uni.showToast({title: "所选时间不能早于当前时间", icon: "none"})
      return
    }
    date.value = v;
  };
  return {
    date,
    onConfirm,
  };
};
export default useDatePicker;
