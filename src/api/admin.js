import request from "@/utils/request";
// 获取指定用户信息（管理员权限） GET    /api/users/{id}

//获取当前管理员信息
export const getCurAdminInfo = (admin) => request.get('/api/adminInfo/getInfoMy',{params:admin})

//id remove url?id=x 删除指定用户/商户信息（管理员权限）
export const deleteUser = (user) => request.get('/api/userInfo/removeUser',{params:user})

export const deleteMerchant = (merchant) => request.get('/api/merchantInfo/removeMerchant',{params:merchant})

//updateUser
export const updateUser = (user) => request.patch('/api/userInfo/updateUser', user)
//updateMerchant
export const updateMerchant = (merchant) => request.patch('/api/merchantInfo/updateMerchant', merchant)

// 待审核商家列表 GET    /api/admin/merchants/pending

// 批准商家 POST    /api/admin/merchants/{id}/approve

// 拒绝商家 POST    /api/admin/merchants/{id}/reject

// 下架商家 DELETE /api/admin/merchants/{id}

// 删除违规评价 DELETE /api/admin/reviews/{reviewId}

// 发送全局通知 POST   /api/admin/notifications