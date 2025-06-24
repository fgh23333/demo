<template>
    <div class="cart-list">
        <el-scrollbar max-height="400px">
            <div v-if="cartStore.cartItems.length > 0">
                <CartItem v-for="item in cartStore.cartItems" :key="item.id" :item="item" />
            </div>
            <el-empty v-else description="购物车还是空的，快去逛逛吧！" />
        </el-scrollbar>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import CartItem from './CartItem.vue';

const cartStore = useCartStore();

import { onMounted } from 'vue';
onMounted(() => {
    cartStore.fetchCartByAccount();
});
</script>

<style lang="scss" scoped>
.cart-list {
    padding: 0 1rem;
}
</style>