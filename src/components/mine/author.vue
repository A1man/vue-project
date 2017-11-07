<template>
  <div class="authorAll">
    <ring-loader :loading="loading"></ring-loader>
    <scroll ref="authorScroll">
      <div>
        <div class="authorMsg">
          <span @click="back"></span>
          <img :src="authorMsg.web_url">
          <h1>{{authorMsg.user_name}}</h1>
          <h2>{{authorMsg.summary}}</h2>
          <p>{{authorMsg.desc}}</p>
          <button @click="changeAttention" :class="{active: attention}">{{text}}</button>
          <h3>{{authorMsg.fans_total}}关注</h3>
        </div>
        <ul class="authorWork">
          <li v-for="(item,index) in authorWork" class="text" @click="gotoAddress(item,{path: '/detail',query:{type:type[item.content_type],id:item.content_id}})">
            <h2 v-if="item.tag_list[0]">- {{item.tag_list[0].title}} -</h2>
            <h2 v-else>- {{item.share_list.wx.title | strSplit(' | ',0)}} -</h2>
            <h3>{{item.title}}</h3>
            <h4 v-if="item.content_type == 3">{{item.author.user_name}}</h4>
            <h4 v-else>文 / {{item.author.user_name}}</h4>
            <div class="pic" v-if="item.content_type != 4 && item.img_url != ''">
              <img :src="item.img_url">
            </div>
            <div class="musicPic" v-else-if="item.img_url != ''">
              <audio class="authorMedia" preload="auto" src="/static/audio/music.mp3">
              Your browser does not support the audio element.
              </audio>
              <div class="musicCover">
                <img :src="item.img_url">
              </div>        
              <span class="play stop" @click.stop="playMusic(index)"></span>
              <span class="icon"></span>
            </div>
            <p>{{item.forward}}</p>
            <nav>
              <span v-if="today(item)">今天</span>
              <span v-else>{{item.post_date | setDate('m月d日')}}</span>       
              <span @click.stop="changeLike(item)" :class="{active: like(item)}" v-if="item.content_type == 5">{{item.like_count+1862}}</span>
              <span @click.stop="changeLike(item)" :class="{active: like(item)}" v-else>{{item.like_count}}</span>
              <span @click.stop="changeCollect(item)" :class="{active: collect(item)}"></span>
            </nav>
          </li>
        </ul>
      </div>
    </scroll>        
  </div>
</template>
<script type="text/javascript">
import scroll from '@/components/scroll'
import { mapState } from 'vuex'
import setDate from '@/function/setDate.js'
import strSplit from '@/function/strSplit.js'
import {changeTime} from '@/function/changeTime.js'
import { Toast } from 'mint-ui'

