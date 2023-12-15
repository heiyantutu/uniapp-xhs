export function initWebSDK(opt) {
  if (opt.metaInfo) {
    Object.keys(opt.metaInfo).forEach((n) => {
      if (n == "pageConfig") {
        opt.metaInfo[n].hashMode = true;
        Object.keys(opt.metaInfo[n]).forEach((m) => {
          opt.metaInfo[n][`#/${m}`] = opt.metaInfo[n][m];
        })
      }
      aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: [n, opt.metaInfo[n]]
      });
    })
  }
  return aplus_queue
}