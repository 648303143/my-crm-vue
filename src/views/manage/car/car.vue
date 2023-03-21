<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form size="small" inline>
        <el-form-item label="车源ID" prop="carId" style="width: 1200px">
          <el-input v-model="listQuery.carId" style="width: 800px" />
        </el-form-item>
        <el-form-item label="标题" prop="title" style="width: 500px">
          <el-input v-model="listQuery.title" style="width: 300px" />
        </el-form-item>
        <el-form-item label="价格" prop="price" style="width: 500px">
          <el-input v-model="listQuery.minPrice" style="width: 80px"/>
          <span>    --    </span>
          <el-input v-model="listQuery.maxPrice" style="width: 80px"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" style="width: 250px">
          <el-select
            v-model="listQuery.brand"
            clearable
            filterable
            placeholder="请选择品牌"
            @clear="resetSeriesList"
            @change="getSeriesByBrand($event)"
          >
            <el-option
              v-for="brand in brandList"
              :key="brand"
              :label="brand"
              :value="brand"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车系" prop="series" style="width: 250px">
          <el-select v-model="listQuery.series" clearable filterable placeholder="请先选择品牌">
            <el-option
              v-for="series in seriesList"
              :key="series"
              :label="series"
              :value="series"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最早上牌时间" prop="licensingTime" style="width: 250px">
          <el-date-picker
            style="width: 150px"
            v-model="listQuery.licensingTime"
            type="month"
            placeholder="选择上牌时间"
          />
        </el-form-item>
        <el-form-item label="排量" prop="engine" style="width: 250px">
          <el-input v-model="listQuery.minEngine" style="width: 80px" />
          <span>    --    </span>
          <el-input v-model="listQuery.maxEngine" style="width: 80px" />
        </el-form-item>
        <el-form-item label="变速箱类型" prop="transmissionCase" style="width: 250px">
          <el-select v-model="listQuery.transmissionCase" clearable filterable style="width: 150px">
            <el-option
              v-for="transmissionCase in transmissionCaseOptions"
              :key="transmissionCase.value"
              :label="transmissionCase.label"
              :value="transmissionCase.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="燃料类型" prop="fuelType" style="width: 250px">
          <el-select v-model="listQuery.fuelType" clearable filterable style="width: 150px">
            <el-option
              v-for="fuelType in fuelTypeOptions"
              :key="fuelType.value"
              :label="fuelType.label"
              :value="fuelType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carType" style="width: 250px">
          <el-select v-model="listQuery.carType" clearable filterable style="width: 150px">
            <el-option
              v-for="carType in carTypeOptions"
              :key="carType.value"
              :label="carType.label"
              :value="carType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公里数" prop="kilometer" style="width: 250px">
          <el-input v-model="listQuery.minKilometer" style="width: 80px"/>
          <span>    --    </span>
          <el-input v-model="listQuery.maxKilometer" style="width: 80px"/>
        </el-form-item>
      </el-form>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
      <el-table-column label="CarID" prop="carId" width="80px" :show-overflow-tooltip="true" />
      <el-table-column label="标题" min-width="150px" >
        <template v-slot="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上牌时间" prop="licensingTime" width="80px" >
        <template v-slot="scope">
          <span>{{ scope.row.licensingTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公里数" prop="kilometer" min-width="70px" />
      <el-table-column label="价格" prop="price" width="60px" />
      <el-table-column label="排量" prop="engine" width="60px" />
      <el-table-column label="变速箱" prop="transmissionCase" min-width="70px" :formatter="formatTransmission" />
      <el-table-column label="车型" prop="carType" width="60" :formatter="formatCarType" />
      <el-table-column label="燃料类型" prop="fuelType" width="80px" :formatter="formatFuelType" />
      <el-table-column label="所在城市" prop="city" min-width="80px" />
      <el-table-column label="牌照" prop="licensePlate" min-width="60px" />
      <el-table-column label="颜色" prop="color" min-width="60px" />
      <el-table-column label="其他信息" prop="info" min-width="100px" :show-overflow-tooltip="true"/>
      <el-table-column label="能否议价" prop="isBargain" width="50px" :formatter="formatBoolean" />
      <el-table-column label="商家ID" prop="bizId" width="120px" :show-overflow-tooltip="true" />
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
      <el-table-column label="操作" align="center" width="110" fixed="right">
        <template v-slot="row">
          <el-button type="primary" size="mini" @click="handleLookPicture(row)">
            查看照片
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="demo-image__preview">
        <el-image
          v-for="url in srcList"
          :key="url"
          style="width: 100px; height: 100px"
          :src="url"
          :preview-src-list="srcList">
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCar, deleteCar, getPicturesByCarId, listBrand, getSeriesByBrand } from '@/api/car'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'CarManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:SS')
    },
    dateFilter(time) {
      return moment(time).format('YYYY年MM月')
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
        carId: '',
        title: '',
        minPrice: '',
        maxPrice: '',
        brand: '',
        series: '',
        minEngine: '',
        maxEngine: '',
        fuelType: '',
        carType: '',
        transmissionCase: '',
        minKilometer: '',
        maxKilometer: '',
        licensingTime: ''
      },
      temp: {
        id: null,
        carId: '',
        title: '',
        bizId: '',
        price: '',
        isBargain: '',
        brand: '',
        licensingTime: '',
        engine: '',
        fuelType: '',
        series: '',
        carType: '',
        kilometer: '',
        city: '',
        licensePlate: '',
        transmissionCase: '',
        color: '',
        picture: '',
        info: '',
        createTime: '',
        updateTime: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '照片'
      },
      srcList: [],
      brandList: [],
      seriesList: [],
      fuelTypeOptions: [{ label: '汽油', value: 1 }, { label: '柴油', value: 2 }, { label: '油电混动', value: 3 }, {
        label: '纯电',
        value: 4
      }],
      carTypeOptions: [{ label: '轿车', value: 1 }, { label: 'SUV', value: 2 }, { label: 'MPV', value: 3 }, {
        label: '跑车',
        value: 4
      }, { label: '面包车', value: 5 }, { label: '皮卡', value: 6 }],
      transmissionCaseOptions: [{ label: '手动', value: 1 }, { label: '自动', value: 2 }]
    }
  },
  created() {
    this.getList()
    this.getAllBrand()
  },
  methods: {
    formatFuelType(cellValue) {
      let ret = '未知'
      if (cellValue === 1) {
        ret = '汽油'
      } else if (cellValue === 2) {
        ret = '柴油'
      } else if (cellValue === 3) {
        ret = '油电混合'
      } else if (cellValue === 4) {
        ret = '纯电'
      }
      return ret
    },
    formatCarType(cellValue) {
      let ret = '未知'
      if (cellValue === 1) {
        ret = '轿车'
      } else if (cellValue === 2) {
        ret = 'SUV'
      } else if (cellValue === 3) {
        ret = 'MPV'
      } else if (cellValue === 4) {
        ret = '跑车'
      } else if (cellValue === 5) {
        ret = '面包车'
      } else if (cellValue === 6) {
        ret = '皮卡'
      }
      return ret
    },
    formatTransmission(row, column, cellValue) {
      let ret = '未知'
      if (cellValue === 1) {
        ret = '手动'
      } else if (cellValue === 2) {
        ret = '自动'
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
      listCar(this.listQuery).then(response => {
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
          carId: '',
          title: '',
          bizId: '',
          price: '',
          isBargain: '',
          brand: '',
          licensingTime: '',
          engine: '',
          fuelType: '',
          series: '',
          carType: '',
          kilometer: '',
          city: '',
          licensePlate: '',
          transmissionCase: '',
          color: '',
          picture: '',
          info: '',
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
          carId: '',
          title: '',
          price: '',
          brand: '',
          engine: '',
          fuelType: '',
          carType: '',
          transmissionCase: ''
        }
      }
    },
    handleReset() {
      this.resetQuery()
      this.getList()
    },
    handleLookPicture(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getPicturesByCarId(row.row.carId).then(response => {
        this.srcList = response.data
      })
    },
    handleDelete(row) {
      deleteCar(row.row.carId).then(() => {
        this.getList()
      })
    },
    getAllBrand() {
      listBrand()
        .then(response => {
          this.brandList = response.data
          console.log('res data ===>  ' + response.data)
          console.log('brandList ===>  ' + this.brandList)
        })
    },
    getSeriesByBrand(val) {
      if (val != null && val !== '' && val !== undefined) {
        getSeriesByBrand(val)
          .then(response => {
            this.seriesList = response.data
          })
      }
    },
    resetSeriesList() {
      this.listQuery.series = ''
      this.seriesList = []
    }
  }
}
</script>
