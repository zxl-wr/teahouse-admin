<template>
    <div class="flex-row-between">
        <h1>收费标准</h1>
        <el-button type="primary" @click="isShowDialog = true">
            修改
        </el-button>
    </div>
    <!-- 显示收费标准 -->
    <h2 class="flex-row" v-for="(item, index) in chargeRates" :key="index">
        <img class="w-48px" src="@/assets/img/img-tea.png" alt="·" />
        <template v-if="item.type == 0"> {{ item.district[0] }} 到 {{ item.district[1] }} 小时内，一共收费 {{ item.price }} 元
        </template>
        <template v-if="item.type == 1"> {{ item.district[0] }} 到 {{ item.district[1] }} 小时内，每小时收费 {{ item.price }} 元
        </template>
    </h2>
    <!-- 修改收费标准 -->
    <el-dialog v-model="isShowDialog" title="修改收费标准" width="980" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-button type="primary" @click="addCharge">
            + 新增时间阶段
        </el-button>
        <div class="flex-row my-2" v-for="(item, index) in temporaryCharge" :key="index">
            <span>时间（小时）：</span>
            <el-input-number v-model="item.district[0]" :min="0" />
            <span class="mx-1">——</span>
            <el-input-number v-model="item.district[1]" :min="0" />
            <el-select class="ml-4 mr-2" v-model="item.type" placeholder="收费方式">
                <el-option label="区间收费" :value="0" />
                <el-option label="按时收费/小时" :value="1" />
            </el-select>
            <span>金额：</span>
            <el-input-number v-model="item.price" :min="0" />
            <el-button class="ml-2" type="danger" @click="deleteCharge(index)">
                删除
            </el-button>
        </div>
        <template #footer>
            <el-button @click="isShowDialog = false">取消</el-button>
            <el-button type="primary" @click="updateCharge">确定</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
/**
 * 显示收费标准
 */
import { storeToRefs } from 'pinia';
import { useChargeStore } from '@/store/charge.ts';
const chargeStore = useChargeStore();
const { chargeRates } = storeToRefs(chargeStore); // 当前订单

/**
 * 修改收费标准
 */
import { Charge } from '@/assets/type.ts';
const isShowDialog = ref(false); // 是否打开修改收费弹窗
const temporaryCharge = ref<Charge[]>(); // 临时收费标准
const { updateChargeRates } = chargeStore;
watch(isShowDialog, (newValue) => {
    if (newValue) temporaryCharge.value = JSON.parse(JSON.stringify(chargeRates.value));
});
// 新增收费标准
const addCharge = () => {
    temporaryCharge.value?.push({ district: [0, 0], type: 0, price: 100 });
};
// 删除某时段收费标准
const deleteCharge = (index: number) => {
    temporaryCharge.value?.splice(index, 1);
};
// 确定更新收费标准
const updateCharge = () => {
    if (!temporaryCharge.value || temporaryCharge.value.length < 1) {
        ElMessage.error('收费标准不能为空');
        return;
    }
    for (let i = 1; i < temporaryCharge.value.length; i++) {
        if (temporaryCharge.value[i].district[0] == temporaryCharge.value[i].district[1] || temporaryCharge.value[i].district[0] != temporaryCharge.value[i - 1].district[1]) {
            ElMessage.error(`第${i + 1}阶段收费标准时间区间未正确设置`);
            return;
        }
    }
    updateChargeRates([...temporaryCharge.value]);
    isShowDialog.value = false;
};
</script>
