<template>
  <main>
    <div class="nav">
      <div class="nav-head">
        <div class="nav-head_img">
          <el-tooltip effect="dark" placement="left">
            <div slot="content">点击更换您的头像<br/>(分辨率需为64x64)</div>
            <el-upload
              name="avatar"
              class="avatar-uploader"
              :action="uploadForm.url"
              :headers="uploadForm.auth"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">          
              <img v-if="userInfo.headPicUrl" :src="userInfo.headPicUrl" class="avatar">
            </el-upload>
          </el-tooltip>
        </div>
        <div class="nav-head_msg">
          <p class="name">{{userInfo.nickName}}</p>
          <p class="vip">
            <span v-if="userInfo.level==1">普通用户</span>
            <span v-else-if="userInfo.level==2">超级会员</span>
            <i class="iconfont icon-huiyuan1"></i>
            </p>
        </div>
      </div>
      <ul>
        <li :class="{active:activeNum==1}" @click="activeTab(1)"><a><i class="iconfont icon-zhanghao"></i>账号设置</a></li>
        <li :class="{active:activeNum==2}" @click="activeTab(2)"><a><i class="iconfont icon-yanjing"></i>会员权限</a></li>
        <li :class="{active:activeNum==3}" @click="activeTab(3)"><a><i class="iconfont icon-shengji"></i>会员升级</a></li>
      </ul>
    </div>
    <!-- 账号设置 -->
    <div class="view" v-if="activeNum==1">
      <div class="view-title">
        <p>账号设置</p>
      </div>
      <div class="view-content">
        <ul>
          <li><i class="iconfont icon-zhanghao"></i>昵称：<span>{{userInfo.nickName}}</span><a @click="changeNickName()">更改</a></li>
          <li>
            <i class="iconfont icon-huiyuan"></i>
            会员等级：
            <span v-if="userInfo.level==1">普通用户</span>
            <span v-else-if="userInfo.level==2">超级会员</span>
            <a @click="activeTab(3)">升级</a>
            <span class="levelTime" v-if="userInfo.level==2">你的超级会员还有{{userInfo.levelTime}}天到期</span>
          </li>
          <li><i class="iconfont icon-youxiang"></i>邮箱：<span v-if="userInfo.email">{{userInfo.email}}</span><span v-else>暂未绑定</span><a @click="changeEmail()">更改</a></li>
          <li><i class="iconfont icon-shouji"></i>手机：<span v-if="userInfo.phone">{{userInfo.phone}}</span><span v-else>暂未绑定</span><a @click="changePhone()">更改</a></li>         
          <li><i class="iconfont icon-mima"></i>密码：*********<a @click="changePassword()">修改</a></li>
          <li><i class="iconfont icon-dingwei"></i>收货地址<router-link to="/Address">管理</router-link></li>
          <li><i class="iconfont icon-lianjie"></i>分享给好友</li>
        </ul>
      </div>
    </div>
    <!-- 账号设置END -->
    <!-- 当前权限 -->
    <div class="view" v-else-if="activeNum==2">
      <div class="view-title">
        <p>会员权限</p>
      </div>
      <div class="view-content">
        <ul class="parallelogram">
          <li><p>购买的商品均包邮</p></li>
          <li><p>商品保修期为两年</p></li>
          <li><p>免费更换损坏部件</p></li>
          <li><p>购后免费上门安装</p></li>
          <li><p>专业师傅上门维修</p></li>
          <li><p>专属客服进行服务</p></li>
        </ul>
      </div>
    </div>
    <!-- 当前权限END -->

    <!-- 升级VIP会员 -->
    <div class="view" v-if="activeNum==3">
      <div class="view-title">
        <p>会员升级</p>
      </div>
      <div class="view-content" style="padding-left:0">
        <el-row type="flex" justify="space-around">
          <el-col :span="6" v-for="(prices,index) in vipPrices" :key="index" @click.native="selectVIP(index)">
            <el-card :class="{'select':selectVIPType==index}" :body-style="[{ 'padding':'4px 8px 16px 8px'},{'text-align':'center'}]">                    
              <div style="font-size:24px; padding: 4px; color:#2eb4e9">
                ¥{{prices.price}}
              </div>
              <div style="font-size:18px;padding: 2px; color:#aaaaaa">
                {{prices.time}}个月（{{prices.price/prices.time}}元/月）
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
              <h1 class="payOption">支付方式</h1>
              <div class="payOptionIcon">
                <div @click="payOption=0" :class="{'select':payOption==0}"><i class="iconfont icon-WePayLogo"></i></div>
                <div @click="payOption=1" :class="{'select':payOption==1}"><i class="iconfont icon-weixinzhifu"></i></div>              
              </div>             
          </el-col>      
        </el-row>
        <el-row type="flex">
          <el-col :span="24" class="checkOut">
            <div><h1>共计：</h1><span>{{vipPrices[selectVIPType].price}}</span><h1>元</h1></div>       
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button class="payButton" type="primary" @click="upgrade()">支付</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 升级VIP会员END -->

    <!-- 修改邮箱的模式窗 -->
    <el-dialog title="修改邮箱" :visible.sync="modifyEmailFormVisible" width="30%" top="15%" @close="cancelMoEmail('modifyEmailForm')">
      <el-form :model="modifyEmailForm" :rules="modifyRules" ref="modifyEmailForm" label-width="100px">
        <el-form-item label="密码" prop="oldPassword">
          <el-input type="password" v-model="modifyEmailForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新邮箱" prop="newEmail">
          <el-input type="email" v-model="modifyEmailForm.newEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verification">
            <el-input class="modifyVerification" v-model="modifyEmailForm.verification" auto-complete="off" placeholder="验证码"></el-input>
            <el-button class="modifyVerification" type="primary" :class="{'verify':modifyEmailVerification}" @click="getVerification('modifyEmailForm')"><span v-if="modifyEmailVerification">重发({{modifyEmailTiming}})</span><span v-else>获取验证码</span></el-button>
        </el-form-item>     
        <el-form-item>
          <el-button type="primary" @click="submitForm('modifyEmailForm')">提交</el-button>
          <el-button @click="modifyEmailFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <!-- 修改手机的模式窗 -->
    <el-dialog title="修改手机" :visible.sync="modifyPhoneFormVisible" width="30%" top="15%" @close="cancelMoPhone('modifyPhoneForm')">
      <el-form :model="modifyPhoneForm" :rules="modifyRules" ref="modifyPhoneForm" label-width="100px">
        <el-form-item label="密码" prop="oldPassword">
          <el-input type="password" v-model="modifyPhoneForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新手机" prop="newPhone">
          <el-input v-model="modifyPhoneForm.newPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verification">
            <el-input class="modifyVerification" v-model="modifyPhoneForm.verification" auto-complete="off" placeholder="验证码"></el-input>
            <el-button class="modifyVerification" type="primary" :class="{'verify':modifyPhoneVerification}" @click="getVerification('modifyPhoneForm')"><span v-if="modifyPhoneVerification">重发({{modifyEmailTiming}})</span><span v-else>获取验证码</span></el-button>
        </el-form-item>      
        <el-form-item>
          <el-button type="primary" @click="submitForm('modifyPhoneForm')">提交</el-button>
          <el-button @click="modifyPhoneFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改密码的模式窗 -->
    <el-dialog title="修改密码" :visible.sync="modifyPwdFormVisible" width="30%" top="15%" @close="cancelMoPassword('modifyPwdForm')">
      <el-form :model="modifyPwdForm" :rules="modifyRules" ref="modifyPwdForm" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="modifyPwdForm.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="modifyPwdForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="modifyPwdForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('modifyPwdForm')">提交</el-button>
          <el-button @click="modifyPwdFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </main>
