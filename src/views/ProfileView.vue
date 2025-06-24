<template>
    <topBar>
    <template #left>
      <el-icon @click="router.go(-1)"><ArrowLeft /></el-icon>
    </template>
    <template #middle>个人中心</template>
    <template #right></template>
    </topBar>
  <div class="profile-container">
    <el-card class="profile-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6" style="text-align: center;">
          <el-avatar :size="100" :src="account?.accountImg" />
        </el-col>
        <el-col :span="18">
          <h1 class="user-nickname">{{ account?.accountName }}</h1>
          <p class="user-id">用户ID: {{ account?.accountId }}</p>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="menu-card">
       <template #header>功能入口</template>
       <div class="menu-grid">
         <div class="menu-item" @click="router.push('/orderList')">
           <el-icon :size="30"><Tickets /></el-icon>
           <span>我的订单</span>
         </div>
         <div class="menu-item" @click="router.push('/addresses')">
           <el-icon :size="30"><Location /></el-icon>
           <span>地址管理</span>
         </div>
         <div class="menu-item" @click="router.push('/cart')">
           <el-icon :size="30"><ShoppingCartFull /></el-icon>
           <span>我的购物车</span>
         </div>
         <div class="menu-item">
           <el-icon :size="30"><Star /></el-icon>
           <span>我的收藏</span>
         </div>
       </div>
    </el-card>
    
    <div class="logout-container">
        <el-button type="danger" plain @click="handleLogout" class="logout-btn">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Tickets, Location, ShoppingCartFull, Star } from '@element-plus/icons-vue';
import topBar from '@/components/topBar.vue';
import { ArrowLeft } from '@element-plus/icons-vue';

const account = ref(null);
const router = useRouter();

onMounted(() => {
  const accountString = sessionStorage.getItem('account');
  if (accountString) {
    account.value = JSON.parse(accountString);
  }
});

const handleLogout = () => {
    sessionStorage.removeItem('account');
    // 这里可以根据您的项目情况，跳转到登录页或首页
    router.push('/'); // 简单地刷新页面
};
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 800px;
  margin: 1rem auto;
}
.profile-card {
  margin-bottom: 20px;
  .user-nickname {
    font-size: 2rem;
    margin: 0 0 10px 0;
  }
  .user-id {
    color: #909399;
    font-size: 0.9rem;
  }
}
.menu-card {
    .menu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 20px;
    }
    .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
        &:hover {
            background-color: #f5f7fa;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
        span {
            margin-top: 10px;
        }
    }
}
.logout-container {
    margin-top: 30px;
    text-align: center;
    .logout-btn {
        width: 100%;
        max-width: 400px;
    }
}
</style>