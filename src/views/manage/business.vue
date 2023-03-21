<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.bizId" placeholder="bizId" clearable style="width: 180px;" class="filter-item"  />
      <el-select v-model="listQuery.type" placeholder="商家类型" clearable class="filter-item" style="width: 110px" @clear="listQuery.type=null">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-table-column label="BizID" prop="bizId" width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" prop="name" width="80px" />
      <el-table-column label="性别" prop="sex" width="50px" :formatter="formatSex" />
      <el-table-column label="手机号" prop="phone" width="120px" />
      <el-table-column label="商家类型" prop="type" min-width="70px" :formatter="formatType" />
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" clearable maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="卖家类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="1">个人</el-radio>
            <el-radio :label="2">商家</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBusiness, listBusiness, updateBusiness, deleteBusiness } from '@/api/business'
import { v4 as uuidv4 } from 'uuid'
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
        type: null,
        bizId: ''
      },
      typeOptions: [{ label: '未知', value: 0 }, { label: '个人卖家', value: 1 }, { label: '商家卖家', value: 2 }],
      temp: {
        id: null,
        bizId: '',
        name: '',
        sex: 0,
        phone: '',
        type: 0,
        createTime: '',
        updateTime: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
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
      } else if (cellValue === 2) {
        ret = '女'
      }
      return ret
    },
    formatType(row, column, cellValue) {
      let ret = '未知'
      if (cellValue === 1) {
        ret = '个人卖家'
      } else if (cellValue === 2) {
        ret = '商家卖家'
      }
      return ret
    },
    getList() {
      this.listLoading = true
      listBusiness(this.listQuery).then(response => {
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
          id: null,
          bizId: '',
          name: '',
          sex: 0,
          phone: '',
          type: 0,
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
          type: '',
          bizId: ''
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
          this.temp.updateTime = moment.now
          this.temp.bizId = uuidv4()
          addBusiness(this.temp).then(() => {
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
          updateBusiness(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      deleteBusiness(row.row.bizId).then(() => {
        this.getList()
      })
    }
  }
}
</script>