</template>

<script>
import config from '../config/config';

export default {
  data() {
    var confirmPassword = (rule, value, callback) => {
      if (value !== this.modifyPwdForm.newPassword) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    var confirmVeriType = (rule, value, callback) => {
      if (value == "email" && !this.$store.state.userInfo.email) {
        callback(new Error("你还没有绑定邮箱，请选择手机接受验证码"));
      } else if (value == "phone" && !this.$store.state.userInfo.phone) {
        callback(new Error("你还没有绑定手机，请选择邮箱接受验证码"));
      } else {
        callback();
      }
    };
    return {
      value5: 100,
      activeNum: 1,
      modifyPwdFormVisible: false,
      modifyPwdForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      modifyEmailFormVisible: false,
      modifyEmailVerification: false,
      modifyEmailTiming: 60,
      modifyEmailForm: {
        oldPassword: "",
        newEmail: "",
        verification: ""
      },
      modifyPhoneFormVisible: false,
      modifyPhoneVerification: false,
      modifyPhoneTiming: 60,
      modifyPhoneForm: {
        oldPassword: "",
        newPhone: "",
        verification: ""
      },
      modifyRules: {
        oldPassword: [
          { required: true, message: "请输入您原来的密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入您新密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度在 6 到 18 个字符",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: confirmPassword, trigger: "blur" }
        ],
        verification: [
          {
            required: true,
            len: 6,
            message: "请输入6位数字的验证码",
            trigger: "blur"
          }
        ],
        newEmail: [
          { required: true, message: "请输入您的新邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        newPhone: [
          { required: true, message: "请输入您的新手机", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        veriType: [
          { required: true, message: "请选择验证码接收方式", trigger: "blur" },
          { validator: confirmVeriType, trigger: "change" }
        ]
      },
      vipPrices: [
        { price: 20, time: 1 },
        { price: 90, time: 6 },
        { price: 120, time: 12 }
      ],
      //0代表第一种vip方案
      selectVIPType: 0,
      payOption: 0,
      //上传头像的表单
      uploadForm: {
        auth: { Authorization: this.$store.getters.token },
        url: config.baseURL+"api/user/headPic/"
      }
    };
  },
  methods: {
    activeTab(activeNum) {
      this.activeNum = activeNum;
    },
    changeNickName() {
      this.$prompt("请输入新昵称", "修改昵称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}$/,
        inputErrorMessage: "昵称为2到10个中英文字符组成"
      })
        .then(({ value }) => {
          return this.$ajax.post("/api/user/info", {
            nickName: value
          });
        })
        .then(response => {
          if (response.data.success) {
            this.$notify.success({
              title: "成功",
              message: response.data.message,
              offset: 100
            });
            this.$store.commit('setUserInfo',response.data.user);
          } else {
            this.$notify.error({
              title: "失败",
              message: response.data.message,
              offset: 100
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeEmail() {
      this.modifyEmailFormVisible = true;
    },
    changePhone() {
      this.modifyPhoneFormVisible = true;
    },
    changePassword() {
      this.modifyPwdFormVisible = true;
    },
    cancelMoPassword(formName) {
      this.modifyPwdFormVisible = false;
      this.$refs[formName].resetFields();
    },
    cancelMoEmail(formName) {
      this.modifyEmailFormVisible = false;
      this.$refs[formName].resetFields();
    },
    cancelMoPhone(formName) {
      this.modifyPhoneFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 获取验证码
    getVerification(verifiForm) {
      if (verifiForm == "modifyEmailForm") {
        //若已经点击过发送，则不触发后面的事件
        if (this.modifyEmailVerification == true) {
          return;
        }
        //先验证newEmail再发送验证码
        this.$refs[verifiForm].validateField("newEmail", err => {
          if (!err) {
            this.modifyEmailVerification = true;
            let intervalId = setInterval(() => {
              if (this.modifyEmailTiming == 0) {
                clearInterval(intervalId);
                this.modifyEmailVerification = false;
                this.modifyEmailTiming = 60;
              } else {
                this.modifyEmailTiming--;
              }
            }, 1000);

            let getVeriParams = {
              type: "email",
              ajax: this.$ajax,
              userId: this.modifyEmailForm.newEmail
            };
            this.$store.commit("getVeriCode", getVeriParams);
          }
        });
      } else if (verifiForm == "modifyPhoneForm") {
        //若已经点击过发送，则不触发后面的事件
        if (this.modifyPhoneVerification == true) {
          return;
        }
        //先验证newPhone再发送验证码
        this.$refs[verifiForm].validateField("newPhone", err => {
          if (!err) {
            this.modifyPhoneVerification = true;
            let intervalId = setInterval(() => {
              if (this.modifyPhoneTiming == 0) {
                clearInterval(intervalId);
                this.modifyPhoneVerification = false;
                this.modifyPhoneTiming = 60;
              } else {
                this.modifyPhoneTiming--;
              }
            }, 1000);
            let getVeriParams = {
              type: "phone",
              ajax: this.$ajax,
              userId: this.modifyPhoneForm.newPhone
            };
            this.$store.commit("getVeriCode", getVeriParams);
          }
        });
      }
    },
    selectVIP(index) {
      this.selectVIPType = index;
    },
    upgrade() {
      let days = this.vipPrices[this.selectVIPType].time * 30;
      this.$ajax
        .post("/api/user/upgrade", {
          upgradeDays: days,
          payOption: this.payOption
        })
        .then(response => {
          if (response.data.success) {
            // 重定向到支付宝支付接口
            window.location = response.data.url;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "modifyEmailForm") {
            this.$ajax
              .post("/api/user/info", {
                oldPassword: this.modifyEmailForm.oldPassword,
                email: this.modifyEmailForm.newEmail,
                verification: this.modifyEmailForm.verification
              })
              .then(response => {
                console.log(response);
                if (response.data.success) {
                  this.cancelMoEmail("modifyEmailForm");
                  this.$notify.success({
                    title: "成功",
                    message: response.data.message,
                    offset: 100
                  });
                  this.$store.commit('setUserInfo',response.data.user);
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: response.data.message,
                    offset: 100
                  });
                }
              })
              .catch(err => console.log(err));
          } else if (formName == "modifyPhoneForm") {
            this.$ajax
              .post("/api/user/info", {
                oldPassword: this.modifyPhoneForm.oldPassword,
                phone: this.modifyPhoneForm.newPhone,
                verification: this.modifyPhoneForm.verification
              })
              .then(response => {
                console.log(response);
                if (response.data.success) {
                  this.cancelMoPhone("modifyPhoneForm");
                  this.$notify.success({
                    title: "成功",
                    message: response.data.message,
                    offset: 100
                  });
                  this.$store.commit('setUserInfo',response.data.user);
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: response.data.message,
                    offset: 100
                  });
                }
              })
              .catch(err => console.log(err));
          } else if (formName == "modifyPwdForm") {
            this.$ajax
              .post("/api/user/info", {
                oldPassword: this.modifyPwdForm.oldPassword,
                password: this.modifyPwdForm.newPassword
              })
              .then(response => {
                console.log(response);
                if (response.data.success) {
                  this.cancelMoPassword("modifyPwdForm");
                  this.$notify.success({
                    title: "成功",
                    message: response.data.message,
                    offset: 100
                  });
                  this.$store.commit('setUserInfo',response.data.user);
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: response.data.message,
                    offset: 100
                  });
                }
              })
              .catch(err => console.log(err));
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAvatarSuccess(response, file) {
      console.log(response);
      if (response.success) {
        this.headPicUrl = response.headPicUrl;
        this.$notify.success({
          title: "成功",
          message: response.message,
          offset: 100
        });
        this.$store.commit('setUserInfo',response.user);
      } else {
        this.$notify.error({
          title: "失败",
          message: response.message,
          offset: 100
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10K = file.size / 1024 < 12;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt10K) {
        this.$message.error("上传头像图片大小不能超过 12KB!");
      }
      return isJPG && isLt10K;
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  }
};
</script>
<style>
body {
  background-color: #f4f8fb !important;
}
</style>
<style scoped>
body {
  background-color: #f4f8fb !important;
}
main {
  width: 1040px;
  margin: 27px auto 58px auto;
  color: #555;
  font-size: 14px;
}
main:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
img {
  width: 100%;
}
button {
  cursor: pointer;
}
a {
  text-decoration: none;
}

.iconfont {
  margin-right: 10px;
  color: #41b9ea;
}
/*左边灰色框*/
.nav {
  width: 240px;
  background-color: #ebf0f4;
  height: 600px;
  float: left;
}
/*左边灰色框头像及信息*/
.nav-head {
  border-bottom: 1px solid #fff;
  margin: 0 20px;
  padding: 30px 0 15px;
}
.nav-head:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.nav-head_img {
  float: left;
  width: 69px;
  height: 69px;
  margin-left: 20px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fff;
}
.nav-head_msg {
  float: right;
  height: 69px;
  margin-left: 14px;
}
.nav-head_msg .name {
  margin-top: 14px;
}
.nav-head_msg .vip {
  margin-top: 6px;
  color: #f2a018;
}
.icon-huiyuan1 {
  font-size: 18px;
  color: #f2a018;
}
/*左边灰色框跳转按钮*/
.nav ul {
  margin: 15px 0;
}
.nav ul li {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 8px;
}
.nav ul li.active a {
  background-color: #fff;
  color: #2eb4e9;
}
.nav ul li a {
  padding-left: 40px;
  display: block; /*给a标签设置成块级元素*/
  width: 100%;
  height: 100%;
}
.nav ul li .iconfont {
  font-size: 18px;
}
/* 上传头像按钮样式 */
.avatar-uploader {
  width: 69px;
  height: 69px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  float: left;
}

/* 头像相片样式 */
.avatar {
  width: 69px;
  height: 69px;
  display: block;
}

/*右边视图框*/
.view {
  position: relative;
  width: 800px;
  background-color: #fff;
  height: 586px;
  float: left;
  margin-top: 14px;
}
.view:before {
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  top: -14px;
  border-bottom: 14px solid #cfd4d8;
  border-right: 14px solid transparent;
}
/*视图框标题*/
.view-title {
  margin: 30px;
  border-bottom: 2px solid #ebf0f4;
}
.view-title p {
  width: 70px;
  font-size: 16px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  position: relative;
}
.view-title p:after {
  content: "";
  width: 70px;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: -2px;
  border-bottom: 2px solid #2eb4e9;
}
/*视图框内容*/
.view-content {
  margin: 40px 30px;
  padding-left: 50px;
}
.view-content ul li {
  margin-bottom: 30px;
}
.view-content ul li a {
  margin-left: 40px;
  color: #2eb4e9;
  cursor: pointer;
}
/*视图框banner*/
.view-banner {
  padding: 20px;
  padding-bottom: 0;
}
.view-banner img {
  width: 760;
  height: 260px;
}
/*视图框平行四边形权限*/
.parallelogram li {
  width: 180px;
  text-align: center;
  transform: skew(-30deg);
  padding: 30px 10px;
  margin-top:40px;
  margin-bottom: 40px !important;
  display: inline-block;
  color: #fff;
}
.parallelogram li p {
  transform: skew(30deg);
}
/* .parallelogram li:nth-of-type(odd) {
  margin-left: 20px;
}
.parallelogram li:nth-of-type(3n) {
  margin-left: 100px;
} */
.parallelogram li:nth-of-type(1) {
  background-color: #8fc320;
}
.parallelogram li:nth-of-type(2) {
  background-color: #6d9bcf;
}
.parallelogram li:nth-of-type(3) {
  background-color: #e65399;
}
.parallelogram li:nth-of-type(4) {
  background-color: #f39801;
}
.parallelogram li:nth-of-type(5) {
  background-color: #2eb4e9;
}
.parallelogram li:nth-of-type(6) {
  background-color: #8fc320;
}

.el-dialog {
  width: 30%;
}
.el-card {
  cursor: pointer;
}
.el-card:hover,
.el-card.select {
  box-shadow: none;
  border: 2px solid rgba(46, 180, 233, 0.8);
}
.payOption {
  font-size: 16px;
  color: #555;
  margin-top: 32px;
  margin-left: 30px;
}
.payOptionIcon div {
  position: relative;
  overflow: hidden;
  width: 170px;
  height: 66px;
  display: inline-block;
  border-radius: 3px;
  margin-left: 30px;
  margin-top: 20px;
}
.payOptionIcon div:hover,
.payOptionIcon div.select {
  box-shadow: none;
  border: 2px solid rgba(46, 180, 233, 0.8);
}
.payOptionIcon div:first-child i {
  position: absolute;
  top: -7px;
  left: -16px;
  font-size: 80px;
  color: #00a7ef;
  cursor: pointer;
}
.payOptionIcon div:last-child i {
  position: absolute;
  top: -50px;
  left: 6px;
  font-size: 160px;
  color: #14b83b;
  cursor: pointer;
}
.checkOut {
  font-size: 16px;
  color: #555;
  margin-top: 50px;
  margin-left: 30px;
}
.checkOut h1 {
  display: inline-block;
}
.checkOut div span {
  color: #2eb4e9;
  font-size: 24px;
  display: inline-block;
  padding: 0px 10px 0px 0px;
}
.payButton {
  width: 120px;
  margin-left: 30px;
  margin-top: 40px;
  background-color: #2eb4e9;
  border-color: #2eb4e9;
}
/* /验证码已发送后的样式 */
.verify {
  background-color: #c1c1c1 !important;
  cursor: not-allowed;
  border-color: #c1c1c1;
}

/* 修改邮箱模式窗口的验证码输入框的样式 */
.modifyVerification.el-input {
  width: 70%;
}
/* 修改邮箱模式窗口的验证码按钮的样式 */
.modifyVerification.el-button {
  width: 29%;
}
/*设定radio按钮的样式*/
.radioSize.el-radio-group {
  width: 100%;
}
.radioSize .el-radio {
  width: 48.8%;
}
/*会员过期时间*/
.levelTime {
  margin-left: 20px;
  color: rgb(170, 170, 170);
}
</style>