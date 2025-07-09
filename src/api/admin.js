import request from "@/utils/request";
// 获取指定用户信息（管理员权限） GET    /api/users/{id}

//获取当前管理员信息
export const getCurAdminInfo = (user) => request.get('/api/adminInfo/getInfoMy',{params:user})

//id remove url?id=x 删除指定用户信息（管理员权限）
export const deleteUser = (user) => request.get('/api/userInfo/removeUser',{params:user})

// 待审核商家列表 GET    /api/admin/merchants/pending

// 批准商家 POST    /api/admin/merchants/{id}/approve

// 拒绝商家 POST    /api/admin/merchants/{id}/reject

// 下架商家 DELETE /api/admin/merchants/{id}

// 删除违规评价 DELETE /api/admin/reviews/{reviewId}

// 发送全局通知 POST   /api/admin/notifications