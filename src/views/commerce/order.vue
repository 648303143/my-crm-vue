<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="订单ID">
          <el-input
            v-model="listQuery.orderId"
            placeholder="orderId"
            clearable
            style="width: 180px;"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="客户ID">
          <el-input
            v-model="listQuery.custId"
            placeholder="custId"
            clearable
            style="width: 180px;"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="建单客服">
          <el-input
            v-model="listQuery.username"
            placeholder="建单客服"
            clearable
            style="width: 180px;"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="listQuery.state" placeholder="订单状态" clearable style="width: 100px;" class="filter-item" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" size="mini" icon="el-icon-refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>

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
      <el-table-column label="OrderID" prop="orderId" width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="CustID" prop="custId" width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="建单客服" min-width="100px" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="意向车源" prop="carTitle" width="200px" />
      <el-table-column label="看车时间" width="80px">
        <template v-slot="scope">
          <span>{{ scope.row.lookTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否贷款" prop="isLoad" width="60px" :formatter="formatBoolean" />
      <el-table-column label="建单状态" prop="state" align="center" width="80px" :formatter="formatState" />
      <el-table-column label="失败原因" prop="failReason" min-width="150px" :show-overflow-tooltip="true" />
      <el-table-column label="备注" prop="remark" width="150" />
      <el-table-column label="车源ID" prop="clueId" min-width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="线索ID" prop="clueId" min-width="80px" :show-overflow-tooltip="true" />
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="auto"
        size="medium"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="建单客服" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="车源ID" prop="carId">
          <el-input v-model="temp.carId" />
        </el-form-item>
        <el-form-item label="是否贷款" prop="isLoad">
          <el-radio-group v-model="temp.isLoad">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="看车时间" prop="lookTime">
          <el-input v-model="temp.lookTime" />
        </el-form-item>
        <el-form-item label="建单状态" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="1">建单成功</el-radio>
            <el-radio :label="2">建单失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.state === 2" label="失败原因" prop="failReason" type="textarea">
          <el-input v-model="temp.failReason" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" type="textarea">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteOrder, listOrder, updateOrder } from '@/api/order'
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
        orderId: '',
        custId: '',
        username: '',
        state: null
      },
      temp: {
        id: null,
        orderId: '',
        custId: '',
        username: '',
        carId: '',
        isLoad: '',
        lookTime: '',
        state: '',
        failReason: '',
        remark: '',
        clueId: ''

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatState(row, column, cellValue) {
      let ret = '未知'
      if (cellValue === 1) {
        ret = '建单成功'
      } else if (cellValue === 2) {
        ret = '建单失败'
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
    getList() {
      this.listLoading = true
      listOrder(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        temp: {
          id: null,
          orderId: '',
          custId: '',
          username: '',
          carId: '',
          isLoad: '',
          lookTime: '',
          state: '',
          failReason: '',
          remark: '',
          clueId: ''
        }
      }
    },
    resetQuery() {
      this.listQuery = {
        listQuery: {
          current: 1,
          size: 10,
          orderId: '',
          custId: '',
          username: '',
          state: null
        }
      }
    },
    handleReset() {
      this.resetQuery()
      this.getList()
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
          if (tempData.state === 1) {
            tempData.failReason = ''
          }
          updateOrder(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      deleteOrder(row.row.orderId).then(() => {
        this.getList()
      })
    }
  }
}
</script>
