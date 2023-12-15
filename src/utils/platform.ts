
export function setClipboardData(option: any) {
  uni.setClipboardData({
    data: option.data,
    success: () => {
      if (option.success) {
        option.success()
      }
    }
  })
}
export function previewImage(option: any) {
  uni.previewImage({
    current: option.current,
    urls: option.urls
  })
}
export function getMenuButtonBoundingClientRect() {
  // #ifdef MP
  return uni.getMenuButtonBoundingClientRect()
  // #endif
  // #ifdef H5
  return {
    bottom: 56,
    height: 32,
    left: 281,
    right: 368,
    top: 24,
    width: 87,
  }
  // #endif
}