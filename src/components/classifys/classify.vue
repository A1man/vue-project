<template>
	<div class="classify">
		<h1>
		  <span @click="back" class="backIcon"></span>
		  {{title}}
		  <span @click="changeMenu" class="icon" :class="{active: menuShow}"></span>
		</h1>
		<ul class="classifyType" ref="classifyType" @click="choseMenu">
			<li @click="getMsg({type:'0',title:'图文'})" :class="{active: title=='图文'}">图文</li>
			<li @click="getMsg({type:'3',title:'问答'})" :class="{active: title=='问答'}">问答</li>
			<li @click="getMsg({type:'1',title:'阅读'})" :class="{active: title=='阅读'}">阅读</li>
			<li @click="getMsg({type:'2',title:'连载'})" :class="{active: title=='连载'}">连载</li>
			<li @click="getMsg({type:'5',title:'影视'})" :class="{active: title=='影视'}">影视</li>
			<li @click="getMsg({type:'4',title:'音乐'})" :class="{active: title=='音乐'}">音乐</li>
		</ul>
		<ring-loader :loading="loading"></ring-loader>
  	<scroll :pullup="pullup" @scrollToEnd="loadMore" ref="classifyScroll">
  		<div>
				<div v-for="(item,index) in classify" class="classifyList" v-if="index <= contentIndex">
					<h3>
						<span>{{item.month | setDate('y 年 m 月')}}</span>
					</h3>
					<ul>
						<li v-for="text in item.list" @click="gotoAddress({path: '/detail',query:{type:type[text.ca],id:text.id}})">
							<img v-lazy="href + text.co">
							<p>{{text.t}}</p>
							<h4>{{text.su}}</h4>
						</li>
					</ul>
				</div>
				<div class="loadMore">{{pullTxt}}</div>
			</div>
		</scroll>	
	</div>
</template>

<script type="text/javascript">
import scroll from '@/components/scroll'
import {mapState} from 'vuex'
import setDate from '@/function/setDate.js'

export default {
	name: 'Classify',
	filters: {
    setDate
  },
	components: {
		scroll
	},
	data() {
		return {
			content_type: '',
			//分类详情页类型
			title: '',
			//分类详情页标题
			href: 'http://image.wufazhuce.com/',
			//拼接图片地址
			contentIndex: 10,
			//初始渲染内容的长度
			pullup: true,
			//允许底部上拉事件
      pullTxt: '↓ 松开立即加载更多',
      //底部上拉提示信息
      menuShow: false
      //头部目录是否打开
		}
	},
	mounted() {
		this.content_type = this.$route.query.type;
		this.title = this.$route.query.title;
		//路由query传递参数
		this.$store.commit('changeFlag',['loading',true]);
    //loading...
		this.$store.dispatch('getClassify',this.content_type).then(() => {
			setTimeout(() => {
        this.$store.commit('changeFlag',['loading',false]);
      },500)
		});
		//获取分类内容信息，loading状态消失
	},
	computed: mapState({
		classify: state => state.classify,
		//分类内容数据
		type: state => state.type,
		//one内容类型
		loading: state => state.flag.loading
    //loading状态是否存在
	}),
	methods: {
		getMsg(item) {
		//重新获取分类详情页内容	
			this.contentIndex = 10;
			//初始化渲染内容长度
			this.$store.commit('changeFlag',['loading',true]);
	    //loading...
	    this.$router.push({path: '/classify',query:{type:item.type,title:item.title}});
	    this.content_type = this.$route.query.type;
			this.title = this.$route.query.title;
			//路由跳转，传参
			this.$store.dispatch('getClassify',this.content_type).then(() => {
				setTimeout(() => {
					this.$refs.classifyScroll.refresh();
	        this.$store.commit('changeFlag',['loading',false]);
	      },500)
			});
			//重新获取分类内容信息，初始化分类页scroll，loading状态消失
		},
    loadMore() {
    //底部上拉加载更多
    	if(this.contentIndex == this.classify.length-1) {
    	//如果已经加载了全部数据就return	
        this.pullTxt = '已经全部加载完毕';
        return;
      } else {
        this.pullTxt = "正在加载更多数据...";
      }
      this.contentIndex++;
      //每次上拉多加载一个数据
		  setTimeout(() => {
		  	this.$refs.classifyScroll.refresh();
		  	//初始化分类页scroll
		  	if(this.contentIndex == this.classify.length-1) {
	        this.pullTxt = '已经全部加载完毕';
	      } else {
	        this.pullTxt = "↓ 松开立即加载更多";
	      }
		  },200)
    },
    changeMenu() {
    //打开或关闭头部目录	
    	if(this.menuShow) {
    		this.$refs.classifyType.style.transition = '';
    		this.$refs.classifyType.style.height = '0';    		
    	} else {
    		this.$refs.classifyType.style.transition = '.3s';
    		this.$refs.classifyType.style.height = '10.46rem';   		
    	}
    	this.menuShow = !this.menuShow;
    },
    choseMenu() {
    //关闭头部目录	
    	this.menuShow = false;
    	this.$refs.classifyType.style.transition = '';
    	this.$refs.classifyType.style.height = '0';
    },
    back() {
    //回到all首页	
			this.$router.push({path: '/all'});
		},
    gotoAddress(path) {
    	this.$store.commit('prevPage','all');
      //记录是从all页面进入的详情页
      this.$router.push(path);
    }
  }
}	

