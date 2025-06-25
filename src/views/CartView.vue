<template>
    <div class="cart-view-container">
        <topBar>
            <template #left>
                <el-icon @click="router.back()">
                    <ArrowLeft />
                </el-icon>
            </template>
            <template #middle>
                <span class="title">我的购物车</span>
            </template>
            <template #right></template>
        </topBar>
        <el-card class="cart-card">
            <template #header>
                <div class="card-header">
                    <span>我的购物车</span>
                </div>
            </template>

            <div v-if="Object.keys(groupedCart).length > 0">
                <div v-for="(group, businessId) in groupedCart" :key="businessId" class="business-group">
                    <h3 class="business-name">{{ group.businessName }}</h3>
                    <div class="item-list">
                        <CartItem v-for="item in group.items" :key="item.cartId" :item="item" />
                    </div>
                </div>
            </div>

            <el-empty v-else description="购物车还是空的，快去逛逛吧！" />

            <div class="cart-footer" v-if="cartStore.totalItems > 0">
                <div class="summary-info">
                    <span>共 <strong class="highlight">{{ cartStore.totalItems }}</strong> 件商品</span>
                </div>
                <div class="checkout-section">
                    <span class="total-text">合计：<span class="total-price">￥{{ cartStore.totalPrice }}</span></span>
                    <el-button type="primary" size="large" round class="checkout-btn" @click="checkout">去结算</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import CartItem from '@/components/Cart/CartItem.vue';
import topBar from '@/components/topBar.vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const cartStore = useCartStore();

// 按商家ID对购物车商品进行分组的计算属性
// 这段逻辑现在可以正常工作了，因为后端返回了嵌套的 business 对象
const groupedCart = computed(() => {
    return cartStore.cartItems.reduce((groups, item) => {
        const businessId = item.business?.businessId;
        if (!businessId) return groups;

        if (!groups[businessId]) {
            groups[businessId] = {
                businessName: item.business.businessName,
                items: []
            };
        }
        groups[businessId].items.push(item);
        return groups;
    }, {});
});

// 组件挂载时，从后端获取用户的完整购物车数据
onMounted(() => {
    cartStore.fetchCartByAccount();
});

const checkout = () => {
    if (cartStore.totalItems === 0) {
        return;
    }
    cartStore.cartItems.forEach(item => {
        cartStore.removeItem(item.goods.goodsId);
    });
    // 跳转到结算页面
    alert('结算成功')
    router.push('/');
};
</script>

<style lang="scss" scoped>
/* 样式与之前相同 */
.cart-view-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.cart-card {
    border-radius: 12px;
}

.card-header {
    font-size: 1.2rem;
    font-weight: bold;
}

.business-group {
    margin-bottom: 2rem;

    &:last-child {
        margin-bottom: 0;
    }
}

.business-name {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f0f2f5;
}

.cart-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e9e9eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-info {
    font-size: 1rem;
    color: #606266;
}

.highlight {
    color: #409eff;
    font-size: 1.2rem;
    margin: 0 4px;
}

.checkout-section {
    display: flex;
    align-items: center;
}

.total-text {
    font-size: 1rem;
    color: #303133;
    margin-right: 1rem;
}

.total-price {
    font-size: 1.6rem;
    font-weight: bold;
    color: #f56c6c;
}

.checkout-btn {
    min-width: 150px;
}
</style>