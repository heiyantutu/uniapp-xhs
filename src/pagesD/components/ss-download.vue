<template>
	<div class="downLoad" @click="toDownload({src:fileUrl,type:fileType})">
		<i class="iconfont icon-a-40_xiazai"></i>
	</div>

</template>

<script>
	import UmengSDK from "@/utils/umengAdaptor.js";
import { getStorage } from '@/utils/wxuser';
import api from '@/utils/api';
import { jAlert3 } from '@/base/jAlert/jAlert';
	export default {
		name: 'ss-download',
		props: {
			fileUrl: {
				type: String,
				default: ''
			},
			fileType: {
				type: String,
				default: '', //1.预览图片，2.预览文件，3.预览视频
			},
			isPrivate: {
				type: Boolean,
				default: false
			},
			current: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				isAjax:false,
				isLoading:false
			};
		},
		methods: {
			toDownload(item) {
				if(this.isAjax){
					return;
				}
				this.isAjax = true
				// #ifdef H5
				this.downloadH5(item.src)
				// #endif
				// #ifdef MP-WEIXIN
				if(item.type == 1){
					this.saveToPhotosAlbum(item.src)
				} else if (item.type == 2) {
					this.saveFile(item.src)	
				}else{
					this.getDownVideo(item.src)
				}
				// #endif
				// #ifdef APP-PLUS
				this.saveFileToApp(item.src)
				// #endif
			},
			//H5下载图片到本地
			downloadH5(url) {
				this.isLoading = true
				uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: (res) => {
						console.log(res)
						if (res.statusCode === 200) {
							console.log('下载成功');
							this.staticSave()
							var oA = document.createElement("a");
							oA.download = ''; // 设置下载的文件名，默认是'下载'
							oA.href = res.tempFilePath; //临时路径再保存到本地
							document.body.appendChild(oA);
							oA.click();
							oA.remove(); // 下载之后把创建的元素删除
						}
						this.isAjax = false
					},
					fail: (res) => {
						this.isAjax = false
					}
				});
			},
			//微信小程序保存文档,不支持h5
			saveFile(url) {
				uni.showLoading()
				uni.downloadFile({ //下载文件资源到本地,返回文件的本地临时路径
					url: url, //网络图片路径
					success: (res) => {
						var filePath = res.tempFilePath;
						//保存到本地
						uni.saveFile({
							tempFilePath: filePath,
							success: function(res) {
								//res.savedFilePath文件的保存路径
								uni.openDocument({
									filePath: res.savedFilePath,
									fileType: 'pdf',
									showMenu: true,
									success: function(res) {
										uni.hideLoading()
									},
									fail: function(err) {
										uni.hideLoading()
									}
								});
							},
							fail(err) {
								console.log(err)
								uni.hideLoading()
								console.log('保存失败')
							}
						});
					}
				})
			},
			//微信小程序保存视频
			getDownVideo(url) {
				// 自定义 文件名称
				uni.showLoading({
					mask: true,
					title: '下载中...'
				})
				let fileName = new Date().valueOf();
				const task = uni.downloadFile({
					url: url,
					filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4', //  拼接本地文件路径
					success: (res) => {
						let filePath = res.filePath
						uni.saveVideoToPhotosAlbum({
							filePath,
							success: (res) => {
								uni.showToast({
									title: '已保存至手机',
									icon: 'success',
								})
								let fileMgr = wx.getFileSystemManager();
								// 删除本地文件
								fileMgr.unlink({
									filePath: wx.env.USER_DATA_PATH + '/' + fileName +
										'.mp4',
									success: function(r) {
										console.log('unlink-getFileSystemManager')
										console.log(r)
									},
								})
							},
							fail(err) {
								uni.showToast({
									title: '保存失败',
									icon: 'none',
								})
							},
							complete(res) {
								console.log('saveVideoToPhotosAlbum-complete')
								console.log(res)
								uni.hideLoading()
							}
						})
					},
					fail(err) {
						uni.showToast({
							title: '下载失败,请稍后再试',
							icon: 'none',
						})
					},
					complete(res) {
						
						console.log(res)
					}
				})
				task.onProgressUpdate(this.onProgress)
			},
			staticSave(){
		
				this.isLoading = false
				let config = getStorage('config')
				let query = getStorage('teamInfo')
				query.isPrivate = this.isPrivate
				UmengSDK.sendEvent("photo_download", {
					photo_id: this.fileUrl,
					position:this.current+1,
					top_type_name:'',
					title_name:''
				},"OTHER");
				api.interfaceTransfer({
					query:query,
					config: {
						"interfaceType": "POST",
						"interfaceModule": "GC_UCBASE_URL",
						"interfaceMethod": "albumPhoto/staticSave",
						"interfaceFrom": "GC",
						"hotelGroupCode": config.hotelGroupCode
					}
				})
					.then((res) => {
						if (res.result == 1 && res.retVal.result == 0) {
						
						} else {
							jAlert3(res.result.msg || res.msg)
						}
					});
			},
			// 提示下载进度
			onProgress(res) {
				uni.showLoading({
					mask: true,
					title: res.progress ? '下载中' + res.progress + "%" : '下载中...'
				})
			},
			//微信小程序保存图片（此处也可用于app保存图片或视频）
			saveToPhotosAlbum(url) {
				// #ifdef APP-PLUS
				var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
				// #endif
				uni.showLoading({
					title: '图片保存中...'
				})
				this.isLoading = true
				let task = uni.downloadFile({
					url: url,
					success: res => {
						const {
							statusCode,
							tempFilePath
						} = res
						if (statusCode === 200) { // saveImageToPhotosAlbum  saveVideoToPhotosAlbum  
							uni.saveImageToPhotosAlbum({ //此处也可用saveVideoToPhotosAlbum
								filePath: tempFilePath,
								success: data => {
									this.staticSave()
									console.log('data----------------->', data)
									uni.showToast({
										title: '已保存至手机',
										icon: 'success',
									})
								},
								complete: (msg) => {
									uni.hideLoading()
									// #ifdef APP-PLUS
									plus.nativeUI.closeWaiting()
									
									// #endif
									this.isAjax = false
								},
								fail:(msg)=>{
									uni.getSetting({
									success(res) {
										if (!res.authSetting['scope.writePhotosAlbum']) {
											uni.showToast({
												icon: 'none',
												title: '保存图片失败，请到设置中打开权限后重试'
											});
										}
								
									}
								});
								}
							});
						} else {
							uni.showToast({
								title: '下载失败',
								icon: 'none',
							})
							this.isAjax = false
							// #ifdef APP-PLUS
							plus.nativeUI.closeWaiting()
							// #endif
						}
					},
					complete: () => {

					}
				})
				task.onProgressUpdate((res => {
					// uni.showToast({
					// 	title: '下载中',
					// 	icon: 'none',
					// })
					// console.log('上传进度' + res.progress);
					// console.log('已经上传的数据长度' + res.totalBytesSent);
					// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
					// showLoading.setTitle("  正在下载" + res.progress + "%  ");
				}))
			},
			//移动端下载文件
			saveFileToApp(url){
				var dtask = plus.downloader.createDownload(url, {},
					function(d, status) {
						uni.showToast({
							title: '下载完成',
							mask: false,
							duration: 1000
						});
						//console.log(dtask);
						// 下载完成
						console.log('status: ' + status);
						if (status == 200) {
							console.log('下载成功：' + d.filename);
							console.log('plus.io.convertLocalFileSystemURL(d.filename): ' + plus.io
								.convertLocalFileSystemURL(d
									.filename))
							plus.runtime.openFile(plus.io.convertLocalFileSystemURL(d.filename), {}, function(success) {
								console.log('打开成功')
							}, function(error) {
								console.log('打开失败')
							})
						} else {
							uni.showToast({
								title: '下载失败-02',
								mask: false,
								duration: 1500
							});
						}
					});
				try {
					dtask.start(); // 开启下载的任务
					var prg = 0;
					var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
					dtask.addEventListener('statechanged', function(task, status) {
						// 给下载任务设置一个监听 并根据状态  做操作
						switch (task.state) {
							case 1:
								showLoading.setTitle("正在下载");
								break;
							case 2:
								showLoading.setTitle("已连接到服务器");
								break;
							case 3:
								prg = parseInt((parseFloat(task.downloadedSize) / parseFloat(task.totalSize)) * 100);
								showLoading.setTitle("  正在下载" + prg + "%  ");
								break;
							case 4:
								plus.nativeUI.closeWaiting();
								//下载完成
								break;
						}
					});
				} catch (err) {
					plus.nativeUI.closeWaiting();
					uni.showToast({
						title: '更新失败-03',
						mask: false,
						duration: 1500
					});
				}
			},

		},
		// watch: {
		// 	fileType: {
		// 		deep: true,
		// 		handler: function(value) {
		// 			if(this.fileUrl){
		// 				this.toDownload({
		// 					type:this.fileType,
		// 					src:this.fileUrl,
		// 				})
		// 			}	
		// 		}
		// 	}
		// }
	};
</script>
<style lang="less" scoped>
.downLoad,.loading{
		position: fixed;
		bottom: 32px;
		bottom: calc(32px + constant(safe-area-inset-bottom));
		bottom: calc(32px + env(safe-area-inset-bottom));
		right: 16px;
		background: #fff;
		border-radius: 50%;
		height: 38px;
		width: 38px;
		z-index: 10000;
		&.loading{
			background: none;
		
		}
		.iconfont{
			position: absolute;
			left: -1px;
			top: -1px;
			font-size: 40px;
			color: rgba(0, 0, 0, 0.88);
		}
	}

</style>

