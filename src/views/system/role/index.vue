<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="roleList" border>
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template v-slot="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" :type="scope.row.status === 0 ? 'success' : 'info'">{{ scope.row.status | stateFilter }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.roleId === 1"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.roleId === 1"
            @click="handleUpdateRoleMenu(scope.row)"
          >菜单权限</el-button>
          <el-button
            size="mini"
            :type="scope.row.status === 1 ? 'success' : 'info'"
            :disabled="scope.row.roleId === 1"
            @click="handleStatusChange(scope.row)"
          >{{ scope.row.status === 1 ? '启用' : '停用' }}</el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.roleId === 1"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            权限字符
          </span>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="状态">
          <template>
            <el-radio v-model="form.status" :label="0">正常</el-radio>
            <el-radio v-model="form.status" :label="1">停用</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="openUpdateRoleMenu" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpdateRoleMenu">确 定</el-button>
        <el-button @click="cancelUpdateRoleMenu">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  updateRoleMenu, updateRoleStatus
} from '@/api/role'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/menu'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Role',
  components: { Pagination },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:SS')
    },
    stateFilter(value) {
      if (value === 0) {
        return '正常'
      } else if (value === 1) {
        return '停用'
      }
      return '未知'
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openUpdateRoleMenu: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      menuIds: [],
      // 查询参数
      listQuery: {
        current: 1,
        size: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {

    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.listQuery).then(response => {
        this.roleList = response.data.records
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },

    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.data.menus
        return response
      })
    },

    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === 1 ? '启用' : '停用'
      MessageBox.confirm('确认要' + text + '"' + row.roleName + '"角色吗？').then(function() {
        row.status = row.status === 0 ? 1 : 0
        return updateRoleStatus(row.roleId, row.status)
      }).then(() => {
        Message.success(text + '成功')
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelUpdateRoleMenu() {
      this.openUpdateRoleMenu = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }

      this.menuExpand = false
      this.menuNodeAll = false
      this.deptExpand = true
      this.deptNodeAll = false
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        status: 0
      }
      this.resetForm('form')
    },

    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId
      getRole(roleId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改角色'
      })
    },

    handleUpdateRoleMenu(row) {
      this.reset()
      const roleId = row.roleId
      roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.data.menus
        this.menuIds = response.data.menuIds
        this.openUpdateRoleMenu = true
        this.title = '修改角色菜单权限'
        this.$nextTick(() => {
          this.menuIds.forEach((v) => {
            this.$nextTick(() => {
              this.$refs.menu.setChecked(v, true, false)
            })
          })
        })
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.roleId !== undefined) {
            updateRole(this.form).then(response => {
              Message.success('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRole(this.form).then(response => {
              Message.success('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },

    submitUpdateRoleMenu: function() {
      if (this.form.roleId !== undefined) {
        this.form.menuIds = this.getMenuAllCheckedKeys()
        updateRoleMenu(this.form).then(response => {
          Message.success('修改成功')
          this.open = false
          this.getList()
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleId = row.roleId
      MessageBox.confirm('是否确认删除角色编号为"' + roleId + '"的数据项？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleId)
      }).then(() => {
        this.getList()
        Message.success('删除成功')
      }).catch(() => {})
    }
  }
}
</script>
