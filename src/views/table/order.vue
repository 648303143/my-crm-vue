<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.custId" placeholder="custId" clearable style="width: 180px;" class="filter-item"  />
      <el-input v-model="listQuery.userName" placeholder="用户名" clearable style="width: 180px;" class="filter-item"  />
      <el-input v-model="listQuery.name" placeholder="姓名" clearable style="width: 100px;" class="filter-item"  />
      <el-input v-model="listQuery.phone" placeholder="手机号" clearable style="width: 140px;" class="filter-item"  />
      <el-select v-model="listQuery.isSuccess" placeholder="是否建单成功" clearable style="width: 130px" class="filter-item" @clear="listQuery.isSuccess=null">
        <el-option v-for="item in isSuccessOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.intentionLevel" placeholder="意向等级" clearable class="filter-item" style="width: 110px" @clear="listQuery.intentionLevel=null">
        <el-option v-for="item in intentionLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
      <el-table-column label="用户名" min-width="150px" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="80px" />
      <el-table-column label="性别" prop="sex" width="50px" :formatter="formatSex" />
      <el-table-column label="手机号" prop="phone" width="120px" />
      <el-table-column label="城市" prop="city" align="center" width="80px" />
      <el-table-column label="预算" prop="budget" width="100" />
      <el-table-column label="是否建单成功" prop="isSuccess" min-width="70px" :formatter="formatBoolean" />
      <el-table-column label="失败原因" prop="failReason" min-width="150px" :show-overflow-tooltip="true" />
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
        <template v-slot="row,$index">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" maxlength="10" show-word-limit/>
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
        <el-form-item label="预算" prop="budget">
          <el-input v-model="temp.budget" />
        </el-form-item>
        <el-form-item label="是否建单成功" prop="isSuccess">
          <el-radio-group v-model="temp.isSuccess">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.isSuccess === false" label="失败原因" prop="failReason" type="textarea">
          <el-input v-model="temp.failReason" />
        </el-form-item>
        <el-form-item label="意向等级" prop="intentionLevel">
          <el-radio-group v-model="temp.intentionLevel">
            <el-radio :label="0">无意向</el-radio>
            <el-radio :label="1">低</el-radio>
            <el-radio :label="2">中</el-radio>
            <el-radio :label="3">高</el-radio>
          </el-radio-group>
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
import { addCustomer, listCustomer, updateCustomer } from '@/api/customer'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
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
        userName: '',
        name: '',
        phone: '',
        isSuccess: null,
        intentionLevel: null
      },
      isSuccessOptions: [{ label: '是', value: true }, { label: '否', value: false }],
      intentionLevelOptions: [{ label: '无意向', value: 0 }, { label: '低', value: 1 }, { label: '中', value: 2 }, { label: '高', value: 3 }],
      temp: {
        id: null,
        custId: '',
        userName: '',
        name: '',
        sex: '',
        phone: '',
        city: '',
        budget: '',
        isSuccess: null,
        failReason: '',
        intentionLevel: null,
        createTime: '',
        updateTime: ''
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
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { type: 'integer', message: '请输入正确的手机号', trigger: 'blur' }
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
          userName: '',
          name: '',
          sex: '',
          phone: '',
          city: '',
          budget: '',
          isSuccess: '',
          failReason: null,
          intentionLevel: null,
          createTime: '',
          updateTime: ''
        }
      }
    },
    resetQuery() {
      this.listQuery = {
        listQuery: {
          current: 1,
          size: 10,
          custId: '',
          userName: '',
          name: '',
          phone: '',
          isSuccess: undefined,
          intentionLevel: undefined
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
          this.temp.updateTime = new Date()
          addCustomer(this.temp).then(() => {
            this.dialogFormVisible = false
            location.reload()
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
          tempData.updateTime = new Date()
          if (tempData.isSuccess) {
            tempData.failReason = ''
          }
          updateCustomer(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>
