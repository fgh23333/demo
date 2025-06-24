<template>
    <div class="cart-item">
        <el-image v-if="item.goods" :src="item.goods.goodsImg" fit="cover" class="item-image">
            <template #error>
                <div class="image-slot">
                    <el-icon>
                        <Picture />
                    </el-icon>
                </div>
            </template>
        </el-image>

        <div class="item-details" v-if="item.goods">
            <p class="item-name">{{ item.goods.goodsName }}</p>
            <p class="item-price">￥{{ item.goods.goodsPrice.toFixed(2) }}</p>
        </div>
        <div class="item-details" v-else>
            <p class="item-name">商品信息加载失败</p>
        </div>

        <div class="item-actions">
            <el-input-number :model-value="item.quantity" @change="handleQuantityChange" :min="1" :max="99" size="small"
                controls-position="right" />
            <el-button type="danger" :icon="Delete" circle @click="handleRemoveItem" class="remove-btn" title="删除商品" />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useCartStore } from '@/stores/cart';
import { Delete, Picture } from '@element-plus/icons-vue';

const props = defineProps({
    item: { type: Object, required: true },
});

const cartStore = useCartStore();

const handleQuantityChange = (newQuantity) => {
    if (props.item.goods?.goodsId) {
        cartStore.updateQuantity(props.item.goods.goodsId, newQuantity);
    }
};

const handleRemoveItem = () => {
    if (props.item.goods?.goodsId) {
        cartStore.removeItem(props.item.goods.goodsId);
    }
};
</script>

<style lang="scss" scoped>
/* 样式与之前相同 */
.cart-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #e9e9eb;
}

.item-image {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    margin-right: 1rem;
    flex-shrink: 0;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #c0c4cc;
    font-size: 30px;
}

.item-details {
    flex-grow: 1;
    min-width: 0;
}

.item-name {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.5rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-price {
    font-size: 1rem;
    color: #f56c6c;
    font-weight: bold;
    margin: 0;
}

.item-actions {
    display: flex;
    align-items: center;
    margin-left: 1rem;
}

.el-input-number {
    width: 100px;
}

.remove-btn {
    margin-left: 1rem;
}
</style>