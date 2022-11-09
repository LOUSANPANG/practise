export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
	// 将请求参数拼接到网址
	joinParamsToUrl?: boolean;
	// 格式化请求参数时间
	formatDate?: boolean;
	// 是否处理请求结果
	isTransformResponse?: boolean;
	// 是否需要获取响应标头
	isReturnNativeResponse?: boolean;
	// 是否加入网址
	joinPrefix?: boolean;
	// 接口地址，如果将其留空，使用默认 apiUrl
	apiUrl?: string;
	// 请求拼接路径
	urlPrefix?: string;
	// 错误消息提示类型
	errorMessageMode?: ErrorMessageMode;
	// 是否添加时间戳
	joinTime?: boolean;
	ignoreCancelToken?: boolean;
	// 是否在标头中发送令牌
	withToken?: boolean;
}

export interface Result<T = any> {
	code: number;
	type: 'success' | 'error' | 'warning';
	message: string;
	result: T;
}

// multipart/form-data: 上传文件
type Recordable<T = any> = Record<string, T>;
export interface UploadFileParams {
	data?: Recordable;
	name?: string;
	file: File | Blob;
	filename?: string;
	[key: string]: any;
}