<template>
	<div class="content-question">
    <div class="content">
      <h2>{{questionlist.question_title}}</h2>
      <h3 class="asker">{{questionlist.asker.user_name}}问：</h3>
      <p class="questionText">{{questionlist.question_content}}</p>
      <h3 class="answerer">{{questionlist.answerer.user_name}}答：</h3>
      <div v-html="questionlist.answer_content" class="text"></div>
      <p class="supplement">{{questionlist.charge_edt}} {{questionlist.charge_email}}</p>
      <p class="supplement" v-if="questionlist.copyright">{{questionlist.copyright}}</p>
    </div>
    <div class="author" v-if="questionlist.answerer.user_id != 0">
      <h3>作者</h3>
        <div @click="gotoAddress({path: '/author',query:{author_id:questionlist.answerer.user_id}})">
        <img :src="questionlist.answerer.web_url">
        <p>{{questionlist.answerer.user_name}}{{questionlist.answerer.wb_name}}</p>
        <p>{{questionlist.answerer.summary}}</p>
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
      questionlist: state => state.questionlist,
      //问答详细信息
      interest: state => state.mine_interest,
      //关注列表
      user: state => state.user
      //是否已登录
    }),
    attention() {
    //判断是否已关注
      if(JSON.stringify(this.interest).indexOf(JSON.stringify({id: this.questionlist.answerer.user_id,name: this.questionlist.answerer.user_name,img: this.questionlist.answerer.web_url,summary: this.questionlist.answerer.summary})) != -1) {  
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
          this.$store.commit('attention',{id: this.questionlist.answerer.user_id,name: this.questionlist.answerer.user_name,img: this.questionlist.answerer.web_url,summary: this.questionlist.answerer.summary});
          //将作者加入关注列表
        } else {                  
        //否则
          this.$store.commit('cancelAttention',{id: this.questionlist.answerer.user_id,name: this.questionlist.answerer.user_name,img: this.questionlist.answerer.web_url,summary: this.questionlist.answerer.summary});    
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