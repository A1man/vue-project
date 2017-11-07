<template>
	<div class="banner-content">
		<div class="header">
			<span @click="back()"></span>
			<img :src="cover">
		</div>
		<div class="content" :style="{backgroundColor: bannerMsg.bg_color,color: bannerMsg.font_color}">
			<p v-if="content_list[0]">{{content_list[0].forward}}</p>
			<ul>
				<li v-for="(item,index) in content_list" v-if="index > 0 && item.content_type < 6" @click="gotoAddress({path: '/detail',query:{type:type[item.content_type],id:item.content_id}})">
					<div class="pic" v-if="item.content_type != 4 && item.img_url != ''">
	        	<img :src="item.img_url">
		      </div>
		      <div class="musicPic" v-else-if="item.img_url != ''">
		      	<audio id="bannerMedia" preload="auto" src="/static/audio/music.mp3">
		        Your browser does not support the audio element.
		        </audio>
		        <div class="musicCover">
		          <img :src="item.img_url">
		        </div>
		        <span class="play" @click.stop="playMusic" :class="{stop: !bannerMusicPlay}"></span>
		        <span class="icon"></span>
		      </div>
		      <div class="text">
		      	<p>{{item.forward}}</p>
		        <span v-if="item.content_type == 3">{{item.author.user_name}}</span>
      			<span v-else>文 / {{item.author.user_name}}</span>
      			<span @click.stop="changeLike(item)" :class="{active: like(item)}" v-if="item.content_type == 5">{{item.like_count+1862}}</span>
        		<span @click.stop="changeLike(item)" :class="{active: like(item)}" v-else>{{item.like_count}}</span>
		      </div>  
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">
import strSplit from '@/function/strSplit.js'
import {mapState} from 'vuex'

export default {
  filters: {
    strSplit
  },
  data() {
  	return {
  		cover: ''
  		//专题头部封面
  	}
  },
  mounted() {
  	this.cover = this.$route.query.cover;
  	//路由query传递参数
  	this.$store.dispatch('getOnelist','this.nowDate');
  },
  computed: {
  	...mapState({
	  	bannerMsg: state => state.bannerMsg,
	  	//专题详细信息
	  	content_list: state => state.onelist.content_list,
	  	type: state => state.type,
	  	//one内容类型
	  	nowDate: state => state.nowDate,
	    //数据所属时间
	    likeList: state => state.likeList,
	    //已点赞列表
	    bannerMusicPlay: state => state.flag.bannerMusicPlay
      //判断专题页面音乐播放状态
	  }),
	  bannerRotate: {
    //音乐CD旋转角度  
      get: function() {
        return this.$store.state.bannerRotate;
      },
      set: function(newValue) {
        this.$store.commit('setRotate',{rotate:0,bannerRotate:newValue});
      }
    }
  },
  methods: {
  	back() {
      this.closeMusic(),
      //关闭专题页面音乐播放
      this.$router.go(-1);
      //返回上一个记录的路由
    },
    like(item) {
    //判断点赞状态
      if(this.likeList.indexOf(item.content_id) != -1) {
        return true;
      } else {
        return false;
      }
    },
    changeLike(item) {
    //点赞处理
      if(this.likeList.indexOf(item.content_id) == -1) {
        this.$store.commit('like',item.content_id);
        item.like_count ++;
        //如果点赞列表中不存在本篇数据,就加入点赞列表
      } else {
        this.$store.commit('cancelLike',item.content_id);
        item.like_count --;
        //如果已经存在本篇数据,就从点赞列表中删除
      }
    },
    playMusic() {
    //专题页面音乐模块播放
      let media = document.querySelector('#bannerMedia');
      let cover = document.querySelector('.banner-content .musicCover');
      if(media.paused) {
      //如果处于暂停状态  
        media.play();
        this.$store.commit('changeFlag',['bannerMusicPlay',true]);
        //播放音乐,更改状态图标 
        this.$store.commit('clearTimer');
        //开启定时器之前先清除可能存在的定时器
        this.$store.commit('setTimer',setInterval(() => {
          this.bannerRotate += .5;
          cover.style.transform = "rotate(" + this.bannerRotate + "deg)";
          if (this.bannerRotate > 360) {
            this.bannerRotate = 0;
          }
        },50))
        //开启定时器,CD旋转,并上传定时器
      } else {
        //如果处于播放状态
        media.pause();   
        this.$store.commit('changeFlag',['bannerMusicPlay',false]); 
        this.$store.commit('clearTimer');
        //就暂停音乐,更改状态图标,并清除定时器
      }  
    },
    gotoAddress(path) {
      this.closeMusic(),
      //关闭专题页面音乐播放
      this.bannerMsg.bg_color = '';
      this.bannerMsg.font_color = '';
      this.$store.commit('prevPage','all');
      //记录是从all页面的专题页进入的详情页
      this.$router.push(path);
      //跳转页面
    },
    closeMusic() {
    //关闭音乐  
      let media = document.querySelector('#bannerMedia');
      let cover = document.querySelector('.banner-content .musicCover');
      if(media && cover) {
        media.load(); 
        //重新加载音频
        this.$store.commit('changeFlag',['bannerMusicPlay',false]);
        //音乐停止播放,更改图标
        this.bannerRotate = 0;
        cover.style.transform = "rotate(" + this.bannerRotate + "deg)";
        //CD旋转角度归零
        this.$store.commit('clearTimer');
        //清除定时器
      }
    }
  }
}

