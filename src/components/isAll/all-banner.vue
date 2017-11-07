<template>
	<div class="all-banner">
		 <ul>
			<li v-for="(item,index) in banner" v-if="index < 5" class="subject" @click="gotoAddress({path: '/banner',query:{id:item.content_id,cover:item.cover}})">
				<div class="triangle"></div>
				<span class="triangleText">专题</span>
				<img :src="item.cover">
				<p>{{item.title}}</p>
			</li>
			<li class="hot">
				<h2>近期热门作者</h2>
				<div v-for="(item,index) in hotAuthor" class="hotAuthor" v-if="index<3" @click="gotoAddress({path: '/author',query:{author_id:item.user_id}})">
		      <img :src="item.web_url">
		      <p>{{item.user_name}}</p>
		      <p>{{item.summary}}</p>
		      <button @click.stop="changeAttention(item)" :class="{active: attention(item)}">{{item.text}}</button>
	    	</div>
	    	<button class="change" @click="getRandom">换一换</button>
			</li>
			<li class="question">
				<h2>所有人问所有人</h2>
				<scroll :scrollX="scrollX" :scrollY="false">
					<div class="box" :style="{ width: 4.22*len+.6+'rem'}">
						<div v-for="(item,index) in questionBanner" class="questionBanner" :style="{ left: 4.22*index+.4+'rem'}" @click="gotoAddress({path: '/banner',query:{id:item.content_id,cover:item.cover}})">
							<div class="triangle"></div>
							<span class="triangleText">专题</span>
							<img :src="item.cover">
							<p>{{item.title}}</p>
						</div>
					</div>
				</scroll>
			</li>
			<li v-for="(item,index) in banner" v-if="index >= 5" class="subject" @click="gotoAddress({path: '/banner',query:{id:item.content_id,cover:item.cover}})">
				<div class="triangle"></div>
				<span class="triangleText">专题</span>
				<img :src="item.cover">
				<p>{{item.title}}</p>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
import {mapState} from 'vuex'
import scroll from '@/components/scroll'

export default {
	components: {
		scroll
	},
	data() {
		return {
			scrollX: true
			//开启scroll组件的横向滚动
		}
	},
	computed: {
		...mapState({
			banner: state => state.banner,
			//专题数据
			hotAuthor: state => state.hotAuthor,
			//热门作者数据
			questionBanner: state => state.questionBanner,
			//问答专题数据
			len: state => state.questionBanner.length,
			interest: state => state.mine_interest,
	    //关注列表
	    user: state => state.user
	    //是否已登录
		}),
	},
 	methods: {
    getRandom() {
			this.hotAuthor.sort(function(){return Math.random()-0.5;});
    },
    //热门作者换一换
    gotoAddress(path) {
    	this.$store.commit('prevPage','all');
     	//记录是从all页面进入的专题页
    	this.$router.push(path);
    },
    attention(item) {
    //判断是否已关注此作者
      if(JSON.stringify(this.interest).indexOf(JSON.stringify({id:item.user_id,name:item.user_name,img:item.web_url,summary:item.summary})) != -1) {  
      //根据在interest中是否存在作者数据,判断是否已关注
      	item.text = '已关注';
        return true;
      } else {
      	item.text = '关注';
        return false;
      }
    },
    changeAttention(item) {     
    //关注处理
      if(this.user=='') {
      //此时未登录
      	this.$store.commit('prevPage','all');
        //记录在跳转到登录页面之前所在属于all页面
        this.$router.push({name: 'MineIndex'});
        //跳转到登录页面
        this.$store.commit('changeFlag',['me',true]);
        this.$store.commit('changeFlag',['all',false]);
        return;
      } else {
      //否则就说明此时已经登陆,继续操作
        if(JSON.stringify(this.interest).indexOf(JSON.stringify({id:item.user_id,name:item.user_name,img:item.web_url,summary:item.summary})) == -1) {     
          //如果未关注
          this.$store.commit('attention',{id:item.user_id,name:item.user_name,img:item.web_url,summary:item.summary});
          //将作者加入关注列表
        } else {                  
        //如果已关注
          this.$store.commit('cancelAttention',{id:item.user_id,name:item.user_name,img:item.web_url,summary:item.summary});    
          //将作者从关注列表移除
        }
      }
    }
  }      	
}

