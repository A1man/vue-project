<template>
  <div class="content-header">
    <span @click="back()"></span>
    <div class="title hpTitle" v-if="content_type == 'hp'">
      <h1>{{hplist.post_date | setDate('y / m / d')}}</h1>
    </div>
    <div class="title" v-if="content_type == 'essay'">
      <h1 v-if="readinglist.tag_list[0]">{{readinglist.tag_list[0].title}}</h1>
      <h1 v-else-if="readinglist.share_list">{{readinglist.share_list.wx.title | strSplit(' | ',0)}}</h1>
    </div>  
    <div class="title" v-else-if="content_type == 'serial'">
      <h1 v-if="seriallist.tag_list[0]">{{seriallist.tag_list[0].title}}</h1>
      <h1 v-else-if="seriallist.share_list">{{seriallist.share_list.wx.title | strSplit(' | ',0)}}</h1>
    </div>
    <div class="title" v-else-if="content_type == 'question'">
      <h1 v-if="questionlist.tag_list[0]">{{questionlist.tag_list[0].title}}</h1>
      <h1 v-else-if="questionlist.share_list">{{questionlist.share_list.wx.title | strSplit(' | ',0)}}</h1>
    </div>
    <div class="title" v-else-if="content_type == 'music'">
      <h1 v-if="musiclist.tag_list[0]">{{musiclist.tag_list[0].title}}</h1>
      <h1 v-else-if="musiclist.share_list">{{musiclist.share_list.wx.title | strSplit(' | ',0)}}</h1>
    </div>
    <div class="title" v-else-if="content_type == 'movie'">
      <h1 v-if="moviemsg.tag_list[0]">{{moviemsg.tag_list[0].title}}</h1>
      <h1 v-else-if="moviemsg.share_list">{{moviemsg.share_list.wx.title | strSplit(' | ',0)}}</h1>
    </div>
    <span :class="{active: collect}" @click="changeCollect()"></span>
  </div>
</template> 

