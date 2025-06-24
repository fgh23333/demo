import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { get, post } from '@/api/index.js'; // 确保路径正确
import { ElMessage } from 'element-plus';

/**
 * @description 从 sessionStorage 安全地获取和解析 account 对象
 * @returns {object | null}
 */
function getAccountFromSession() {
    const accountString = sessionStorage.getItem('account');
    if (accountString && accountString !== '[object Object]') {
        try {
            return JSON.parse(accountString);
        } catch (e) {
            console.error("解析 'account' 数据失败:", e);
            return null;
        }
    }
    return null;
}

export const useCartStore = defineStore('cart', () => {
    // State: 购物车商品列表
    const cartItems = ref([]);

    // Getter: 计算商品总数
    const totalItems = computed(() =>
        cartItems.value.reduce((total, item) => total + item.quantity, 0)
    );

    // Getter: 计算总价
    const totalPrice = computed(() =>
        cartItems.value.reduce((total, item) => {
            const price = item.goods?.goodsPrice || 0;
            return total + price * item.quantity;
        }, 0)
    );

    /**
     * Action: 从后端获取用户的完整购物车
     */
    async function fetchCartByAccount() {
        const account = getAccountFromSession();
        if (!account?.accountId) {
            this.cartItems = [];
            return;
        }
        try {
            const response = await get(`/cart/listCartByAccountId/${account.accountId}`);
            if (response.data.code === '200' || response.data.code === 20000) {
                this.cartItems = Array.isArray(response.data.resultdata) ? response.data.resultdata : [];
            } else {
                ElMessage.error(response.data.msg || '加载购物车失败');
                this.cartItems = [];
            }
        } catch (error) {
            console.error("加载完整购物车失败:", error);
            this.cartItems = [];
        }
    }

    /**
     * Action: 添加商品到购物车
     * @param {object} product - 包含 goodsId 和 businessId 的商品对象
     */
    async function addItem(product) {
        const account = getAccountFromSession();
        if (!account) return ElMessage.warning('请先登录！');

        const existingItem = this.cartItems.find(item => item.goodsId === product.goodsId);
        if (existingItem) {
            // 如果已存在，则调用更新数量的 action
            await this.updateQuantity(product.goodsId, existingItem.quantity + 1);
        } else {
            const payload = {
                goodsId: product.goodsId,
                businessId: product.businessId,
                accountId: account.accountId,
                quantity: 1,
            };
            try {
                const response = await post('/cart/add', payload, true);
                if (response.data.code === '200' || response.data.code === 20000) {
                    // 添加成功后，重新获取整个购物车以确保数据绝对同步
                    await this.fetchCartByAccount();
                } else {
                    ElMessage.error(response.data.msg || '添加失败');
                }
            } catch (error) {
                console.error("添加购物车失败:", error);
            }
        }
    }

    /**
     * Action: 更新购物车商品数量
     * @param {number} goodsId
     * @param {number} newQuantity
     */
    async function updateQuantity(goodsId, newQuantity) {
        const account = getAccountFromSession();
        if (!account) return;

        if (newQuantity <= 0) {
            await this.removeItem(goodsId);
            return;
        }
        
        const payload = { goodsId, accountId: account.accountId, quantity: newQuantity };
        try {
            const response = await post('/cart/update', payload, true);
            if (response.data.code === '200' || response.data.code === 20000) {
                const item = this.cartItems.find(i => i.goodsId === goodsId);
                if (item) item.quantity = newQuantity;
            } else {
                ElMessage.error(response.data.msg || '更新失败');
            }
        } catch (error) {
            console.error("更新购物车数量失败:", error);
        }
    }

    /**
     * Action: 从购物车移除商品
     * @param {number} goodsId
     */
    async function removeItem(goodsId) {
        const account = getAccountFromSession();
        if (!account) return;

        const payload = { goodsId, accountId: account.accountId };
        try {
            const response = await post('/cart/remove', payload, true);
            if (response.data.code === '200' || response.data.code === 20000) {
                this.cartItems = this.cartItems.filter(item => item.goodsId !== goodsId);
            } else {
                ElMessage.error(response.data.msg || '删除失败');
            }
        } catch (error) {
            console.error("删除购物车项目失败:", error);
        }
    }

    return {
        cartItems,
        totalItems,
        totalPrice,
        fetchCartByAccount,
        addItem,
        updateQuantity,
        removeItem,
    };
});

useCartStore.persist = {
    enabled: true,
    strategies: [
        {
            key: 'cart',
            storage: sessionStorage,
        },
    ],
};