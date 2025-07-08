import request from "@/utils/request";

// 商家注册（需审核）POST   /api/merchants/register
export const merchantRegister = (query) => request.post('/api/merchantInfo/register',query);
// 获取商家信息 GET    /api/merchants/getInfo
export const getMerchantInfo = (query) => request.get(' /api/merchantInfo/getInfo',query);
// 更新商家信息 POST    /api/merchants/updateInfo
export const updateMerchantInfo = (query) => request.post('/api/merchantInfo/updateInfo',query);

//不知道要不要加商品
// // 获取商品列表 GET    /api/merchants/getProducts
// export const getProducts = (query) => request.get('/api/merchantInfo/getProducts',query);
// // 添加商品 POST   /api/merchants/addProducts
// export const addProducts = (query) => request.post('/api/merchantInfo/addProducts',query);
// // 更新商品 POST    /api/merchants/products/{productId}
// export const updateProduct = (query) => request.post('/api/merchantInfo/updateinfo',query);
// // 删除商品 DELETE /api/merchants/products/{productId}
// export const updateMerchantInfo = (query) => request.delete('/api/merchantInfo/updateinfo',query);




// 获取商家评价 GET    /api/merchants/reviews
// 回复评价 POST   /api/merchants/replies/{reviewId}

// 个性化 POST   /api/users/<多个api>