<script type="text/javascript">
import strSplit from '@/function/strSplit.js'
import setDate from '@/function/setDate.js'
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  filters: {
    strSplit,
    setDate
  },
  data() {
    return {
      content_id: '',
      content_type: ''
    }
  },
  mounted() {
    this.content_id = this.$route.query.id;     
    this.content_type = this.$route.query.type;
    //query传递参数
  },
  computed: {
    ...mapState({
      user: state => state.user,
      //是否已登陆
      hplist: state => state.hplist,
      //图文数据
      readinglist: state => state.readinglist,
      //阅读数据
      seriallist: state => state.seriallist,
      //连载数据
      questionlist: state => state.questionlist,
      //问答数据
      musiclist: state => state.musiclist,
      //音乐数据
      movielist: state => state.movielist,
      //影视文章数据
      moviemsg: state => state.moviemsg,
      //影视数据
      collectHp: state => state.mine_collect.hp.list,
      //图文收藏列表
      collectRead: state => state.mine_collect.essay.list,
      //文章收藏列表
      collectMusic: state => state.mine_collect.music.list,
      //音乐收藏列表
      collectMovie: state => state.mine_collect.movie.list,
      //影视收藏列表
      collectSerial: state => state.mine_collect.serial.list     
      //连载收藏列表
    }),
    collect() {
    //返回计算属性collect判断收藏状态
      if(this.content_type == 'hp') {
      //当本篇为图文类型时
        if(JSON.stringify(this.collectHp).indexOf(JSON.stringify({type:this.hplist.content_type, id:this.hplist.content_id, img:this.hplist.img_url, vol:this.hplist.share_info.title, date:this.hplist.post_date, forward:this.hplist.forward})) != -1) {
        //根据在collectHp中是否存在本篇数据判断是否已被收藏
          return true;
        } else {
          return false;
        }
      } else if(this.content_type == 'essay') {
      //当本篇为阅读或问答类型时
        if(JSON.stringify(this.collectRead).indexOf(JSON.stringify({type:'1', id:this.readinglist.content_id, title:this.readinglist.hp_title})) != -1) {
        //根据在collectRead中是否存在本篇数据判断是否已被收藏
          return true;
        } else {
          return false;
        }
      } else if(this.content_type == 'question') {
        if(JSON.stringify(this.collectRead).indexOf(JSON.stringify({type:'3', id:this.questionlist.question_id, title:this.questionlist.question_title})) != -1) {
        //根据在collectRead中是否存在本篇数据判断是否已被收藏
          return true;
        } else {
          return false;
        }
      } else if(this.content_type == 'serial') {
      //当本篇为连载类型时
        if(JSON.stringify(this.collectSerial).indexOf(JSON.stringify({type:'2', id:this.seriallist.id, title:this.seriallist.title})) != -1) {
        //根据在collectSerial中是否存在本篇数据判断是否已被收藏
          return true;
        } else {
          return false;
        }
      } else if(this.content_type == 'music') {
      //当本篇为音乐类型时
        if(JSON.stringify(this.collectMusic).indexOf(JSON.stringify({type:'4', id:this.musiclist.id, img:this.musiclist.feeds_cover.split('?')[0], title:this.musiclist.author.summary, author:this.musiclist.author.user_name})) != -1) {
        //根据在collectMusic中是否存在本篇数据判断是否已被收藏
          return true;
        } else {
          return false;
        }
      } else if(this.content_type == 'movie') {
      //当本篇为电影类型时
        if(JSON.stringify(this.collectMovie).indexOf(JSON.stringify({type:'5', id:this.moviemsg.id, title:this.movielist.title})) != -1) {
        //根据在collectMovie中是否存在本篇数据判断是否已被收藏
          return true;
        } else {
          return false;
        }
      }
    }  
  },
  methods: {
    closeMusic() {
      let media = document.querySelector('#detailMedia');
      if(media) {
        media.load(); 
        //重新加载音频
        this.$store.commit('changeFlag',['detailMusicPlay',false]);
        //音乐停止播放,更改播放状态图标
      }
    },
    back() {
      this.closeMusic();
      //关闭详情页音乐播放
      this.$router.go(-1);
      //返回上一个记录的路由
    },
    changeCollect() {
    //收藏处理
      if(this.user=='') {      
      //此时未登录
        this.closeMusic();
        //关闭详情页音乐播放
        this.$router.push({name: 'MineIndex'});
        //跳转到登录页面
        this.$store.commit('changeFlag',['me',true]);   
        this.$store.commit('changeFlag',['index',false]);
        this.$store.commit('changeFlag',['all',false]);
        return;
      } else {
      //否则就说明此时已经登陆,继续操作   
        if(this.content_type == 'hp') {
        //当文章类型为图文类型时
          if(!this.collect) {
          //如果未收藏
            Toast({
            //弹出提示框提示收藏成功
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['hp',{type:this.hplist.content_type, id:this.hplist.content_id, img:this.hplist.img_url, vol:this.hplist.share_info.title, date:this.hplist.post_date, forward:this.hplist.forward}]);
            //将本篇加入图文收藏列表
          } else {
            //否则
            Toast({
            //弹出提示框提示取消收藏
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['hp',{type:this.hplist.content_type, id:this.hplist.content_id, img:this.hplist.img_url, vol:this.hplist.share_info.title, date:this.hplist.post_date, forward:this.hplist.forward}]);
            //将本篇从图文收藏列表中删除
          }
        } else if(this.content_type == 'essay'  || this.content_type == 'question') {
        //当文章类型为阅读或问答时
          if(!this.collect) {
            Toast({              
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            if(this.content_type == 'essay') {
              this.$store.commit('collect',['essay',{type:'1', id:this.readinglist.content_id, title:this.readinglist.hp_title}]);
            } else if(this.content_type == 'question') {
              this.$store.commit('collect',['essay',{type:'3', id:this.questionlist.question_id, title:this.questionlist.question_title}]);
            }
            //将本篇加入阅读收藏列表             
          } else {
            Toast({              
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            if(this.content_type == 'essay') {
              this.$store.commit('cancelCollect',['essay',{type:'1', id:this.readinglist.content_id, title:this.readinglist.hp_title}]);
            } else if(this.content_type == 'question') {
              this.$store.commit('cancelCollect',['essay',{type:'3', id:this.questionlist.question_id, title:this.questionlist.question_title}]);
            }
            //将本篇从阅读收藏列表中删除
          }
        } else if (this.content_type == 'serial') {
        //当文章类型为连载时
          if(!this.collect) {
            Toast({
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['serial',{type:'2', id:this.seriallist.id, title:this.seriallist.title}]);
            //将本篇加入连载收藏列表
          } else {
            Toast({
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['serial',{type:'2', id:this.seriallist.id, title:this.seriallist.title}]);
            //将本篇从连载收藏列表中删除
          }
        } else if (this.content_type == 'music') {
        //当文章类型为音乐时
          if(!this.collect) {
            Toast({
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['music',{type:'4', id:this.musiclist.id, img:this.musiclist.feeds_cover.split('?')[0], title:this.musiclist.author.summary, author:this.musiclist.author.user_name}]);
            //将本篇加入音乐收藏列表
          } else {
            Toast({
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['music',{type:'4', id:this.musiclist.id, img:this.musiclist.feeds_cover.split('?')[0], title:this.musiclist.author.summary, author:this.musiclist.author.user_name}]);
            //将本篇从音乐收藏列表中删除
          }
        } else if (this.content_type == 'movie') {
        //当文章类型为电影时
          if(!this.collect) {
            Toast({
              message: '已收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('collect',['movie',{type:'5', id:this.moviemsg.id, title:this.movielist.title}]);
            //将本篇加入电影收藏列表
          } else {
            Toast({
              message: '取消收藏',
              position: 'middle',
              duration: 666,
              className: 'collectHint'
            });
            this.$store.commit('cancelCollect',['movie',{type:'5', id:this.moviemsg.id, title:this.movielist.title}]);
            //将本篇从电影收藏列表中删除
          }
        }
      }      
    }
  }
}

</script>
<style type="text/css">
.content-header {
  position: relative;
  background: #fff;
}
.content-header .title h1{
  height: .88rem;
  border-bottom: 0.01rem solid #f3f3f3;
  font-size: .3rem;
  line-height: .88rem;
  color: #000;
  text-align: center;
}
.content-header .hpTitle h1 {
  font: .4rem/.88rem "Courier New";
}
.content-header span:nth-of-type(1) {
  position: absolute;
  top: 0;
  left: 0;
  width: .87rem;
  height: .88rem;
  background: url("../../assets/img/sprite.png") 0 -7.1rem no-repeat;
  background-size: 10rem 15rem;
} 
.content-header span:nth-of-type(2) {
  position: absolute;
  top: 0;
  right: 0;
  width: .99rem;
  height: .88rem;
  background: url("../../assets/img/sprite.png") -.87rem -7.1rem no-repeat;
  background-size: 10rem 15rem;
} 
.content-header span:nth-of-type(2).active {
  background: url("../../assets/img/sprite.png") -4.52rem -7.1rem no-repeat;
  background-size: 10rem 15rem;
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