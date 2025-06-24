<template>
    <topBar>
        <template #left>
            <el-icon @click="router.back()">
                <ArrowLeft />
            </el-icon>
        </template>
        <template #middle>
            <span>订单详情</span>
        </template>
        <template #right>
            <el-button text type="primary">返回首页</el-button>
        </template>
    </topBar>
    <el-card class="order-list-item" shadow="hover">
        <div class="order-header">
            <span class="shop-name">{{ order.business?.business_name || '未知商家' }}</span>
            <el-tag :type="order.state === 1 ? 'success' : 'info'" effect="light">
                {{ getOrderStatusText(order.state) }}
            </el-tag>
        </div>
        <div class="order-body">
            <div class="item-summary">
                <span>{{ order.details[0]?.goods?.goods_name }}</span>
                <span v-if="order.details.length > 1"> 等{{ order.details.length }}件商品</span>
            </div>
            <div class="price-info">
                <span class="total-price">￥{{ order.order_total }}</span>
            </div>
        </div>
        <div class="order-footer">
            <span class="order-time">{{ new Date(order.created).toLocaleString() }}</span>
            <div class="actions">
                <el-button text bg>再来一单</el-button>
                <el-button text bg type="primary">订单详情</el-button>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import topBar from '@/components/topBar.vue';
import { ArrowLeft } from '@element-plus/icons-vue';
const router = useRouter();

defineProps({
    order: {
        type: Object,
        required: true
    }
});

// 辅助函数，将订单状态码转换为文字
const getOrderStatusText = (state) => {
    switch (state) {
        case 0: return '未支付';
        case 1: return '已支付';
        case 2: return '已发货';
        case 3: return '已完成';
        case 4: return '已取消';
        default: return '未知状态';
    }
}
</script>

<style lang="scss" scoped>
.order-list-item {
    margin-bottom: 1rem;

    :deep(.el-card__body) {
        padding-bottom: 0.8rem;
    }
}

.order-header,
.order-body,
.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
}

.order-header {
    padding-bottom: 0.8rem;
    border-bottom: 1px solid #f0f2f5;
    margin-bottom: 1rem;

    .shop-name {
        font-weight: bold;
        font-size: 1.1rem;
    }
}

.item-summary {
    color: #606266;
    font-size: 0.9rem;
}

.price-info .total-price {
    font-size: 1.3rem;
    font-weight: bold;
    color: #f56c6c;
}

.order-footer {
    margin-bottom: 0.5rem;

    .order-time {
        font-size: 0.8rem;
        color: #909399;
    }

    .actions .el-button {
        margin-left: 0.5rem;
    }
}
</style>