import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 您的Hono后端API地址
const API_BASE_URL = 'http://localhost:3000';

export const useOrderStore = defineStore('order', () => {
    // State: 存储订单列表和加载状态
    const orderList = ref([]);
    const isLoading = ref(false);

    // Helper: 从 sessionStorage 获取当前登录用户的 accountId
    const getAccountId = () => {
        const accountString = sessionStorage.getItem('account');
        if (accountString && accountString !== '[object Object]') {
            try {
                return JSON.parse(accountString)?.accountId;
            } catch {
                return null;
            }
        }
        return null;
    };

    /**
     * Action: 从后端API获取订单列表
     */
    async function fetchOrders() {
        const accountId = getAccountId();
        if (!accountId) {
            ElMessage.warning('请先登录以查看订单');
            return;
        }

        isLoading.value = true;
        try {
            // 使用标准的 fetch API 调用您的 Hono 后端
            const response = await fetch(`${API_BASE_URL}/api/orders/${accountId}`);
            
            // 检查网络请求是否成功
            if (!response.ok) {
                throw new Error(`HTTP 错误! 状态码: ${response.status}`);
            }

            const result = await response.json();
            console.log("获取订单列表结果:", result);

            // 检查业务逻辑是否成功
            if (result.code === '200') {
                orderList.value = result.data;
            } else {
                ElMessage.error(result.msg || '获取订单列表失败');
            }
        } catch (error) {
            console.error("获取订单列表失败:", error);
            ElMessage.error('网络错误或服务器异常，请稍后重试');
        } finally {
            isLoading.value = false;
        }
    }

    return {
        orderList,
        isLoading,
        fetchOrders,
    };
});