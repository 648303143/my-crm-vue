<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="queryForm"
        :model="queryParams"
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
      >新增
      </el-button>
    </div>

    <el-table v-loading="loading" :data="userList" fit border highlight-current-row style="width: 100%;">
      <el-table-column label="用户编号" align="center" prop="id" width="60px" />
      <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true" width="250" />
      <el-table-column label="手机号码" align="center" prop="phonenumber" width="210" />
      <el-table-column label="角色名称" align="center" prop="roleName" width="210">
        <template v-slot="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="success">{{ scope.row.roleName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template v-slot="scope">
          <span>{{ scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="260"
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.username === 1"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.username === 1"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" clearable show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="角色">
            <el-select v-model="form.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
                :disabled="item.status === 1"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser
} from '@/api/user'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'User',
  components: { Pagination },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        username: '',
        phonenumber: ''
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams).then(response => {
        this.userList = response.data.records
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        username: undefined,
        password: undefined,
        phonenumber: undefined,
        roleId: 0
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      getUser().then(response => {
        this.roleOptions = response.data.roles
        this.open = true
        this.title = '添加用户'
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const username = row.username
      getUser(username).then(response => {
        this.form = response.data.user
        this.roleOptions = response.data.roles
        this.title = '修改用户'
        this.open = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateUser(this.form).then(response => {
              Message.success('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then(response => {
              Message.success('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const username = row.username
      MessageBox.confirm('是否确认删除用户名称为"' + username + '"的数据项？').then(function() {
        return delUser(username)
      }).then(() => {
        this.getList()
        Message.success('删除成功')
      }).catch(() => {
      })
    }
  }
}
</script>