export default {
  name: 'Author',
  components: {
    scroll
  },
  filters: {
    setDate,
    strSplit
  },
  data() {
    return {
      author_id: '',
      authorRotate: []
    }
  },
  mounted() {
    this.author_id = this.$route.query.author_id;
    //query传参
    this.$store.commit('changeFlag',['loading',true]);
    //loading...
    this.$store.dispatch('getAuthorMsg',this.author_id).then(() => {
      this.$store.dispatch('getAuthorWork',this.author_id);
    }).then(() => {
      setTimeout(() => {
        this.$refs.authorScroll.refresh();
        this.$store.commit('changeFlag',['loading',false]);
      },500)
    })
    //请求到作者信息和作者著作数据后loading状态消失
  },
  computed: {
    ...mapState({
      user: state => state.user,
      //是否已登录
      authorMsg: state => state.authorMsg,
      //作者信息数据
      authorWork: state => state.authorWork,
      //作者著作数据
      type: state => state.type,
      //one内容类型
      likeList: state => state.likeList,
      //已点赞列表
      loading: state => state.flag.loading,
      //loading状态是否存在
      collectRead: state => state.mine_collect.essay.list,
      collectMusic: state => state.mine_collect.music.list,
      collectMovie: state => state.mine_collect.movie.list,
      collectSerial: state => state.mine_collect.serial.list,
      //各类型收藏列表
      interest: state => state.mine_interest
      //关注列表
    }),
    attention() {
    //判断是否已关注
      if(JSON.stringify(this.interest).indexOf(JSON.stringify({id: this.authorMsg.user_id,name: this.authorMsg.user_name,img: this.authorMsg.web_url,summary: this.authorMsg.summary})) != -1) {  
      //根据在interest中是否存在作者数据,判断是否已关注
        return true;
      } else {
        return false;
      }
    },
    text() {
    //关注按钮的文本内容
      if(this.attention) {
        return '已关注';
      } else {
        return '关注';
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
      //返回上一个记录的路由
    },
    today(item) {
    //根据today是否为true来处理日期显示
      if(changeTime(0,item.post_date) == changeTime(0)) {  
        return true;
      } else {
        return false;
      }
    },
    changeAttention() {
    //关注处理
      if(this.user=='') {             
        //此时未登录
          setTimeout(() => {
            this.$router.push({name: 'MineIndex'});
          },100) 
          //跳转到登录页面
          this.$store.commit('changeFlag',['me',true]);   
          this.$store.commit('changeFlag',['index',false]);
          this.$store.commit('changeFlag',['all',false]); 
          return;
      } else {
        if(!this.attention) {     
        //当this.attention是false说明此时没关注
          this.$store.commit('attention',{id: this.authorMsg.user_id,name: this.authorMsg.user_name,img: this.authorMsg.web_url,summary: this.authorMsg.summary});
          //将作者加入关注列表
          this.authorMsg.fans_total++;
        } else {                  
          this.$store.commit('cancelAttention',{id: this.authorMsg.user_id,name: this.authorMsg.user_name,img: this.authorMsg.web_url,summary: this.authorMsg.summary});    
          //否则将作者从关注列表移除
          this.authorMsg.fans_total--;
        }
      }        
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
      } else {
        this.$store.commit('cancelLike',item.content_id);
        item.like_count --;
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
          this.$router.push({name: 'MineIndex'});   
          //跳转到登录页面
          this.$store.commit('changeFlag',['me',true]);   
          this.$store.commit('changeFlag',['index',false]);
          this.$store.commit('changeFlag',['all',false]); 
          return;
      } else {
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
            this.$store.commit('cancelCollect',['music',{type:item.content_type, id:item.content_id, img:item.img_url, title:item.title, author:item.author.user_name}]);
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
    gotoAddress(item,path) {
      this.$router.push(path);
      //跳转页面
    },
    playMusic(index) {
    //音乐模块播放
      let authorMedia = document.querySelectorAll('.authorMedia');
      let cover = document.querySelectorAll('.authorAll .musicCover');
      let play = document.querySelectorAll('.authorAll .play');     
      if(authorMedia[index].paused) {
      //如果此播放处于暂停状态
        for(let i = 0; i < authorMedia.length; i++) {
          authorMedia[i].pause();
        }
        authorMedia[index].play();
        //停止其他播放,播放此音乐
        
        for(let i = 0; i < play.length; i++) {
          play[i].classList.add('stop');
        }
        play[index].classList.remove('stop');
        //更改其他播放图标为暂停，此播放图标为播放

        this.$store.commit('clearTimer');
        //开启定时器之前先清除可能存在的定时器
        this.$store.commit('setTimer',setInterval(() => {
          if(this.authorRotate[index] == undefined) {
            this.authorRotate[index] = 0;
          }
          this.authorRotate[index] += .5;
          cover[index].style.transform = "rotate(" + this.authorRotate[index] + "deg)";
          if (this.authorRotate[index] > 360) {
            this.authorRotate[index] = 0;
          }
          //设置每个音乐封面各自的旋转角度
        },50))
        //开启定时器,CD旋转,并上传定时器
      } else {
        //如果处于播放状态
        authorMedia[index].pause();
        play[index].classList.add('stop');
        this.$store.commit('clearTimer');
        //就暂停此音乐,更改此音乐状态图标,并清除定时器
      }  
    }
  }
}

</script>
<style type="text/css">
  @import '../../assets/css/contentLis.css' 
</style>