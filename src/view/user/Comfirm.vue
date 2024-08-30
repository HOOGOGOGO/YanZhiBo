<template>
  <div class="main-content">
    <div style="width: 70%; background-color: white; margin: 30px auto; border-radius: 8px">
      <div class="order-address">
        <div style=" padding-bottom: 10px;line-height: 25px;color: #333;font-weight: 700;font-size: 14px;border-bottom: 2px solid #e6e6e6;">
          确认收货地址
        </div>

        <div  style="margin-top: 25px;margin-left: 40px">
          <span class="el-icon-location" style="font-size: 12px;color: red">寄送至</span>
          <el-select class="addr-select" v-model="addressId" placeholder="请选择收货地址"  @change="addressSelect">
            <el-option v-for="item in addressData" :label="item.useraddress + ' (' +item.username+' 收) '+ item.phone"
                       :value="item.id"></el-option>
          </el-select>
          <el-button type="primary" plain @click="addressChange(addressId)" :disabled="buttonState">修改本地址
          </el-button>
        </div>
      </div>

      <div class="order-goods">
        <div style=" padding-bottom: 10px;line-height: 25px;color: #333;font-weight: 700;font-size: 14px">确认订单信息</div>
        <div class="table">
          <el-table :data="goodsData" strip>
            <el-table-column label="商品图片" width="120px">
              <template v-slot="scope">
                <el-image style="width: 80px; height: 60px; border-radius: 3px" v-if="scope.row.goodsImg"
                          :src="scope.row.goodsImg" :preview-src-list="[scope.row.goodsImg]"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" width="240px">
              <template v-slot="scope">
                <span
                    style="text-decoration: none;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.goodsName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="shopName" label="店铺名称">
              <template v-slot="scope">
                <span
                    style="text-decoration: none;overflow: hidden;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.shopName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
            <el-table-column prop="num" label="选择数量">
            </el-table-column>
            <el-table-column label="小计" align="center" width="180">
              <template v-slot="scope">
                ￥{{ scope.row.goodsPrice * scope.row.num }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div>
          <div class="price-addr">
            <span>实付款：</span>
            <span style="color: rgb(255, 0, 54);font: 700 26px tahoma;"> ￥{{ totalPrice }}</span><br>
            <span>寄送至：</span><span style="font-size:12px;font-weight:0;color: rgba(60,60,60,0.63)">{{ address }}</span><br>
            <span>收货人：</span>
            <span style="font-size:12px;font-weight:0;color: rgba(60,60,60,0.63)"> {{ person }}</span>
            <br>
          </div>
          <div class="button-order">
            <span class="el-icon-back" style="font-size: 12px;color: #36C;padding-right: 30px;cursor: pointer;" @click="$router.push('/user/cart')">返回购物车</span>
            <button class="button-submit" @click="pay">提交订单</button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="地址信息" :visible.sync="formVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form label-width="100px" style="padding-right: 50px" :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username" label="收货人">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="addrCodes" label="地址信息">
          <el-cascader :options="options" :props="addressParams" ref="cascaderAddr"
                       v-model="addrCodes" @change="handleAddress">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="addressRear" label="收货地址">
          <el-input v-model="form.addressRear" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pcas from "@/assets/pcas-code.json";
import person from "./Person.vue";
import router from "@/router";

export default {
  computed: {
    person() {
      return person
    }
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      goodsData: this.$route.params.orderGoods,
      totalPrice: this.$route.params.totalPrice,
      addressData: [],
      addressId: null,
      formVisible: false,
      address: '',
      person: '',
      form: {},
      buttonState: true,
      options: pcas,
      // 级联 地址选择的参数
      addressParams: {
        checkStrictly: false, //是否支持部分选中
        value: 'code', //传递的值
        label: 'name' //显示的名称
      },
      addressRear: '',//详细地址
      addrCodes: '',//地址编码
      addrLabels: '',//地址名称
      rules: {
        username: [
          {required: true, message: '请输入收货人', trigger: 'blur'},
        ],
        addressRear: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        // addrCodes: [
        //   {required: true,message: '请输入地址信息', trigger: 'blur'},
        // ],
        phone: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
        ],
      },
    }
  }, mounted() {
    this.loadAddress()
    if(!this.goodsData){
      return this.$router.push('/user/cart')
    }
  },
  methods: {
    loadAddress() {
      this.$request.get('/address/selectAll').then(res => {
        if (res.code === '200') {
          this.addressData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 更改选择的省市区
    handleAddress(thsAreaCode) {
      thsAreaCode = this.$refs['cascaderAddr'].getCheckedNodes()[0]
      this.addrCodes = thsAreaCode.path //显示对应地址的编码
      this.addrLabels = thsAreaCode.pathLabels //显示对应地址的名称
    },
    addressSelect() {
      this.buttonState = false
      this.$request.get('/address/selectById/' + this.addressId).then(res => {
        if (res.code === '200') {
          this.address = res.data.useraddress
          this.person = res.data.username + ' ' + res.data.phone
        } else {
          this.$message.error(res.message)
        }
      })
    },
    addressChange(addressId) { //修改地址弹出此地址详情页
      this.$request.get('/address/selectById/' + this.addressId).then(res => {
        if (res.code === '200') {
          this.form = res.data
          console.log(this.form)
          this.addrCodes = res.data.addressCode.split(',')
          this.form.useraddress = res.data.useraddress.slice(0, res.data.useraddress.length - res.data.addressRear.length)
        } else {
          this.$message.error(res.message)
        }
      })
      this.formVisible = true
    },
    update() {   // 更新地址

      if (!this.addrCodes) {
        return this.$message.warning('请输入地址信息')
      }
      // 写入完整地址
      if (this.addrLabels) {//判断是否有修改过省市区
        this.form.useraddress = ''
        for (let i = 0; i < this.addrLabels.length; i++) {
          this.form.useraddress += this.addrLabels[i]
        }
      }
      this.form.useraddress += this.form.addressRear //完整地址
      this.form.addressCode = this.addrCodes.toString() //转字符串

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request.put('/address/update/', this.form).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success('保存成功')
              this.formVisible = false
              this.loadAddress()
            } else {
              this.$message.error(res.message)  // 弹出错误的信息
            }
          })
        }
      })
    },

    pay() {
      if (!this.addressId) {
        this.$message.warning('请选择收货地址')
        return
      }
      if (!this.goodsData || this.goodsData.length === 0) {
        this.$message.warning('请选择商品')
        return
      }
      let data = {
        userId: this.user.id,
        addressId: this.addressId,
        status: '待发货',
        cartData: this.goodsData
      }
      this.$confirm('是否付款？','付款信息',{type:"success"}).then(res=>{
        this.$request.post('/orders/add', data).then(res => {
          if (res.code === '200') {
            this.$message.success('操作成功')
            this.$router.push('/user/cart')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(()=>{
      });
    }
  }

}
</script>

<style scoped>
.order-address {
  width: 95%;
  margin-left: 20px;
  padding-top: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e6e6e6;
}
.addr-select{
  width: 50%;
  margin-left: 50px;
  margin-right: 250px;

}

.order-goods{
  width: 95%;
  margin-left: 20px;
  padding-top: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e6e6e6;
}

.price-addr{
  //width: 420px;
  //border: 1px solid #ff0036;
  min-width: 230px;
  padding: 10px 5px 15px 30px;
  font-size: 13px;
  display: block;
  text-align: right;
  font-weight: 560;
}
.button-order{
    text-align: right;
  padding-right: 40px;

}
.button-submit{
  width: 182px;
  height: 39px;
  font-size: 15px;
  font-weight: 500;
  color: white;
  background-color: rgb(255, 80, 0);
  border: none;
  cursor: pointer;
}
</style>