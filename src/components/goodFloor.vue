<template>
    <!-- 列表框 -->
    <el-row class="cart-tbody" :class="{orderList:page==3}">
        <el-col v-if="page!=3" :span="11">
            <el-row class="cart-tbody_first">
                 <!-- 购物车或者訂單列表會出現checkbox -->
                <el-col :span="3" v-if="page==1"><input type="checkbox" v-model="good.isCheck" @click="check(good.name)"></el-col>
                <!-- 訂單消息頁沒有checkbox -->
                <el-col :span="3" v-else-if="page==2"></el-col>
                <el-col :span="5"><div><img :src="good.src"></div></el-col>
                <el-col :span="9"><div>{{good.grand}}{{good.category}}{{good.name}}</div></el-col>
                <el-col :span="7"><div>{{good.tag | prettyTag}}</div></el-col>
            </el-row>
        </el-col>

        <el-col v-else :span="16">
            <el-row class="cart-tbody_first">
                 <!-- 购物车或者訂單列表會出現checkbox -->
                <!-- 訂單消息頁沒有checkbox -->
                <el-col :span="3"></el-col>
                <el-col :span="5"><div><img :src="good.src"></div></el-col>
                <el-col :span="9"><div>{{good.grand}}{{good.category}}{{good.name}}</div></el-col>
                <el-col :span="7"><div>{{good.tag | prettyTag}}</div></el-col>
            </el-row>
        </el-col>


        <el-col v-show="page!=3" :span="3">
            <div class="cart-tbody_second">
                <p>{{good.size}}mm</p>
            </div>
        </el-col>
        <!-- page = 1 代表是在购物车 -->
        <el-col :span="3" v-if="page==1">
          <div class="cart-tbody_third">
            <el-input-number @change="changeNum" v-model="good.num" :min="1" :max="99" size="small"></el-input-number>
          </div>
        </el-col>
        <!-- page = 2 代表是訂單 -->
        <el-col :span="3" v-else-if="page==2">
            <div class="cart-tbody_third">
                <p>{{good.num}}</p>
            </div>
        </el-col>

        <!-- page = 3代表是在訂單列表 -->
        <el-col :span="4" v-else>
            <div class="cart-tbody_third">
                <p>{{good.num}}</p>
            </div>
        </el-col>

        <!-- page = 1 或 2 代表是在购物车或者訂單 -->
        <el-col :span="2" v-if="page==1||page==2" class="colorRed"><div>{{good.price}}</div></el-col>
        <el-col :span="2" v-if="page==1||page==2" class="colorRed"><div>{{getSum(good)}}</div></el-col>
        <el-col :span="3" v-if="page==1||page==2">
          <div><button class="cart-remove" @click="delFloor(good.name)">删除</button></div>
        </el-col>

        <!-- page = 3代表是在訂單列表 -->
        <el-col :span="3" v-if="page==3" class="colorRed orderList"><div>{{getSum(good)}}</div></el-col>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
        //id代表商品编号
        // name代表商品名称
        // description代表描述
        // src代表商品图片的链接
        // price代表价钱
        // size代表规格
        // num代表数量
    }
  },
  props:{
      good:{
          type:Object,
      },
      // page代表頁面 1：购物车 2：訂單 3：訂單列表
      page:{
        type:Number
      }
  },
  computed:{
    
  },
  methods: {
      getStatus(status) {
        return this.status[status];
      },
      getSum(good){
        return good.price*good.num;
      },
      check(name){
        this.$emit('checkGood',name);
      },
      delFloor(name){
        this.$emit('delGood',name);
      },
      changeNum(val,oldVal){
        if (val>oldVal) {//增加
          this.$emit('changeGoodNum',this.good.price,this.good);
        }
        else{//减少
          this.$emit('changeGoodNum',-this.good.price,this.good);
        }
      }
  },
  filters:{
    prettyTag(val){
      return val.join(' ');
    }
  }
}
</script>

<style scoped>

  img{
    width: 100%;
  }
  button{
    cursor: pointer;
  }


  /*列表框*/
  .cart-tbody{
    border: 1px solid #e6eaeb;
    text-align: center;
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  .cart-tbody.orderList{
    width: 734px;
    border-top: none;
  }

  .cart-tbody_first{
    margin: 0 !important;
    padding: 20px 0;
    display: flex;
    align-items: center;
  }
  .cart-tbody_first .el-col:nth-of-type(2){
    border: 1px dotted #c2c2c2;
    padding: 4px;
  }
  .cart-tbody_first .el-col:nth-of-type(4){
    color: #aaa;
  }
  .cart-tbody_second > p,
  .cart-tbody_third > p{
    height: 30px;
    line-height: 30px;
    margin-bottom: 8px;
  }
  .cart-tbody_second > p:last-of-type,
  .cart-tbody_third > p:last-of-type{
    margin-bottom: 0;
  }

  .cart-tbody_third > .el-input-number{
    margin-bottom: 8px;
  }
  .cart-tbody_third > .el-input-number:last-of-type{
    margin-bottom: 0px;
  }

  .cart-tbody > .el-col:nth-of-type(4){
    color: #ff0000;
  }
 
  .colorGray{
    color: #aaa;
  }
  .colorRed{
    color: #ff0000;
  }
  .colorRed.orderList{
    margin-left:8px;
  }

  /*按钮*/
  .btn{
    border: none;
    color: #535353;
    padding: 4px 0;
    width: 70px;
    border-radius: 2px;
  }
  .btn-blue{
    background-color: #00b7ff;
    color: #fff;
  }
  .btn-gray{
    background-color: #e6eaeb;
    margin-top: 10px;
  }

  .el-row {
    margin-bottom: 20px;
  }

  .el-row.orderList{
    margin-bottom: 0px;
  }
  /*删除按钮*/
  .cart-remove{
    background-color: #e6eaeb;
    border: none;
    color: #535353;
    padding: 4px 20px;
    border-radius: 4px;
  }
</style>