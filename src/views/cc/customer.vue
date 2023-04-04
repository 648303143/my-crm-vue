<template>

  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="客户查询">
          <el-input v-model="temp.custId" style="width: 400px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleQuery">
            查询
          </el-button>
        </el-form-item>
      </el-form>

    </div>
    <el-main>
      <el-form
        v-show="dialogFormVisible"
        ref="form"
        :model="temp"
        size="small"
      >
        <el-form-item label="客户ID" prop="custId">
          <el-input v-model="temp.custId" style="width: 500px" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" style="width: 500px" disabled />
        </el-form-item>
        <el-form-item label="客户称呼" prop="custCall">
          <el-input v-model="temp.custCall" style="width: 500px" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" style="width: 500px" />
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="temp.city" style="width: 500px" />
        </el-form-item>
        <el-form-item label="预算" prop="budget">
          <el-input v-model="temp.budget" style="width: 500px" />
        </el-form-item>
        <el-form-item label="车型" prop="carType" style="width: 250px">
          <el-select v-model="temp.carType" clearable filterable style="width: 150px">
            <el-option
              v-for="carType in carTypeOptions"
              :key="carType.value"
              :label="carType.label"
              :value="carType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要分期" prop="isLoad">
          <el-radio v-model="temp.isLoad" :label="true">是</el-radio>
          <el-radio v-model="temp.isLoad" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="意向等级" prop="intention">
          <el-radio v-model="temp.intention" :label="1">低</el-radio>
          <el-radio v-model="temp.intention" :label="2">中</el-radio>
          <el-radio v-model="temp.intention" :label="3">高</el-radio>
          <el-radio v-model="temp.intention" :label="4">无意向</el-radio>
        </el-form-item>
        <el-button type="primary" @click="onSubmit">
          保存
        </el-button>

      </el-form>

    </el-main>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getCustomerById, updateCustomer } from '@/api/customer'

export default {
  name: 'CustomerQuery',
  directives: { waves },
  filters: {},
  data() {
    return {
      temp: {
        id: null,
        custId: '',
        phone: '',
        city: '',
        age: '',
        custCall: '',
        carType: '',
        budget: '',
        isLoad: null,
        intention: ''
      },
      dialogFormVisible: false,
      carTypeOptions: [{ label: '轿车', value: 1 }, { label: 'SUV', value: 2 }, { label: 'MPV', value: 3 }, {
        label: '跑车',
        value: 4
      }, { label: '面包车', value: 5 }, { label: '皮卡', value: 6 }]
    }
  },
  methods: {
    handleQuery() {
      getCustomerById(this.temp.custId).then(response => {
        Object.assign(this.temp, response.data)
        this.temp.phone = this.temp.phone.substring(0, 3) + '****' + this.temp.phone.substring(this.temp.phone.length - 4, this.temp.phone.length)
        this.dialogFormVisible = true
      })
    },
    onSubmit() {
      updateCustomer(this.temp).then(response => {
        if (response.code === 20000) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }

  }
}
</script>
