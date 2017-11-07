<template>
	<div class="m-content">
    <div v-for="(item,index) in contentList" v-if="index > 0 && item.share_list.wx && item.content_type < 6" class="text" @click="gotoAddress({path: '/detail',query:{type:type[item.content_type],id:item.content_id}})">
      <h2 v-if="item.tag_list[0]">- {{item.tag_list[0].title}} -</h2>
      <h2 v-else>- {{item.share_list.wx.title | strSplit(' | ',0)}} -</h2>
      <h3>{{item.title}}</h3>
      <h4 v-if="item.content_type == 3">{{item.author.user_name}}</h4>
      <h4 v-else>文 / {{item.author.user_name}}</h4>
      <div class="pic" v-if="item.content_type != 4 && item.img_url != ''">
        <img :src="item.img_url">
      </div>
      <div class="musicPic" v-else-if="item.img_url != ''">
        <audio id="media" preload="auto" src="/static/audio/music.mp3">
        Your browser does not support the audio element.
        </audio>
        <div class="musicCover">
          <img :src="item.img_url">
        </div>        
        <span class="play" @click.stop="playMusic" :class="{stop: !musicPlay}"></span>
        <span class="icon"></span>
      </div>
      <p>{{item.forward}}</p>
      <nav>
        <span v-if="today">今天</span>
        <span v-else>{{item.post_date | setDate('m月d日')}}</span>       
        <span @click.stop="changeLike(item)" :class="{active: like(item)}" v-if="item.content_type == 5">{{item.like_count+1862}}</span>
        <span @click.stop="changeLike(item)" :class="{active: like(item)}" v-else>{{item.like_count}}</span>
        <span @click.stop="changeCollect(item)" :class="{active: collect(item)}"></span>
      </nav>
    </div>
    <div class="prev" @click="prevDay">
      <img src="../../assets/img/prev.png">
    </div>
  </div>
</template>

