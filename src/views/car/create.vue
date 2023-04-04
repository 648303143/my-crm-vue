<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="1200"
      size="small"
      inline
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" style="width: 500px" />
      </el-form-item>
      <el-form-item label="商家ID" prop="bizId">
        <el-input v-model="form.bizId" style="width: 400px" />
      </el-form-item>
      <el-form-item label="价格" prop="price" style="width: 250px">
        <el-input-number v-model="form.price" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item style="width: 200px">
        <el-switch
          v-model="form.isBargain"
          active-text="接受议价"
          inactive-text="不议价"
        />
      </el-form-item>
      <el-form-item label="品牌" prop="brand" style="width: 300px">
        <el-select
          v-model="form.brand"
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
      <el-form-item label="车系" prop="series" style="width: 300px">
        <el-select v-model="form.series" clearable filterable placeholder="请先选择品牌">
          <el-option
            v-for="series in seriesList"
            :key="series"
            :label="series"
            :value="series"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上牌时间" prop="licensingTime" style="width: 250px">
        <el-date-picker
          style="width: 150px"
          v-model="form.licensingTime"
          type="month"
          placeholder="选择上牌时间"
        />
      </el-form-item>
      <el-form-item label="牌照归属" prop="licensePlate" style="width: 250px">
        <el-input v-model="form.licensePlate" style="width: 150px"/>
      </el-form-item>
      <el-form-item label="排量" prop="engine" style="width: 250px">
        <el-input v-model="form.engine" style="width: 150px"/>
      </el-form-item>
      <el-form-item label="变速箱类型" prop="transmissionCase" style="width: 250px">
        <el-select v-model="form.transmissionCase" clearable filterable style="width: 150px">
          <el-option
            v-for="transmissionCase in transmissionCaseOptions"
            :key="transmissionCase.value"
            :label="transmissionCase.label"
            :value="transmissionCase.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="燃料类型" prop="fuelType" style="width: 250px">
        <el-select v-model="form.fuelType" clearable filterable style="width: 150px">
          <el-option
            v-for="fuelType in fuelTypeOptions"
            :key="fuelType.value"
            :label="fuelType.label"
            :value="fuelType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车型" prop="carType" style="width: 250px">
        <el-select v-model="form.carType" clearable filterable style="width: 150px">
          <el-option
            v-for="carType in carTypeOptions"
            :key="carType.value"
            :label="carType.label"
            :value="carType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公里数" prop="kilometer" style="width: 250px">
        <el-input-number v-model="form.kilometer" :precision="2" :step="0.1" style="width: 150px"/>
      </el-form-item>
      <el-form-item label="所在城市" prop="city" style="width: 250px">
        <el-input v-model="form.city" style="width: 150px"/>
      </el-form-item>
      <el-form-item label="颜色" prop="color" style="width: 1000px">
        <el-input v-model="form.color" style="width: 150px"/>
      </el-form-item>
      <el-form-item label="图片" style="width: 1000px">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/"
          :on-change="changeFile"
          :on-preview="handlePreview"
          multiple
          :limit="5"
          :file-list="fileList"
          :http-request="handleHttpRequest"
          :auto-upload="false"
          list-type="picture-card"
        >
          <el-button
            slot="trigger"
            size="mini"
            type="primary"
          >上传图片
          </el-button>
          <div
            slot="tip"
            class="el-upload__tip"
            style="float: bottom;color: #E6A23C"
          >
            只能上传.jpg/.jpeg/.gif/.png/.bmp文件，且不超过10Mb
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="其他信息" style="width: 1200px">
        <el-input
          v-model="form.info"
          type="textarea"
          :rows="2"
        >
        </el-input>
      </el-form-item>
      <el-button type="primary" size="mini" @click="onSubmit">
        提交
      </el-button>
      <el-button size="mini">取消</el-button>

    </el-form>
  </div>
</template>

<script>
import { addCar, getSeriesByBrand, listBrand } from '@/api/car'
import { v4 as uuidv4 } from 'uuid'

export default {
  data() {
    return {
      form: {
        id: '',
        carId: '',
        title: '',
        bizId: '',
        price: 0,
        isBargain: false,
        brand: '',
        licensingTime: '',
        engine: '',
        fuelType: '',
        series: '',
        carType: '',
        kilometer: 0,
        city: '',
        licensePlate: '',
        transmissionCase: '',
        color: '',
        info: ''
      },
      formData: new FormData(),
      fileList: [],
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
      transmissionCaseOptions: [{ label: '手动', value: 1 }, { label: '自动', value: 2 }],
      dialogVisible: false,
      dialogImageUrl: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        bizId: [
          { required: true, message: '请输入车商ID', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        isBargain: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        licensingTime: [
          { required: true, message: '请选择上牌年月', trigger: 'blur' }
        ],
        engine: [
          { required: true, message: '请输入排量(T)', trigger: 'blur' }
        ],
        fuelType: [
          { required: true, message: '请选择燃料类型', trigger: 'blur' }
        ],
        series: [
          { required: true, message: '请选择车系', trigger: 'blur' }
        ],
        carType: [
          { required: true, message: '请选择车型', trigger: 'blur' }
        ],
        kilometer: [
          { required: true, message: '请输入公里数', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入所在城市', trigger: 'blur' }
        ],
        licensePlate: [
          { required: true, message: '请输入牌照归属(例: 鲁F)', trigger: 'blur' }
        ],
        transmissionCase: [
          { required: true, message: '请选择变速箱类型', trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请输入颜色', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getAllBrand()
  },
  methods: {
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
      this.form.series = ''
      this.seriesList = []
    },
    changeFile(file, fileList) {
      const fileName = file.name
      const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
      if (regex.test(fileName.toLowerCase())) {
        this.fileList = fileList
      } else {
        this.fileList = this.fileList.slice(0, this.fileList.length - 1)
        this.$message.error('请选择图片文件')
      }
      console.log(`fileList:${this.fileList}`)
    },
    handleHttpRequest() {
      // 循环已选择文件列表 fileList，将文件取出放入 formData 的file数组中
      for (let i = 0; i < this.fileList.length; i++) {
        this.formData.append('file', this.fileList[i].raw)
      }
      console.log(`数据：${this.formData.get('file')}`)
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.carId = uuidv4()
          this.formData = new FormData()
          const obj = { ...this.form }
          Object.keys(obj).forEach(key => {
            console.log(key, obj[key])
            this.formData.append(key, obj[key])
          })

          this.$refs.upload.submit()

          addCar(this.formData).then(() => {
            // 成功上传后清除表单填写数据
            this.resetForm()
            this.fileList = []
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    resetForm() {
      this.form = {
        form: {
          id: '',
          carId: '',
          title: '',
          bizId: '',
          price: 0,
          isBargain: false,
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
          info: ''
        }
      }
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

