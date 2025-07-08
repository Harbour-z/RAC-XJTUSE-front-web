import request from "@/utils/request";

//登录
//传入用户名与密码
export const userLogin = (query) => request.post('/api/userInfo/login',query);
export const merchantLogin = (query) => request.post('/api/merchantInfo/login',query);
export const adminLogin = (query) => request.post('/api/adminInfo/login',query);

//注册
export const userRegister = (query) => request.post('/api/userInfo/register',query);
export const merchantRegister = (query) => request.post('/api/merchantInfo/register',query);

//url?msg="你好"
export const aiChat = (query) => request.get('/api/ai/chat1',{params:query})