</script>

<style type="text/css">
.banner-content .header {
	width: 6.4rem;
	height: 3.82rem;
	position: relative;
}
.banner-content .header span {
	width: 1rem;
	height: 1rem;
	position: absolute;
	top: .3rem;
	left: 0;
	background: url("../../assets/img/sprite.png") -2.13rem -7.98rem no-repeat;
  background-size: 10rem 15rem;
}
.banner-content .header img {
	width: 6.4rem;
	height: 3.82rem;
}	
.banner-content .content {
	padding: .6rem .41rem;
}
.banner-content .content p {
	font-size: .32rem;
	line-height: .64rem;
	margin-bottom: .2rem;
}
.banner-content .content li {
	margin-top: .4rem;
	background: #fff;
	border-top: .01rem solid #d8d8d8;
	border-radius: .06rem;
}
.banner-content li img {
	width: 100%;
	height: 3.67rem;
	border-top-left-radius: .06rem;
	border-top-right-radius: .06rem;
	margin: 0;
}
.banner-content .content .text {
	padding: .4rem .41rem 1.2rem;
	position: relative;
}
.banner-content .text p {
	font-size: .26rem;
	line-height: .56rem;
	color: #666;
	padding: 0;
}
.banner-content .text span {
	position: absolute;
	bottom: 0;
	height: .88rem;
}
.banner-content .text span:nth-of-type(1) {
	left: .41rem;
	width: 3.5rem;
	font-size: .24rem;
	line-height: .88rem;
	color: #ababab;
}
.banner-content .text span:nth-of-type(2) {
	left: 4.5rem;
	width: .8rem;
	box-sizing: border-box;
	padding: .28rem 0 0 .32rem;
	font-size: .2rem;
  line-height: 1;
  color: #ababab;
  background: url("../../assets/img/sprite.png") 0 -.78rem no-repeat;
  background-size: 10rem 15rem;
}
.banner-content .text span:nth-of-type(2).active {
  background: url("../../assets/img/sprite.png") -4.48rem -7.94rem no-repeat;
  background-size: 10rem 15rem;
}
.banner-content .musicPic {
	width: 100%;
	height: 3.87rem;
  position: relative;
}
.banner-content .musicPic .musicCover {
  width: 3.67rem;
  height: 3.67rem;
  position: absolute;
  top: .2rem;
  left: .955rem;
  border-radius: 50%;
}
.banner-content .musicCover img {
  width: 3.67rem;
  height: 3.67rem;
  border-radius: 50%;
}
.banner-content .musicPic .play {
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: 1.62rem;
  left: 2.41rem;
  background: rgba(0,0,0,.7) url("../../assets/img/sprite.png") -3.13rem -1.64rem no-repeat;
  background-size: 10rem 15rem;
  z-index: 666;
  border-radius: 50%;
}
.banner-content .musicPic .play.stop {
  background-position: -2.13rem -1.64rem !important;
}
.banner-content .musicPic .icon {
  width: .4rem;
  height: .4rem;
  position: absolute;
  left: .41rem;
  bottom: 0;
  background: url("../../assets/img/sprite.png") 0 -9.25rem no-repeat;
  background-size: 10rem 15rem;
}
</style>