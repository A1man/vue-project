<template>
	<div class="content-movie">
    <div class="movieImg">
      <img :src="moviemsg.detailcover">
      <p>《{{moviemsg.title}}》</p>
      <div class="tarns">
        <strong></strong>
        <strong></strong>
        <strong></strong>
        <strong></strong>
        <strong></strong>
        <strong></strong>
        <strong></strong>
        <strong></strong>
      </div>
    </div>
    <div class="content">
      <h2>{{movielist.title}}</h2>
      <h3>文 / {{movielist.user.user_name}}</h3>
      <div v-html="movielist.content" class="text"></div>
      <p class="supplement">{{movielist.charge_edt}} {{movielist.editor_email}}</p>
      <p class="supplement" v-if="movielist.copyright">{{movielist.copyright}}</p>
    </div>
    <div class="author" v-if="movielist.user.user_id != 0">
      <h3>作者</h3>
      <div @click="gotoAddress({path: '/author',query:{author_id:movielist.user.user_id}})">
        <img :src="movielist.user.web_url">
        <p>{{movielist.user.user_name}}{{movielist.user.wb_name}}</p>
        <p>{{movielist.user.summary}}</p>
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
      moviemsg: state => state.moviemsg,
      //影视数据
      movielist: state => state.movielist,
      //音乐详细信息
      interest: state => state.mine_interest,
      //关注列表
      user: state => state.user
      //是否已登录
    }),
    attention() {
    //判断是否已关注
      if(JSON.stringify(this.interest).indexOf(JSON.stringify({id: this.movielist.user.user_id,name: this.movielist.user.user_name,img: this.movielist.user.web_url,summary: this.movielist.user.summary})) != -1) {  
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
        this.$router.push({name: 'MineIndex'});   
        //跳转到登录页面
        this.$store.commit('changeFlag',['me',true]);   
        this.$store.commit('changeFlag',['index',false]);   
        return;
      } else {                    
      //否则就说明此时已经登陆,继续操作         
          if(!this.attention) {     
          //当this.attention是false说明此时没关注
          this.$store.commit('attention',{id: this.movielist.user.user_id,name: this.movielist.user.user_name,img: this.movielist.user.web_url,summary: this.movielist.user.summary});
          //将作者加入关注列表
        } else {                  
        //否则
          this.$store.commit('cancelAttention',{id: this.movielist.user.user_id,name: this.movielist.user.user_name,img: this.movielist.user.web_url,summary: this.movielist.user.summary});    
          //将作者从关注列表移除
        }
      }
    },
    gotoAddress(path) {
      this.$router.push(path);
    }
  }
}

</script>

<style type="text/css">
  @import '../../assets/css/contents.css'
</style>