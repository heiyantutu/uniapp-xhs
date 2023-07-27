import { ref } from 'vue';
import { onPageScroll } from "@dcloudio/uni-app";

export default function useScroll() {
  const scrollTop = ref(0);
  
  return { scrollTop, onPageScroll };
}