<template>
	<div class="content-serial">
    <div class="content">
      <h2>{{seriallist.title}}</h2>
      <h3>文 / {{seriallist.author.user_name}}</h3>
      <div v-html="seriallist.content" class="text"></div>
      <p class="supplement">{{seriallist.charge_edt}} {{seriallist.editor_email}}</p>
      <p class="supplement" v-if="seriallist.copyright">{{seriallist.copyright}}</p>
    </div>
    <div class="author" v-if="seriallist.author.user_id != 0">
      <h3>作者</h3>
      <div @click="gotoAddress({path: '/author',query:{author_id:seriallist.author.user_id}})">
        <img :src="seriallist.author.web_url">
        <p>{{seriallist.author.user_name}}{{seriallist.author.wb_name}}</p>
        <p>{{seriallist.author.summary}}</p>
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
      seriallist: state => state.seriallist,
      //连载详细信息
      interest: state => state.mine_interest,
      //关注列表
      user: state => state.user
      //是否已登录
    }),
    attention() {
    //判断是否已关注
      if(JSON.stringify(this.interest).indexOf(JSON.stringify({id: this.seriallist.author.user_id,name: this.seriallist.author.user_name,img: this.seriallist.author.web_url,summary: this.seriallist.author.summary})) != -1) {  
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
          this.$store.commit('attention',{id: this.seriallist.author.user_id,name: this.seriallist.author.user_name,img: this.seriallist.author.web_url,summary: this.seriallist.author.summary});
          //将作者加入关注列表
        } else {                  
        //否则
          this.$store.commit('cancelAttention',{id: this.seriallist.author.user_id,name: this.seriallist.author.user_name,img: this.seriallist.author.web_url,summary: this.seriallist.author.summary});    
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