<script type="text/javascript">
import setDate from '@/function/setDate.js'
import strSplit from '@/function/strSplit.js'
import {changeTime} from '@/function/changeTime.js'
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  filters: {
    setDate,
    strSplit
  },
  computed: {
    ...mapState({
      contentList: state => state.onelist.content_list,
      //主要内容
      nowDate: state=> state.nowDate,
      //数据所属时间
      user: state => state.user,
      //是否已登录
      type: state => state.type,
      //one内容类型
      collectRead: state => state.mine_collect.essay.list,
      collectMusic: state => state.mine_collect.music.list,
      collectMovie: state => state.mine_collect.movie.list,
      collectSerial: state => state.mine_collect.serial.list,
      //各类型收藏列表
      refresh: state => state.refresh,
      //scroll初始化方法
      likeList: state => state.likeList,
      //已点赞列表
      musicPlay: state => state.flag.musicPlay
      //判断首页音乐播放状态
    }),
    rotate: {
    //音乐CD旋转角度  
      get: function() {
        return this.$store.state.rotate;
      },
      set: function(newValue) {
        this.$store.commit('setRotate',{rotate:newValue,bannerRotate:0});
      }
    },
    today() {
    //根据计算属性today是否为true来处理日期显示
      if(changeTime(0,this.contentList[1].post_date) == changeTime(0)) {  
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
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
    collect(item) {
    //判断收藏状态
      if(item.content_type == 1 || item.content_type == 3) {
        if(JSON.stringify(this.collectRead).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, title:item.title})) != -1) {
          return true;
        } else {
          return false;
        }
      } else if(item.content_type == 2) {
        if(JSON.stringify(this.collectSerial).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, title:item.title})) != -1) {
          return true;
        } else {
          return false;
        }
      } else if(item.content_type == 4) {
        if(JSON.stringify(this.collectMusic).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, img:item.img_url, title:item.author.summary, author:item.author.user_name})) != -1) {
          return true;
        } else {
          return false;
        }
      } else if(item.content_type == 5) {
        if(JSON.stringify(this.collectMovie).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, title:item.title})) != -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    changeCollect(item) {
    //收藏处理
      if(this.user=='') {             
      //此时未登录
        this.closeMusic();
        //关闭首页音乐模块播放
        this.$router.push({name: 'MineIndex'});   
        //跳转到登录页面
        this.$store.commit('prevPage','index');
        //记录在跳转到登录页面之前所在属于index页面
        this.$store.commit('changeFlag',['me',true]);   
        this.$store.commit('changeFlag',['index',false]);   
        return;
      } else {                  
      //否则就说明此时已经登陆,继续操作   
        if(item.content_type == 1  || item.content_type == 3) {
        //当文章类型为阅读或问答时
          if(JSON.stringify(this.collectRead).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, title:item.title})) == -1) {
          //如果未收藏
            Toast({               
            //弹出提示框提示收藏成功
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['essay',{type:item.content_type, id:item.content_id, title:item.title}]);
            //将本篇加入阅读收藏列表
          } else {
            //否则
            Toast({
            //弹出提示框提示取消收藏
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['essay',{type:item.content_type, id:item.content_id, title:item.title}]);
            //将本篇从阅读收藏列表中去除
          }
        } else if(item.content_type == 2) {
        //当文章类型为连载时
          if(JSON.stringify(this.collectSerial).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, title:item.title})) == -1) {     
            Toast({
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['serial',{type:item.content_type, id:item.content_id, title:item.title}]);
            //将本篇加入连载收藏列表
          } else {
            Toast({
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['serial',{type:item.content_type, id:item.content_id, title:item.title}]);
            //将本篇从连载收藏列表中去除
          }
        } else if(item.content_type == 4) {   
        //当文章类型为音乐时
          if(JSON.stringify(this.collectMusic).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, img:item.img_url, title:item.author.summary, author:item.author.user_name})) == -1) { 
            Toast({
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['music',{type:item.content_type, id:item.content_id, img:item.img_url, title:item.author.summary, author:item.author.user_name}]);
            //将本篇加入音乐收藏列表
          } else {
            Toast({
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['music',{type:item.content_type, id:item.content_id, img:item.img_url, title:item.author.summary, author:item.author.user_name}]);
            //将本篇从音乐收藏列表中去除
          }
        } else if(item.content_type == 5) {
        //当文章类型为电影时
          if(JSON.stringify(this.collectMovie).indexOf(JSON.stringify({type:item.content_type, id:item.content_id, title:item.title})) == -1) { 
            Toast({
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['movie',{type:item.content_type, id:item.content_id, title:item.title}]);  //将本篇加入电影收藏列表
          } else {
            Toast({
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['movie',{type:item.content_type, id:item.content_id, title:item.title}]);
            //将本篇从电影收藏列表中去除
          }
        }
      }      
    },
    gotoAddress(path) {
      this.$router.push(path);
      //跳转页面
      this.$store.commit('prevPage','index');
      //记录是从index页面进入的详情页
      this.closeMusic();
      //关闭首页音乐模块播放
    },
    playMusic() {
    //首页音乐模块播放
      let media = document.querySelector('#media');
      let cover = document.querySelector('.m-content .musicCover');
      if(media.paused) {
      //如果处于暂停状态  
        media.play();
        this.$store.commit('changeFlag',['musicPlay',true]);
        //播放音乐,更改状态图标 
        this.$store.commit('clearTimer');
        //开启定时器之前先清除可能存在的定时器
        this.$store.commit('setTimer',setInterval(() => {
          this.rotate += .5;
          cover.style.transform = "rotate(" + this.rotate + "deg)";
          if (this.rotate > 360) {
            this.rotate = 0;
          }
        },50))
        //开启定时器,CD旋转,并上传定时器
      } else {
        //如果处于播放状态
        media.pause();   
        this.$store.commit('changeFlag',['musicPlay',false]); 
        this.$store.commit('clearTimer');
        //就暂停音乐,更改状态图标,并清除定时器
      }  
    },
    prevDay() {
    //上一天操作
      this.closeMusic();
      //关闭首页音乐模块播放
      this.$store.commit('changeFlag',['loading',true]);
      //loading...
      this.$store.commit('changeFlag',['menuShow',false]);
      //收起首页中部目录

      this.$store.commit('setDate',changeTime(-1,this.nowDate));
      //设置vuex里的nowDate为当前时间的上一天    
      this.$store.dispatch('getOnelist',this.nowDate).then(()=> {
        setTimeout(() => {
          this.refresh();
          this.$store.commit('changeFlag',['loading',false]);
        },200)
      });
      //在获取到首页数据之后延迟200ms初始化scroll,loading状态消失
    },
    closeMusic() {
    //关闭音乐  
      let media = document.querySelector('#media');
      let cover = document.querySelector('.m-content .musicCover');
      if(media && cover) {
        media.load(); 
        //重新加载音频
        this.$store.commit('changeFlag',['musicPlay',false]);
        //音乐停止播放,更改播放状态图标  
        this.rotate = 0;
        cover.style.transform = "rotate(" + this.rotate + "deg)";
        //CD旋转角度归零
        this.$store.commit('clearTimer');
        //清除定时器
      }
    }
  }
}	

</script>
<style type="text/css">
  @import '../../assets/css/contentLis.css' 
</style>