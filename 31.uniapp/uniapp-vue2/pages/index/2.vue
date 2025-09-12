<template>
	<view style="width: 100vw; height: 100vh;">
		
		<tkiBarcode
			ref="code128"
			cid="code128"
			style="position: absolute; left: -9999px;"
			:loadMake="false"
			:onval="true"
			:format="barCode.opations.code128"
			:opations="barCode.opations"
			:val="barCode.val"
			@result="code128"
		/>
			
		<image :src="wxmlToCanvas.src" style="width: 100vw; height: 100vh;"></image>
		
		<xWxmlToCanvas ref="xWxmlToCanvas" :hide="false" :width="350" :height="500" :xStyle="wxmlToCanvas.style" :xWxml="wxmlToCanvas.wxml" />
	</view>
</template>

<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import xWxmlToCanvas from '@/components/x-wxml-to-canvas/x-wxml-to-canvas.vue'
	
	export default {
		components: {
			tkiBarcode,
			xWxmlToCanvas
		},
		
		data() {
			return {
				barCode: {
					bar: ['code128', 'code39', 'ean13', 'ean8', 'upc', 'itf14'],
					val: "234234234546732456",
					barcodeUrl: "",
					opations: {
						format: "CODE128", //选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
						width: 4, //设置条之间的宽度
						height: 50, //高度
						displayValue: true, //是否在条形码下方显示文字
						// text: "FB19A1650-100S",//覆盖显示的文本
						textAlign: "center", //设置文本的水平对齐方式
						textPosition: "bottom", //设置文本的垂直位置
						textMargin: 0, //设置条形码和文本之间的间距
						fontSize: 22,//设置文本的大小
						fontColor: "#000000",//设置文本的颜色
						lineColor: "#000000",//设置条形码的颜色
						background: "#FFFFFF", //设置条形码的背景色
						margin: 0, //设置条形码周围的空白边距
						// marginTop: 10,//设置条形码周围的上边距
						// marginBottom: 20,//设置条形码周围的下边距
						// marginLeft: 30,//设置条形码周围的左边距
						// marginRight: 40,//设置条形码周围的右边距
					}
				},
				
				wxmlToCanvas: {
					src: '',
					wxml: '',
					style: '',
				}
			}
		},
		
		mounted() {
			this.$refs.code128._makeCode()
			
			setTimeout(() => {
				this.drawTemplate()
				
				setTimeout(() => {
					this.renderToCanvas()
					
					setTimeout(() => {
						this.getCanvasImage()
					}, 1000)
					
				}, 1000)
			}, 1000)
		},
		
		methods: {
			code128(imgUrl) {
				this.barCode.barcodeUrl = imgUrl;
			},
			
			drawTemplate() {
				const imgSrc = '/static/fbo_logo.png';
				
				const wxml = `
				  <view class="labelContainer">
				    <!-- Top Section -->
				    <view class="t">
				      <!-- Left Column: ID -->
				      <view class="tC1">
				        <text class="size40 tCLineMargin">ID грузового места</text>
				        <view class="flexCenter">
				          <text class="size44 blod">1000000000026</text>
				          <text class="size48 blackBox">750400</text>
				        </view>
				      </view>
				
				      <!-- Middle Column: Delivery Info -->
				      <view class="tC2">
				        <text class="size40 tCLineMargin">Nº поставки / поставщик</text>
				        <view class="flexCenter tCLineMargin">
				          <text class="size44 blod">200002885</text>
				          <text class="size48 blackBox">5738</text>
				        </view>
				        <text class="size40 blod">Товарищество с ограниченной ответственностью "Oyang"</text>
				      </view>
				
				      <!-- Right Column: Logo & Tags -->
				      <view class="tC3">
				        <image class="tC3TLogo" src="${imgSrc}" mode="widthFix" isMode="true"></image>
				        <view class="tC3B">
				          <text class="tC3BC1 flexCenter size44 blod">ГРИВНО _РФЦ</text>
				          <text class="tC3BC2 flexCenter size48">ПРЯМАЯ ПОСТАВКА В</text>
				        </view>
				      </view>
				    </view>
				
				    <!-- Bottom Section: Barcode -->
				    <view class="b">
				      <image class="bBarcode" src="${this.barCode.barcodeUrl}" mode="widthFix" isMode="true"></image>
				    </view>
				  </view>
				`;
				
				const style = {
				  labelContainer: {
				    width: 750,        // 假设设计稿宽度为 750rpx（对应 100vw）
				    height: 1334,      // 假设设计稿高度为 1334rpx（对应 100vh）
				    backgroundColor: '#ffffff',
				    position: 'relative'
				  },
				
				  // Top container (flex row)
				  t: {
				    flexDirection: 'row',
				    width: 750,
				    height: 1094,      // 82vh ≈ 0.82 * 1334
				    position: 'relative'
				  },
				
				  // Left column (35%)
				  tC1: {
				    width: 262,         // 35% of 750 ≈ 262.5
				    height: 1094,
				    borderWidth: 2,
				    borderColor: '#000000',
				    borderRightWidth: 2,
				    padding: 20
				  },
				
				  // Middle column (flex: 1)
				  tC2: {
				    flexGrow: 1,
				    height: 1094,
				    borderWidth: 2,
				    borderColor: '#000000',
				    borderRightWidth: 2,
				    padding: 20
				  },
				
				  // Right column (30%)
				  tC3: {
				    width: 225,         // 30% of 750 = 225
				    height: 1094,
				    flexDirection: 'column'
				  },
				
				  // Logo container
				  tC3TLogo: {
				    width: 100,
				    height: 100,
				    marginLeft: 'auto',
				    marginRight: 'auto',
				    marginTop: 20,
				    marginBottom: 20
				  },
				
				  // Bottom tag container
				  tC3B: {
				    flexDirection: 'row',
				    height: 1054,       // 剩余高度
				    flexGrow: 1
				  },
				
				  tC3BC1: {
				    width: 112,         // ~50% of 225
				    height: 1054,
				    borderWidth: 2,
				    borderColor: '#000000',
				    borderRightWidth: 2,
				    fontSize: 44,
				    color: '#000000',
				    textAlign: 'center',
				    backgroundColor: 'transparent'
				  },
				
				  tC3BC2: {
				    width: 113,         // 剩余
				    height: 1054,
				    fontSize: 48,
				    color: '#000000',
				    textAlign: 'center',
				    backgroundColor: 'transparent'
				  },
				
				  // Bottom barcode section
				  b: {
				    width: 750,
				    height: 240,        // 18vh ≈ 0.18 * 1334
				    borderWidth: 2,
				    borderTopWidth: 2,
				    borderColor: '#000000',
				    justifyContent: 'center',
				    alignItems: 'center'
				  },
				
				  bBarcode: {
				    height: 210         // 15vh ≈ 0.15 * 1334
				  },
				
				  // Shared styles
				  flexCenter: {
				    flexDirection: 'row',
				    alignItems: 'center',
				    justifyContent: 'center'
				  },
				
				  blackBox: {
				    fontSize: 48,
				    color: '#ffffff',
				    backgroundColor: '#000000',
				    borderRadius: 12,
				    padding: 8,
				    marginLeft: 36
				  },
				
				  blod: {
				    fontWeight: 700
				  },
				
				  size48: { fontSize: 48 },
				  size44: { fontSize: 44 },
				  size40: { fontSize: 40 },
				
				  tCLineMargin: {
				    marginLeft: 12
				  }
				};
				
				this.wxmlToCanvas.wxml = wxml
				this.wxmlToCanvas.style = style
			},
			
			renderToCanvas() {
				console.log("renderToCanvas渲染图片")
				this.$refs.xWxmlToCanvas.renderToCanvas();
			},
			
			canvasToTempFilePath() {
				this.$refs.xWxmlToCanvas.canvasToTempFilePath().then(res => {
					console.log("canvasToTempFilePath导出图片-->", res)
					this.wxmlToCanvas.src = res;
				});
			},
			
			getCanvasImage() {
				this.$refs.xWxmlToCanvas.getCanvasImage().then(res => {
					console.log("getCanvasImage直接获取图片-->", res)
					this.wxmlToCanvas.src = res;
				});
			},
			
			saveImageToPhotosAlbum() {
				console.log("saveImageToPhotosAlbum保存至本地-->", this.wxmlToCanvas.src)
				this.$refs.xWxmlToCanvas.saveImageToPhotosAlbum(this.wxmlToCanvas.src)
			},
		},
		
	}
</script>


<style scoped>
</style>
