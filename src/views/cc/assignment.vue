<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="queryForm"
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="客户ID">
          <el-input
            v-model="listQuery.custId"
            placeholder="请输入客户ID"
            clearable
            style="width: 180px;"
            class="filter-item"
          />
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

      <el-button
        class="filter-item"
        type="success"
        size="mini"
        icon="el-icon-plus"
        style="position: relative;"
        @click="handleNewAssignment"
      >
        新的任务
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
      <el-table-column label="ClueID" prop="clueId" width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="CustID" prop="custId" width="280px">
        <template v-slot="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.custId }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="线索来源" prop="clueWay" width="80px">
        <template v-slot="scope">
          <span>{{ scope.row.clueWay | clueWayFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线索类型" prop="clueType" width="80px">
        <template v-slot="scope">
          <span>{{ scope.row.clueType | clueTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="username" width="120px" />
      <el-table-column label="处理状态" prop="isHandle" width="80px">
        <template v-slot="scope">
          <span>{{ scope.row.isHandle | isHandleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160px">
        <template v-slot="scope">
          <span>{{ scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" width="160px">
        <template v-slot="scope">
          <span>{{ scope.row.updateTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template v-slot="row">
          <el-button type="primary" size="mini" :disabled="row.row.isHandle" @click="handleCreate(row)">
            建单
          </el-button>
          <el-button size="mini" type="danger" :disabled="row.row.isHandle" @click="handleFail(row)">
            标记失败
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
        :model="temp"
        label-position="left"
        label-width="auto"
        size="medium"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="意向车源ID" prop="carId">
          <el-input v-model="temp.carId" />
        </el-form-item>
        <el-form-item v-show="failReasonVisible === false" label="看车时间" prop="lookTime">
          <el-input v-model="temp.lookTime" />
        </el-form-item>
        <el-form-item v-show="failReasonVisible" label="失败原因" prop="failReason">
          <el-input v-model="temp.failReason" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getAssignment, listClue } from '@/api/clue'
import { addOrder } from '@/api/order'
import { mapGetters } from 'vuex'

export default {
  name: 'Assignment',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:SS')
    },
    isHandleFilter(value) {
      return value ? '已处理' : '未处理'
    },
    clueWayFilter(value) {
      let ret = '未知'
      if (value === 1) {
        ret = '私聊'
      } else if (value === 2) {
        ret = '询底价'
      } else if (value === 3) {
        ret = 'uv'
      }
      return ret
    },
    clueTypeFilter(value) {
      let ret = '未知'
      if (value === 1) {
        ret = '自营'
      } else if (value === 2) {
        ret = '其他'
      }
      return ret
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
        username: this.$store.state.user.name
      },
      temp: {
        id: null,
        orderId: '',
        custId: '',
        username: '',
        carId: '',
        lookTime: '',
        state: '',
        failReason: '',
        remark: '',
        clueId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      failReasonVisible: false,
      textMap: {
        success: '建单成功',
        fail: '标记失败'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listClue(this.listQuery).then(response => {
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
          carId: '',
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
          custId: '',
          username: '',
          isHandle: null
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
          this.temp.orderId = uuidv4()
          addOrder(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.custId = row.row.custId
      this.temp.clueId = row.row.clueId
      this.temp.username = row.row.username
      this.dialogStatus = 'success'
      this.failReasonVisible = false
      this.temp.state = 1
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFail(row) {
      this.resetTemp()
      this.temp.custId = row.row.custId
      this.temp.clueId = row.row.clueId
      this.temp.username = row.row.username
      this.dialogStatus = 'fail'
      this.failReasonVisible = true
      this.temp.state = 2
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleNewAssignment() {
      getAssignment(this.$store.state.user.name).then(() => {
        this.getList()
      })
    }
  }
}
</script>
