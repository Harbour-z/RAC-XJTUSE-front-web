import {createRouter, createWebHistory} from "vue-router";
import Login from "@/views/Login.vue";
import UserLayout from "@/views/user/UserLayout.vue";
import UserComment from "@/views/user/UserComment.vue";
import UserSetting from "@/views/user/UserSetting.vue";
import MerchantRegister from "@/views/merchant/MerchantRegister.vue";
import AdministratorLayout from "@/views/administator/AdministratorLayout.vue";
import MerchantLayout from "@/views/merchant/MerchantLayout.vue";
import FavoritesManagement from "@/views/user/FavoritesManagement.vue";
import NearbySearch from "@/views/user/NearbySearch.vue";
import FansInteract from "@/views/merchant/FansInteract.vue";
import MerchantComment from "@/views/merchant/MerchantComment.vue";
import MerchantSetting from "@/views/merchant/MerchantSetting.vue";
import UserManagement from "@/views/administator/UserManagement.vue";
import MerchantManagement from "@/views/administator/MerchantManagement.vue";
import DataAnalysis from "@/views/administator/DataAnalysis.vue";
import UserMainPage from "@/views/user/UserMainPage.vue";
import MerchantMainPage from "@/views/merchant/MerchantMainPage.vue";
import UserPersonalize from "@/views/user/UserPersonalize.vue";
import UserPrivacy from "@/views/user/UserPrivacy.vue";


const routes = [
  // 登录页
  { path: '/login', component: Login},

  // 根路径，根据角色重定向到不同布局
  {
    path: '/',
    redirect: '/login',
    children: [
      // 用户模块
      {
        path: '/user',
        component: UserLayout,
        children: [
          { path: 'UserMainPage', component: UserMainPage }, //用户主页界面
          { path: 'NearbySearch', component: NearbySearch }, //附近搜索界面
          { path: 'FavoritesManagement', component: FavoritesManagement }, //收藏管理界面
          { path: 'UserComment', component: UserComment }, //用户评论界面
          { path: 'UserSetting', component: UserSetting },//账户设置界面
          { path: 'UserPersonalize', component: UserPersonalize }, //用户个性化界面
          { path: 'UserPrivacy', component: UserPrivacy }, //用户评论界面
        ]
      },
      // 商家模块
      {
        path: '/merchant',
        component: MerchantLayout,
        children: [
          { path: 'MerchantMainPage', component: MerchantMainPage }, //商家主页界面
          { path: 'MerchantRegister', component: MerchantRegister }, //商家注册界面
          { path: 'FansInteract', component: FansInteract }, // 粉丝互动界面
          { path: 'MerchantComment', component: MerchantComment }, // 商家评论界面
          { path: 'MerchantSetting', component: MerchantSetting } // 商家设置界面
        ]
      },

      // 管理员模块
      {
        path: '/admin',
        component: AdministratorLayout,
        children: [
          { path: 'UserManagement', component: UserManagement}, // 用户管理面板
          { path: 'MerchantManagement', component: MerchantManagement }, // 管理商家
          { path: 'DataAnalysis', component: DataAnalysis }, //数据可视化界面
        ]
      }
    ]
  },
];

// 创建路由器
const router = createRouter({
  history: createWebHistory(), // 路由模式
  routes: routes
})

//导出暴露
export default router
