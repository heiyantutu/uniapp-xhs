export const processRsApi = (
  url: string,
  res: UniApp.RequestSuccessCallbackResult,
  reject: (reason?: any) => void
) => {
  if (url.includes('/rsapi')) {
    const { code, message } = res.data as AnyObject
    if (code !== 0) {
      uni.showToast({ title: message, icon: 'none' })
      reject(message)
    }
  }
}
