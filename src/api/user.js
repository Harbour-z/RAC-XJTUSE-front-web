import request from "@/utils/request";

//可能是Session自带，可以试着套用
export const userInfoService = () => request.get('/api/auth/userInfo')

// 获取当前用户信息
export const getCurUser = () => request.get('/api/user/getInfo')

// 更新当前用户信息(可用于Edit)
export const updateUser = (user) => request.post('/api/user/updateUser', user)

// 注销账户 DELETE /api/users/me

// 收藏商家 POST   /api/users/favorites/{merchantId}
// 取消收藏 DELETE /api/users/favorites/{merchantId}
// 获取收藏列表 GET    /api/users/favorites
// 提交评价 POST   /api/users/reviews
// 获取我的评价 GET    /api/users/reviews
// 个性化 POST   /api/users/<多个api>