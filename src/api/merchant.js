import request from "@/utils/request";

// 商店注册（需审核）POST   /api/merchants/register
export const merchantRegister = (query) => request.post('/api/shop/register',query);
// 用户获取商家信息 GET    /api/merchants/getInfo
export const getMerchantInfo = (merchantName, category) => request.get('/api/shop/search', {params: {
        merchantName: merchantName,
        categoryId: category !== 'all' ? category : undefined // 如果是'all'就不传这个参数
    }
});
// 获取商家信息 GET    /api/merchants/getInfo
export const getCurMerchantInfo = (query) => request.get(' /api/merchantInfo/getInfoMy',query);
// 更新商家信息 POST    /api/merchants/updateInfo
export const updateMerchantInfo = (query) => request.post('/api/merchantInfo/updateInfo',query);

export const getShopByName = (query) => request.post('/api/shop/getByName',query)

export const pageMerchants = (query) => request.get('/api/merchantInfo/listPage',{params:query})

export const getQulificationById = (query1) => request.post('/api/merchantQulification/getByMerchantId',query1)

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
export const getReview = (query) => request.post('/api/merchantInfo/reviews',query);
// 回复评价 POST   /api/merchants/replies
export const replyReview = (query) => request.post('/api/merchantInfo/replies',query);
// 个性化 POST   /api/merchants/<多个api>（先不管）