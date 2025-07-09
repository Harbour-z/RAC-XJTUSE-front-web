import request from "@/utils/request";

// 获取当前用户信息
export const getCurUser = () => request.get('/api/userInfo/getInfo')

// 更新当前用户信息(可用于Edit)
export const updateUser = (user) => request.post('/api/userInfo/updateUser', user)

export const pageUsers = (query) => request.get('/api/userInfo/listPage',{params:query})
// 注销账户 DELETE /api/users/me

// 收藏商家 POST   /api/user/favorites/{merchantId}
// 取消收藏 DELETE /api/user/favorites/{merchantId}
// 获取收藏列表 GET    /api/user/favorites

// 提交评价 POST   /api/user/reviews
// 获取我的评价 GET    /api/user/reviews
// 个性化 POST   /api/user/<多个api>
