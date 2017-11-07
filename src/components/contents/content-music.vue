<template>
	<div class="content-music">
    <audio id="detailMedia" preload="auto" src="/static/audio/music.mp3">
    Your browser does not support the audio element.
    </audio>
    <div class="musicImg">
      <img :src="musiclist.feeds_cover">
      <img :src="musiclist.cover">
      <div class="play" @click="playMusic" :class="{stop: !detailMusicPlay}"></div>
      <p> · {{musiclist.title}} · {{musiclist.author.user_name}} | {{musiclist.album}}</p>
    </div>
    <div class="content">
      <h2>{{musiclist.story_title}}</h2>
      <h3>文 / {{musiclist.story_author.user_name}}</h3>
      <div v-html="musiclist.story" class="text"></div>
      <p class="supplement">{{musiclist.charge_edt}} {{musiclist.editor_email}}</p>
      <p class="supplement" v-if="musiclist.copyright">{{musiclist.copyright}}</p>
    </div>
    <div class="author" v-if="musiclist.story_author.user_id != 0">
      <h3>作者</h3>
      <div @click="gotoAddress({path: '/author',query:{author_id:musiclist.story_author.user_id}})">
        <img :src="musiclist.story_author.web_url">
        <p>{{musiclist.story_author.user_name}}{{musiclist.story_author.wb_name}}</p>
        <p>{{musiclist.story_author.summary}}</p>
      </div>
      <button @click.stop="changeAttention" :class="{active: attention}">{{text}}</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      musiclist: state => state.musiclist,
      //音乐详细信息
      interest: state => state.mine_interest,
      //关注列表
      user: state => state.user,
      //是否已登录
      detailMusicPlay: state => state.flag.detailMusicPlay
      //判断详情页音乐播放状态
    }),
    attention() {
    //判断是否已关注
      if(JSON.stringify(this.interest).indexOf(JSON.stringify({id: this.musiclist.story_author.user_id,name: this.musiclist.story_author.user_name,img: this.musiclist.story_author.web_url,summary: this.musiclist.story_author.summary})) != -1) {  
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
    changeAttention() {     
    //关注处理
      if(this.user=='') {                         
      //此时未登录
        this.closeMusic();
        //关闭详情页音乐模块播放
        this.$router.push({name: 'MineIndex'});   
        //跳转到登录页面
        this.$store.commit('changeFlag',['me',true]);   
        this.$store.commit('changeFlag',['index',false]);   
        return;
      } else {                    
      //否则就说明此时已经登陆,继续操作         
          if(!this.attention) {     
          //当this.attention是false说明此时没关注
          this.$store.commit('attention',{id: this.musiclist.story_author.user_id,name: this.musiclist.story_author.user_name,img: this.musiclist.story_author.web_url,summary: this.musiclist.story_author.summary});
          //将作者加入关注列表
        } else {                  
        //否则
          this.$store.commit('cancelAttention',{id: this.musiclist.story_author.user_id,name: this.musiclist.story_author.user_name,img: this.musiclist.story_author.web_url,summary: this.musiclist.story_author.summary});    
          //将作者从关注列表移除
        }
      }
    },
    playMusic() {
    //详情页音乐播放
      let media = document.querySelector('#detailMedia');
      if(media.paused) {
      //如果处于暂停状态  
        media.play();
        this.$store.commit('changeFlag',['detailMusicPlay',true]);
        //播放音乐,更改状态图标 
      } else {
        //如果处于播放状态
        media.pause();   
        this.$store.commit('changeFlag',['detailMusicPlay',false]); 
        //就暂停音乐,更改状态图标
      }  
    },
    gotoAddress(path) {
      this.closeMusic();
      //关闭详情页音乐模块播放
      this.$router.push(path);
    },
    closeMusic() {
    //关闭音乐  
      let media = document.querySelector('#detailMedia');
      media.load(); 
      //重新加载音频
      this.$store.commit('changeFlag',['detailMusicPlay',false]);
      //音乐停止播放,更改播放状态图标
    }
  }
}

</script>

<style type="text/css">
  @import '../../assets/css/contents.css'
</style>