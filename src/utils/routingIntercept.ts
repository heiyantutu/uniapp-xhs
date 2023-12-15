
export default function () {
  // #ifdef MP-WEIXIN
  const list = ['navigateTo', 'redirectTo', 'reLaunch'];
  let isJump = false;
  list.forEach(item => {
    uni.addInterceptor(item, {
      invoke(args) {
        if (isJump) {
          return false;
        } else {
          isJump = true;
          return true;
        }
      },
      success(args) {

      },
      fail(err) {
        console.log('interceptor-fail', err)
      },
      complete(res) {
        setTimeout(() => {
          isJump = false;
        }, 500);
        console.log('interceptor-complete', res)
      }
    })
  })
  // #endif
}
