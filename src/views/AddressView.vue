<template>
    <div class="address-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>收货地址管理</span>
                    <el-button type="primary" :icon="Plus" @click="handleOpenDialog()">新增地址</el-button>
                </div>
            </template>
            <el-table :data="addressStore.addresses" v-loading="addressStore.isLoading" style="width: 100%">
                <el-table-column prop="contact_name" label="联系人" width="120" />
                <el-table-column label="性别" width="80">
                    <template #default="scope">{{ scope.row.contact_sex === 1 ? '先生' : '女士' }}</template>
                </el-table-column>
                <el-table-column prop="contact_tel" label="电话" width="180" />
                <el-table-column prop="address" label="地址" />
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button size="small" @click="handleOpenDialog(scope.row)">编辑</el-button>
                        <el-popconfirm title="确定要删除这个地址吗?" @confirm="handleDelete(scope.row.da_id)">
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑地址' : '新增地址'" width="500px">
            <el-form :model="form" ref="formRef" label-width="80px">
                <el-form-item label="联系人" prop="contact_name">
                    <el-input v-model="form.contact_name" />
                </el-form-item>
                <el-form-item label="性别" prop="contact_sex">
                    <el-radio-group v-model="form.contact_sex">
                        <el-radio :label="1">先生</el-radio>
                        <el-radio :label="2">女士</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="contact_tel">
                    <el-input v-model="form.contact_tel" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address" type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAddressStore } from '@/stores/address';
import { Plus } from '@element-plus/icons-vue';

const addressStore = useAddressStore();

const dialogVisible = ref(false);
const isEdit = ref(false);
const form = ref({});
const formRef = ref(null);

// 打开对话框
const handleOpenDialog = (address = null) => {
    isEdit.value = !!address;
    form.value = address ? { ...address } : { contact_sex: 1 }; // 新增时默认性别为男
    dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
    let success = false;
    if (isEdit.value) {
        success = await addressStore.updateAddress(form.value);
    } else {
        success = await addressStore.addAddress(form.value);
    }
    if (success) {
        dialogVisible.value = false;
    }
};

// 删除地址
const handleDelete = async (addressId) => {
    await addressStore.deleteAddress(addressId);
};

// 组件挂载时获取地址列表
onMounted(() => {
    addressStore.fetchAddresses();
});
</script>

<style scoped>
.address-container {
    max-width: 1000px;
    margin: 2rem auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>