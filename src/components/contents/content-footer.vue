<template> 
  <div class="content-footer" :style="{backgroundColor: bannerMsg.bg_color}">
    <input type="text" placeholder="写一个评论.." @click="publish" ref="input" :style="{backgroundColor: bannerMsg.bg_color,color: bannerMsg.font_color,borderColor: bannerMsg.font_color}">
    <nav>
      <span v-if="content_type == 'essay'" @click="changeLike()" :class="{active: like()}" :style="{color: bannerMsg.font_color}">{{readinglist.praisenum}}</span>
      <span v-else-if="content_type == 'serial'" @click="changeLike()" :class="{active: like()}" :style="{color: bannerMsg.font_color}">{{seriallist.praisenum}}</span>
      <span v-else-if="content_type == 'question'" @click="changeLike()" :class="{active: like()}" :style="{color: bannerMsg.font_color}">{{questionlist.praisenum}}</span>
      <span v-else-if="content_type == 'music'" @click="changeLike()" :class="{active: like()}" :style="{color: bannerMsg.font_color}">{{musiclist.praisenum}}</span>
      <span v-else-if="content_type == 'movie'" @click="changeLike()" :class="{active: like()}" :style="{color: bannerMsg.font_color}">{{movielist.praisenum}}</span>
      <span v-else @click="changeLike()" :class="{active: like()}" :style="{color: bannerMsg.font_color}">{{bannerMsg.praisenum}}</span>
      <span :style="{color: bannerMsg.font_color}">{{commentlist.count}}</span>
      <span @click="transpond"></span>
    </nav>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'

export default {
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
  computed: mapState({
    readinglist: state => state.readinglist,
    //阅读数据
    seriallist: state => state.seriallist,
    //连载数据
    questionlist: state => state.questionlist,
    //问答数据
    musiclist: state => state.musiclist,
    //音乐文章数据
    movielist: state => state.movielist,
    //影视文章数据
    bannerMsg: state => state.bannerMsg,
    //专题数据
    commentlist: state => state.commentlist,
    //评论数据
    likeList: state => state.likeList,
    //点赞列表
    user: state => state.user,
    //是否已登录
    bannerMsg: state => state.bannerMsg
    //专题详细信息
  }),
  methods: {
    like() {
    //判断点赞状态
      if(this.likeList.indexOf(this.content_id) != -1) {
      //根据在likeList中是否存在content_id判断是否已点赞
        return true;
      } else {
        return false;
      }
    },
    changeLike() {
    //点赞处理{
      if(this.likeList.indexOf(this.content_id) == -1) {
      //如果未点赞  
        this.$store.commit('like',this.content_id);
        //加入点赞列表
      } else {
        this.$store.commit('cancelLike',this.content_id);
        //否则从点赞列表中删除
      }
    },
    transpond() {          
    //转发处理
      Toast({
        message: '转发成功',
        position: 'middle',
        duration: 666,
        className: 'collectHint'
      });
    },
    publish() {
    //打开评论层
      if(this.user=='') {                         
      //此时未登录
        let media = document.querySelector('#detailMedia');
        if(media) {
          media.load(); 
          //重新加载音频
          this.$store.commit('changeFlag',['detailMusicPlay',false]);
          //详情页音乐停止播放,更改播放状态图标
        }
        this.$router.push({name: 'MineIndex'});
        //跳转到登录页面
        this.$store.commit('changeFlag',['me',true]);
        this.$store.commit('changeFlag',['index',false]);
        this.$store.commit('changeFlag',['all',false]);
        return;
      } else {
      //否则就说明此时已经登陆,继续操作 
        this.$store.commit('changeFlag',['publishTrans',true]);
        this.$refs.input.blur();
        //footer的input失去焦点
        let textarea = document.querySelector('.publish textarea');
        setTimeout(() => {
          textarea.focus();
          //评论文本输入框得到焦点
        },100)
      }
    }
  }
}

</script>

<style type="text/css">
.content-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: .68rem;
  border-top: .01rem solid #e6e6e6;
  background: #fcfcfc;
  padding: .16rem 0 .16rem .4rem;
}
.content-footer input {
  display: block;
  width: 2.52rem;
  height: .66rem;
  border: .01rem solid #a7a7a7;
  border-radius: .1rem;
  font-size: .26rem;
  line-height: .66rem;
  color: #a6a6a6;
  padding-left: .26rem;
}
.content-footer nav {
  position: absolute;
  width: 3.2rem;
  height: .68rem;
  top: 0.16rem;
  left: 3.2rem;
}
.content-footer span {
  float: left;
  width: 1.06rem;
  height: .68rem;
  font-size: .22rem;
  line-height: .36rem;
  color: #979797;
  box-sizing: border-box;
}
.content-footer span:nth-of-type(1) {
  background: url("../../assets/img/sprite.png") -2.13rem -.82rem no-repeat;
  background-size: 10rem 15rem;
  padding-left: .5rem;
}
.content-footer span:nth-of-type(1).active {
  background-position: -2.26rem -11.88rem;
}
.content-footer span:nth-of-type(2) {  
  background: url("../../assets/img/sprite.png") -2.13rem 0 no-repeat;
  background-size: 10rem 15rem;
  padding-left: .65rem;
}
.content-footer span:nth-of-type(3) { 
  background: url("../../assets/img/sprite.png") -2.13rem -2.46rem no-repeat;
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