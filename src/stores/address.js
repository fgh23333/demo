import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const API_BASE_URL = 'https://hono.635262140.xyz'; // 您的Hono后端地址

const getAccountId = () => JSON.parse(sessionStorage.getItem('account'))?.accountId;

export const useAddressStore = defineStore('address', () => {
    const addresses = ref([]);
    const isLoading = ref(false);

    // 【查】获取地址列表
    async function fetchAddresses() {
        const accountId = getAccountId();
        if (!accountId) return;
        isLoading.value = true;
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${accountId}`);
            const result = await response.json();
            if (result.code === '200') {
                addresses.value = result.data;
            }
        } catch (e) {
            ElMessage.error('获取地址列表失败');
        } finally {
            isLoading.value = false;
        }
    }

    // 【增】添加新地址
    async function addAddress(addressData) {
        const accountId = getAccountId();
        if (!accountId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...addressData, account_id: accountId }),
            });
            const result = await response.json();
            if (result.code === '200') {
                addresses.value.unshift(result.data); // 将新地址添加到列表最前面
                ElMessage.success('添加成功');
                return true;
            }
        } catch (e) {
            ElMessage.error('添加地址失败');
        }
        return false;
    }

    // 【改】更新地址
    async function updateAddress(addressData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${addressData.da_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData),
            });
            const result = await response.json();
            if (result.code === '200') {
                const index = addresses.value.findIndex(a => a.da_id === addressData.da_id);
                if (index !== -1) addresses.value[index] = result.data;
                ElMessage.success('更新成功');
                return true;
            }
        } catch (e) {
            ElMessage.error('更新地址失败');
        }
        return false;
    }

    // 【删】删除地址
    async function deleteAddress(addressId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                addresses.value = addresses.value.filter(a => a.da_id !== addressId);
                ElMessage.success('删除成功');
                return true;
            }
        } catch (e) {
            ElMessage.error('删除地址失败');
        }
        return false;
    }


    return { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress };
});