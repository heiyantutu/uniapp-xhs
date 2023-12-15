
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