</script>

<style type="text/css">
.classify {
	background: #fff;
}	
.classify .wrapper {
  top: .9rem;
  background: #fff;
}		
.classify .v-spinner {
	top: .9rem;
}
.classify .v-spinner .v-ring0 {
	top: 3.8rem !important;
}
.classify .v-spinner .text {
	top: 5.3rem;
}
.classify h1{
	width: 100%;
	height: .89rem;
	position: fixed;
	top: 0;
	left: 0;
	border-bottom: .01rem solid #b0b0b0;
	background: #fff;
	font-size: .3rem;
	line-height: .89rem;
	color: #333;
	text-align: center;
}
.classify h1 .backIcon {
	position: absolute;
	top: 0;
	left: 0;
	width: 1rem;
	height: .89rem;
	background: url("../../assets/img/sprite.png") 0 -13.78rem no-repeat;
	background-size: 10rem 15rem;
}
.classify h1 .icon {
	position: absolute;
	top: 0;
	left: 2.5rem;
	width: 1.3rem;
	height: .89rem;
	background: url("../../assets/img/sprite.png") -6.96rem 0 no-repeat;
	background-size: 10rem 15rem;
}
.classify h1 .icon.active {
	position: absolute;
	top: 0;
	left: 2.5rem;
	width: 1.3rem;
	height: .89rem;
	background: url("../../assets/img/sprite.png") -8.26rem 0 no-repeat;
	background-size: 10rem 15rem;
}
.classify .classifyList {
	padding-top: .6rem;
	background: #fff;
	position: relative;
}
.classify .classifyList h3 {
	width: 100%;
	height: .02rem;
	background: #eee;
	position: absolute;
	top: .29rem;
	left: 0;
}
.classifyList h3 span {
	width: 1.88rem;
	height: .26rem;
	font-size: .26rem;
	line-height: 1;
	color: #a6a6a6;
	text-align: center;
	background: #fff;
	position: absolute;
	top: -.12rem;
	left: 2.28rem;
}
.classify .classifyList li {
	border-bottom: .02rem solid #eee;
	position: relative;
	padding: .26rem 0 .06rem 1.49rem;
}
.classifyList ul li:last-of-type {
	border-bottom: none;
}
.classify li img {
	width: .8rem;
	height: .8rem;
	position: absolute;
	top: .2rem;
	left: .4rem;
}
.classify li p {
	width: 4.4rem;
	height: .3rem;
	font-size: .3rem;
	line-height: 1;
	color: #333;
	overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.classify li h4 {
	width: 4.1rem;
	height: .58rem;
	font-size: .22rem;
	line-height: .58rem;
	color: #a6a6a6;
	overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.classify .loadMore {
  width: 100%;
  height: .26rem;
  font-size: .26rem;
  line-height: 1;
  font-weight: bold;
  color: #5a5a5a;
  text-align: center;
  background: rgba(0,0,0,0);
  position: absolute;
  left: 0;
  bottom: -1rem;
}
.classify .classifyType {
	position: absolute;
	top: .9rem;
	left: 0;
	width: 100%;
	height: 0;
	z-index: 1200;
	background: rgba(0,0,0,.3);
	overflow: hidden;
}
.classify .classifyType li {
	height: 1.1rem;
	background: #fff;
	border-bottom: .02rem solid #f3f3f3;
	font-size: .28rem;
	line-height: 1.1rem;
	color: #808080;
	text-align: center;
}
.classify .classifyType li.active {
	color: #333;
}
</style>