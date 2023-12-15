export function jAlert3(msg: string, time?: number) {
	var msgLenght = 0;
	if (msg) {
		msgLenght = msg.length;
	}
	if (msgLenght > 20) {
		uni.showModal({
			title: '提示',
			content: msg,
			showCancel: false,
		})
	} else {
		var newTime = time ? time : 2000;
		uni.showToast({
			title: msg,
			icon: 'none',
			duration: newTime
		})
	}
}
export function jAlert5(msg: string, successFn: Function, failFn?: Function, content?: string) {
	uni.showModal({
		title: msg,
		content: content || '',
		success: function (sm) {
			if (sm.confirm) {
				successFn && successFn()
			} else if (sm.cancel) {
				failFn && failFn()
			}
		}
	})
}
