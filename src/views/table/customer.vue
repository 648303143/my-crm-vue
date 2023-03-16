<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.custId" placeholder="custId" clearable style="width: 180px;" class="filter-item"  />
      <el-input v-model="listQuery.nickname" placeholder="昵称" clearable style="width: 180px;" class="filter-item"  />
      <el-input v-model="listQuery.name" placeholder="姓名" clearable style="width: 100px;" class="filter-item"  />
      <el-input v-model="listQuery.phone" placeholder="手机号" clearable style="width: 140px;" class="filter-item"  />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh-left" @click="handleReset">
        重置
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="60" />
      <el-table-column label="CustID" prop="custId" width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="昵称" min-width="150px" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" width="120px" />
      <el-table-column label="姓名" prop="name" width="80px" />
      <el-table-column label="性别" prop="sex" width="50px" :formatter="formatSex" />
      <el-table-column label="城市" prop="city" width="80px" />
      <el-table-column label="年龄" prop="age" width="80px" />
      <el-table-column label="客户称呼" prop="custCall" width="80px" />
      <el-table-column label="意向车型" prop="carType" width="80px" />
      <el-table-column label="预算" prop="budget" width="100" />
      <el-table-column label="意向等级" prop="intention" min-width="150px" :show-overflow-tooltip="true" />
      <el-table-column label="意向等级" prop="intentionLevel" min-width="80px" :formatter="formatIntentionLevel" />
      <el-table-column label="创建时间" prop="createTime" min-width="160px">
        <template v-slot="scope">
          <span>{{ scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" min-width="160px">
        <template v-slot="scope">
          <span>{{ scope.row.updateTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template v-slot="row">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="auto"
        size="medium"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" maxlength="10" show-word-limit/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" clearable maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="temp.city" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addCustomer, listCustomer, updateCustomer, deleteCustomer } from '@/api/customer'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'CustomerManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        custId: '',
        nickname: '',
        name: '',
        phone: ''
      },
      temp: {
        id: null,
        custId: '',
        nickname: '',
        name: '',
        sex: '',
        phone: '',
        city: '',
        age: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatSex(row, column, cellValue) {
      let ret = '未知'
      if (cellValue === 1) {
        ret = '男'
      } else if (cellValue === 0) {
        ret = '女'
      }
      return ret
    },
    formatBoolean(row, column, cellValue) {
      let ret = ''
      if (cellValue) {
        ret = '是'
      } else {
        ret = '否'
      }
      return ret
    },
    formatIntentionLevel(row, column, cellValue) {
      let ret = '未知'
      if (cellValue === 0) {
        ret = '无意向'
      } else if (cellValue === 1) {
        ret = '低'
      } else if (cellValue === 2) {
        ret = '中'
      } else if (cellValue === 3) {
        ret = '高'
      }
      return ret
    },
    getList() {
      this.listLoading = true
      listCustomer(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        temp: {
          id: undefined,
          custId: '',
          nickname: '',
          name: '',
          sex: '',
          phone: '',
          city: '',
          age: ''
        }
      }
    },
    resetQuery() {
      this.listQuery = {
        listQuery: {
          current: 1,
          size: 10,
          custId: '',
          nickname: '',
          name: '',
          phone: ''
        }
      }
    },
    handleReset() {
      this.resetQuery()
      this.getList()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.custId = uuidv4()
          addCustomer(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row.row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCustomer(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      deleteCustomer(row.row.custId).then(() => {
        this.getList()
      })
    }
  }
}
</script>
