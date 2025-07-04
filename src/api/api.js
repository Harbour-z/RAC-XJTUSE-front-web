import request from "@/utils/request";

//登录
export const userLogin = (user) => request.post('/api/user/login',user);

//获取当前用户
export const getCurUser = () => request.get('/api/user/getInfo')

//getpage
export const pageUsers = (query) => request.get('/api/user/listPage',{params:query})

//Uesr is_deleted
export const deleteUser = (user) => request.post('/api/user/deleteUser', user)
//id remove url?id=x
export const removeById = (user) => request.get('/api/user/removeUser',{params:user})
//Edit
export const updateUser = (user) => request.post('/api/user/updateUser', user)
//url?msg="你好"
export const aiChat = (query) => request.get('/api/ai/chat1',{params:query})