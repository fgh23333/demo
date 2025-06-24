<template>
    <div class="order-view-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>我的订单</span>
                </div>
            </template>

            <div v-loading="orderStore.isLoading" class="order-list-container">
                <el-scrollbar max-height="65vh" v-if="orderStore.orderList.length > 0">
                    <OrderListItem v-for="order in orderStore.orderList" :key="order.order_id" :order="order" />
                </el-scrollbar>

                <el-empty v-else-if="!orderStore.isLoading" description="您还没有任何订单记录" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/order.js';
import OrderListItem from '@/components/Order/OrderListItem.vue';

const orderStore = useOrderStore();

// 当组件挂载到页面时，自动调用 action 来获取订单数据
onMounted(() => {
    orderStore.fetchOrders();
});
</script>

<style lang="scss" scoped>
.order-view-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.card-header {
    font-size: 1.2rem;
    font-weight: bold;
}

.order-list-container {
    min-height: 200px; // 防止加载时页面抖动
}
</style>