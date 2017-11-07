<template>
  <div id="mine-index">
  	<div class="login" v-if="user==''">
   		<div class="click" @click="login">
   			<p>点击登录</p>
   		</div>
   	</div>
	  <scroll v-else>  
	  	<div>
		  	<div class="mine">
		   		<div class="msg">
		   			<img src="../../assets/img/msgBg.jpg">
		   			<div class="pic">
		   				<img src="../../assets/img/photo.png">
		   				<p>{{user}}</p>
		   			</div>
		   		</div>
		   		<ul class="mineList">
		   			<li class="collect">
		   				<h2>我的收藏</h2>
		   				<nav>
		   					<span v-for="item in mine_collect" @click="gotoAdress({path: '/collect',query:{title:item.title}})">{{item.title}}</span>
		   				</nav>
		   			</li>
		   			<li class="attention" @click="gotoAdress({path: '/interest'})">
		   				我的关注
		   				<span></span>
		   				<span>{{mine_interest.length}}</span>
		   				<span></span>
		   			</li>
		   			<li class="out" @click="logoff">退出登陆</li>
		   		</ul>	
		  	</div>
		  </div>
  	</scroll>
  	<m-footer></m-footer>
  </div>
</template>

<script type="text/javascript">
import MFooter from '@/components/homePage/m-footer'  
import scroll from '@/components/scroll'
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  components: {
    MFooter,
    scroll
  },
  created() {
    this.$store.commit('changeFlag',['me',true]);
  },
  computed: mapState({
    user: state => state.user,
    //是否已登陆
    mine_collect: state=> state.mine_collect,
    //我的收藏列表
    mine_interest: state => state.mine_interest,
    //我的关注列表
    prevPage: state => state.prevPage
    //上一次所在页面
  }),
  methods: {
  	login() {
  		this.$store.commit('login','来斟一杯');
			if(localStorage.collect) {
				this.$store.commit('passCollect',JSON.parse(localStorage.collect));
			}
			if(localStorage.interest) {
				this.$store.commit('passInterest',JSON.parse(localStorage.interest));
			}
			if(localStorage.likeList) {
				this.$store.commit('passLikelist',JSON.parse(localStorage.likeList));
			}
			//登录时，localStorage中存在什么数据就传给vuex
  		Toast({               
      //弹出提示框提示登录成功
        message: '登录成功',
        position: 'middle',
        duration: 666,
        className: 'collectHint'
      });
  		if(this.prevPage != '') {
  		//如果存在上一次所在页面，代表不是从me页面登录，在提示登陆成功后返回上一次所在页面
  			setTimeout(() => {
  				this.$router.go(-1);
  				if(this.prevPage == 'index') {
  					this.$store.commit('changeFlag',['me',false]);   
        		this.$store.commit('changeFlag',['index',true]);   
  				} else if(this.prevPage == 'all') {
						this.$store.commit('changeFlag',['me',false]);   
        		this.$store.commit('changeFlag',['all',true]);
  				}
  				this.$store.commit('prevPage','');
  				//然后清空上一次所在页面痕迹
  			},666)
  		}
  	},
  	logoff() {
  		this.$store.commit('login','');
  		this.$store.commit('emptyMine');
  		//退出时清空收藏列表
  	},
  	gotoAdress(path) {
  		this.$router.push(path);
  	}
  }
}

</script>

<style type="text/css">
#mine-index .wrapper {
	bottom: .99rem;
	background: #efeff5;
}
#mine-index .login {
	width: 6.4rem;
	height: 11.36rem;
	background: url("../../assets/img/loginBg.png") no-repeat;
	background-size: 6.4rem 10.37rem;
}	
#mine-index .login .click,
.mine .msg .pic {
	width: 2.2rem;
	height: .82rem;
	position: absolute;
	top: 1.87rem;
	left: 2.1rem;
	padding-top: 1.7rem;
}
#mine-index .login .click {
	background: url("../../assets/img/sprite.png") -4.48rem -4.16rem no-repeat;
	background-size: 10rem 15rem;
}
#mine-index .click p,
.msg .pic p {
	font-size: .28rem;
	line-height: .82rem;
	color: #fff;
	text-align: center;
}
.msg .pic p {
	font-weight: bold;
}
#mine-index .mine .msg {
	width: 6.4rem;
	height: 6.2rem;
}
.mine .msg img {
	width: 6.4rem;
	height: 6.2rem;
}
.mine .msg .pic {
	width: 1.2rem;
	height: 2.02rem;
	padding: .5rem .5rem 0;
}
.msg .pic img {
	width: 1.2rem;
	height: 1.2rem;
	border: .01rem solid #fff;
	border-radius: 50%;
}
.mine .mineList li {
	margin-top: .2rem;
	background: #fff;
}
.mineList .collect h2 {
	font-size: .26rem;
	line-height: .82rem;
	color: #333;
	padding-left: .4rem;
}
.mineList .collect nav {
	padding-left: .36rem;
	overflow: hidden;
}
.collect nav span {
	float: left;
	width: 1.13rem;
	height: .85rem;
	font-size: .22rem;
	line-height: 1;
	color: #6c6c6c;
	text-align: center;
	padding-top: 1.03rem;
	background: url("../../assets/img/sprite.png") no-repeat;
	background-size: 10rem 15rem;
}
.collect nav span:nth-of-type(1) {
	background-position: 0 -10rem;
}
.collect nav span:nth-of-type(2) {
	background-position: -1.13rem -10rem;
}
.collect nav span:nth-of-type(3) {
	background-position: -2.26rem -10rem;
}
.collect nav span:nth-of-type(4) {
	background-position: -3.39rem -10rem;
}
.collect nav span:nth-of-type(5) {
	background-position: -4.52rem -10rem;
}
.mineList .attention {
	height: 1rem;
	font-size: .26rem;
	color: #666;
	line-height: 1rem;
	padding-left: 1rem;
	position: relative;
}
.mineList .attention span {
	height: 1rem;
	position: absolute;
	top: 0;
}
.mineList .attention span:nth-of-type(1) {
	width: 1rem;
	left: 0;
	background: url("../../assets/img/sprite.png") -5.65rem -10rem no-repeat;
	background-size: 10rem 15rem;
}
.mineList .attention span:nth-of-type(2) {
	width: .63rem;
	right: .46rem;
	font-size: .24rem;
	line-height: 1rem;
	color: #6c6c6c;
	text-align: center;
}
.mineList .attention span:nth-of-type(3) {
	width: .46rem;
	right: 0;
	background: url("../../assets/img/sprite.png") -6.65rem -10rem no-repeat;
	background-size: 10rem 15rem;
}
.mineList .out {
	height: .8rem;
	font-size: .26rem;
	line-height: .8rem;
	text-align: center;
	color: #6c6c6c;
}
.collectHint {
  border-radius: .1rem;
  background: rgba(0,0,0,.6);
}
.collectHint .mint-toast-text {
  font-size: .26rem;
  line-height: .94rem;
  margin: 0 .3rem;
}
</style>