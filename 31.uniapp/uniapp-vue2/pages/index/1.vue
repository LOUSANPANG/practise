<template>
	<view class="label-container">
		
		<view class="t">
			<view class="t-c1 c-container vertical-text">
				<view class="size-40 t-c-line-margin">ID грузового места</view>
				<view class="flex-center">
					<view class="size-44 blod">1000000000026</view>
					<view class="size-48 black-box">750400</view>
				</view>
			</view>
			
			<view class="t-c2 c-container vertical-text">
				<view class="size-40 t-c-line-margin">Nº поставки / поставщик</view>
				<view class="flex-center t-c-line-margin">
					<view class="size-44 blod">200002885</view>
					<view class="size-48 black-box">5738</view>
				</view>
				<view class="size-40 blod">Товарищество с ограниЧенной ответствеННоСТь "Oyang"</view>
			</view>
				
			<view class="t-c3">
				<view class="t-c3_t">
					<image class="t-c3_t-logo" src="/static/fbo_logo.png"></image>
				</view>
				<view class="t-c3_b">
					<view class="t-c3_b-c1 vertical-text flex-center size-44 blod">ГРИВНО _РФЦ</view>
					<view class="t-c3_b-c2 vertical-text flex-center size-48">ПРЯМАЯ ПОСТАВКА В</view>
				</view>
			</view>
		</view>
			
		<view class="b">
			<image class="b-barcode" :src="barcodeUrl"></image>
			<tkiBarcode cid="code128" style="position: absolute; left: -9999px;" :loadMake="false" :opations="opations"
				:onval="true" format="code128" :val="val" ref="code128" @result="code128" />
		</view>
			
	</view>
</template>


<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	
	export default {
		components: {
			tkiBarcode,
		},
		
		data() {
			return {
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
			};
		},
		
		mounted() {
			this.$refs.code128._makeCode()
		},
		
		methods: {
			code128(imgUrl) {
				this.barcodeUrl = imgUrl;
			},
		}
	};
</script>


<style scoped>
	.flex-center {
		display: flex;
		align-items: center;
	}
	
	.black-box {
		margin-top: 36rpx;
		padding: 8rpx;
		color: white;
		border-radius: 12rpx;
		background-color: black;
	}
	
	.t-c-line-margin {
		margin-left: 12rpx;
	}
	
	.blod {
		font-weight: 700;
	}
	
	.size-48 {
		font-size: 48rpx;
	}
	
	.size-44 {
		font-size: 44rpx;
	} 
	
	.size-40 {
		font-size: 40rpx;
	}
	
	.label-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		background-color: white;
		overflow: hidden;
	}
	
	.c-container {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.vertical-text {
		writing-mode: vertical-rl;
		text-orientation:sideways-right;
		white-space: normal;
		word-break: break-all;
	}
	
	.t {
		display: flex;
		width: 100%;
		height: 82vh;
	}
	
	.t-c1 {
		box-sizing: border-box;
		display: flex;
		width: 35%;
		height: 100%;
		border-right: 2px solid black;
	}
	
	.t-c2 {
		box-sizing: border-box;
		display: flex;
		flex: 1;
		flex-shrink: 0;
		height: 100%;
		border-right: 2px solid black;
	}
	
	.t-c3 {
		display: flex;
		flex-direction: column;
		width: 30%;
		height: 100%;
	}
	.t-c3_t {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 200rpx;
		border-bottom: 2px solid black;
	}
	.t-c3_t-logo {
		transform: rotate(1.25turn);
		width: 100rpx;
		height: 100rpx;
	}
	.t-c3_b {
		overflow: hidden;
		flex: 1;
		flex-shrink: 1;
		display: flex;
	}
	.t-c3_b-c1 {
		box-sizing: border-box;
		padding: 20rpx 0;
		width: 50%;
		border-right: 2px solid black;
	}
	.t-c3_b-c2 {
		box-sizing: border-box;
		padding: 20rpx 0;
		width: 50%;
	}
	
	.b {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border-top: 2px solid black;
		width: 100%;
		height: 18vh;
	}
	.b-barcode {
		height: 15vh;
	}
</style>