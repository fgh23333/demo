<template>
  <div class="wrapper">
    <topBar>
      <template #left>
        <el-icon @click="router.back()">
          <ArrowLeft />
        </el-icon>
      </template>
      <template #middle>
        <span>商家列表</span>
      </template>
      <template #right></template>
    </topBar>
    <ul class="business">
      <!--: 循环迭代 商家列表部分 Begin -->
      <li v-for="(item) in businessList" :key="item.businessId" @click="toBusinessInfo(item.businessId)">
        <div class="business-img">
          <img :src="item.businessImg">
          <!-- 角标：显示是购物车中的商品数量 -->
          <div class="business-img-quantity" v-show="item.quantity != 0">
            {{ item.quantity }}
          </div>
        </div>
        <div class="business-info">
          <h3>{{ item.businessName }}</h3>
          <p>&#165; {{ item.starPrice }} 起送 | &#165; {{ item.deliveryPrice }} 配送</p>
          <p>{{ item.businessExplain }}</p>
        </div>
      </li>
      <!--: 循环迭代 商家列表部分 End -->
    </ul>

    <!-- 该分类下商家数组businessList长度小于等于0。显示没有商家数据 -->
    <div style="text-align: center; margin-top:20vw; " v-if="businessList.length <= 0">该类别目前没有商家信息</div>
    <!-- 底部菜单部分 -->
    <Footer></Footer>

  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import { ref } from "vue"
import { get } from '@/api';
import { useRouter, useRoute } from "vue-router"
import { getSessionStorage } from '@/common';
import topBar from '@/components/topBar.vue';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter(); //创建路由对象
const route = useRoute();
const businessList = ref([]);
const account = getSessionStorage('account');

//点击商家，获得商家编号，传递至商家详情页面
const toBusinessInfo = (id) => {
  router.push({
    path: '/businessInfo',
    query: { businessId: id }
  });
}

//请求服务器端，查询该分类下的所有商家数据
const loadBusiness = () => {
  //获得首页跳转过来传递的分类编号categoryId参数值：
  let categoryId = route.query.categoryId;
  let url = `/business/listByCategoryId/${categoryId}`;
  get(url).then(res => {
    businessList.value = res.data.resultdata;
    //先加载页面上商家的数据然后再去加载购物车角标
    if (account != null) {
      loadCart();
    }
  })
}

//加载购物车数据
const loadCart = () => {
  let url = `/cart/listCartByAccountId/${account.accountId}`;
  get(url).then(res => {
    if (res.data.code == 20000) {
      let cartArray = res.data.resultdata;
      for (let i = 0; i < businessList.value.length; i++) {
        businessList.value[i].quantity = 0;
        for (let cart of cartArray) {
          if (businessList.value[i].businessId == cart.businessId) {
            businessList.value[i].quantity += cart.quantity;
          }
        }
      }
    }
  });
}

const init = () => {
  loadBusiness();
}

init();

</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background: linear-gradient(to right, #fff1eb, #ace0f9);
  color: #596164;

  font-size: 4.8vw;
  letter-spacing: 1vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;
}

/****************** 商家列表部分 ******************/
.wrapper .business {
  width: 100%;
  margin-top: 12vw;
  margin-bottom: 14vw;
}

.wrapper .business li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  border-bottom: solid 1px #ddd;
  user-select: none;
  cursor: pointer;

  display: flex;
  align-items: center;
}

.wrapper .business li .business-img {
  /*这里设置为相当定位，成为business-img-quantity元素的父元素*/
  position: relative;

}

.wrapper .business li .business-img img {
  width: 20vw;
  height: 20vw;
  border-radius: 2.5vw;
}

.wrapper .business li .business-img .business-img-quantity {
  width: 5vw;
  height: 5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  border-radius: 2.5vw;

  display: flex;
  justify-content: center;
  align-items: center;

  /*设置成绝对定位，不占文档流空间*/
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}

.wrapper .business li .business-info {
  margin-left: 3vw;
}

.wrapper .business li .business-info h3 {
  font-size: 3.8vw;
  color: #555;
}

.wrapper .business li .business-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}
</style>