</script>

<style type="text/css">
.all-banner {
	margin-bottom: .73rem;
}
#all .all-banner .wrapper {
  top: 0;
}	
.all-banner .subject {
	margin-top: .2rem;
	background: #fff;
	padding: .4rem .4rem .61rem;
	position: relative;
}
.all-banner .questionBanner .triangle,
.all-banner .subject .triangle {
	width: 0;
  height: 0;
  border-top: 1rem solid rgba(0,0,0,.2);
  border-right: 1rem solid transparent;
  position: absolute;
  top: .4rem;
  left: .4rem;
}
.all-banner .questionBanner .triangleText,
.all-banner .subject .triangleText {
	font-size: .2rem;
	line-height: .64rem;
	display: block;
	width: .64rem;
	height: .64rem;
	position: absolute;
	top: .4rem;
	left: .4rem;
	color: #fff;
	transform: rotate(-45deg);
	text-align: center;
}
.all-banner .subject img {
	width: 5.6rem;
	height: 3.34rem;
	margin-bottom: .41rem;
}
.all-banner .subject p {
	font-size: .3rem;
	line-height: .48rem;
	color: #333;
}
.all-banner .hot {
	margin-top: .2rem;
	background: #fff;
	padding: 0 0 1.44rem;
	position: relative;
}
.all-banner .hot h2 {
	width: 6rem;
  height: .84rem;
  margin-left: .4rem;
  font-size: .26rem;
  line-height: .84rem;
}
.all-banner .hotAuthor {
	width: 5.6rem;
	height: .8rem;
  position: relative;
  padding: .3rem .4rem .3rem;
  background: #fff;
}
.all-banner .hotAuthor img {
  position: absolute;
  top: .3rem;
  left: .41rem;
  width: .8rem;
  height: .8rem;
  border-radius: 50%;
}
.all-banner .hotAuthor p {
  padding-left: 1.06rem;
  width: 3.3rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.all-banner .hotAuthor p:nth-of-type(1) {
  font-size: .28rem;
  line-height: .4rem;
  height: .4rem;
  color: #333;
}
.all-banner .hotAuthor p:nth-of-type(2) {
  font-size: .24rem;
  line-height: .44rem;
  height: .44rem;
  color: #808080;
}
.all-banner .hotAuthor button {
  position: absolute;
  top: .34rem;
  right: .4rem;
  width: .88rem;
  height: .6rem;
  border: .02rem solid #b3b3b3;
  border-radius: 0.05rem;
  font-size: .22rem;
  line-height: .56rem;
  color: #808080;
  background: #fff;
}
.all-banner .hotAuthor button.active {
  background: #d9d9d9;
  border: none;
  line-height: .6rem;
}
.all-banner .hot .change {
  position: absolute;
  bottom: .6rem;
  left: 2.38rem;
  width: 1.6rem;
  height: .6rem;
  border: .02rem solid #808080;
  border-radius: 0.05rem;
  font-size: .24rem;
  line-height: .6rem;
  color: #333;
  background: #fff;
}
.all-banner .question {
	height: 3.9rem;
	margin-top: .2rem;
	background: #fff;
	position: relative;
}
.all-banner .question .box {
	margin-top: .9rem;
	height: 2.4rem;
	position: relative;
}
.all-banner .question h2 {
	width: 6rem;
	height: .26rem;
	font-size: .26rem;
	line-height: 1;
	color: #333;
	position: absolute;
	top: .27rem;
	left: .4rem;
}
.all-banner .questionBanner {
	position: absolute;
	top: 0;
	width: 4.02rem;
	height: 2.4rem;
	border-radius: .05rem;
}
.all-banner .questionBanner .triangle,
.all-banner .questionBanner .triangleText {
	top: 0;
	left: 0;
}
.all-banner .questionBanner img {
	width: 4.02rem;
	height: 2.4rem;
	border-radius: .05rem;
}
.all-banner .questionBanner p {
	width: 3rem;
	height: .3rem;
	font-size: .3rem;
	line-height: 1;
	position: absolute;
	top: 1.05rem;
	left: 0;
	padding-left: .6rem;
	color: #fff;
	overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>