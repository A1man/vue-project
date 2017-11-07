<template>
  <div class="detail">
    <ring-loader :loading="loading"></ring-loader>
    <div class="publishTrans" v-show="publishTrans" @click="cancelPublish">
      <div class="publish" @click.stop>
        <textarea placeholder="在这里写下你想说的" @input="changeVal" v-model='text'></textarea>
      </div>
      <p @click.stop :class="{active: color}">
        {{textNub}}
        <button :class="{active: active}" @click="publish">发布</button>
      </p>
    </div>
    <content-header></content-header> 
    <scroll :pullup="pullup" @scrollToEnd="loadMore" ref="detailScroll">
      <div>
        <content-hp v-if="content_type == 'hp'"></content-hp>
        <content-reading v-else-if="content_type == 'essay'"></content-reading>
        <content-serial v-else-if="content_type == 'serial'"></content-serial>
        <content-question v-else-if="content_type == 'question'"></content-question>
        <content-music v-else-if="content_type == 'music'"></content-music>
        <content-movie v-else-if="content_type == 'movie'"></content-movie>
        <content-comment v-if="content_type != 'hp'"></content-comment>
        <div class="loading" v-if="content_type != 'hp'">{{pullTxt}}</div>
      </div>
    </scroll>
    <content-footer v-if="content_type != 'hp'"></content-footer>
  </div>    
</template>


<script type="text/javascript">
import ContentHeader from '@/components/contents/content-header'
import ContentHp from '@/components/contents/content-hp'
import ContentReading from '@/components/contents/content-reading'
import ContentQuestion from '@/components/contents/content-question'
import ContentSerial from '@/components/contents/content-serial'
import ContentMusic from '@/components/contents/content-music'
import ContentMovie from '@/components/contents/content-movie'
import ContentComment from '@/components/contents/content-comment'
import ContentFooter from '@/components/contents/content-footer'
import scroll from '@/components/scroll'
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui';
import {getTime} from '@/function/getTime.js'
import photo from '@/assets/img/photo.png'

export default {
  name: 'Detail',
  components: {
      ContentHeader,
      ContentHp,
      ContentReading,
      ContentQuestion,
      ContentSerial,
      ContentMusic,
      ContentMovie,
      ContentComment,
      ContentFooter,
      scroll
  },
  data() {
    return {
      pullup: true,
      pullTxt: '↓ 松开立即加载更多',
      content_id: '',
      content_type: '',
      textNub: 500,
      text: '',
      active: false,
      color: false
    }
  },
  mounted() {
    this.content_id = this.$route.query.id;
    this.content_type = this.$route.query.type;
    //路由query传递参数

    this.$store.commit('changeFlag',['loading',true]);
    //loading...
    
    if(this.content_type == 'hp') {
      this.$store.dispatch('getHplist',this.content_id)
      .then(() => {
        setTimeout(() => {
          this.$store.commit('changeFlag',['loading',false]);
        },200)
      });
    } else if(this.content_type == 'essay') {
      this.$store.dispatch('getReadinglist',this.content_id)
      .then(() => {
        this.$store.dispatch('getCommentlist',[this.content_type,this.content_id]);
      }).then(() => {
        setTimeout(() => {
          this.$store.commit('changeFlag',['loading',false]);
        },500)
      });
    } else if(this.content_type == 'serial') {
      this.$store.dispatch('getSeriallist',this.content_id)
      .then(() => {
        this.$store.dispatch('getCommentlist',[this.content_type,this.content_id]);
      }).then(() => {
        setTimeout(() => {
          this.$store.commit('changeFlag',['loading',false]);
        },500)
      });
    } else if(this.content_type == 'question') {
      this.$store.dispatch('getQuestionlist',this.content_id)
      .then(() => {
        this.$store.dispatch('getCommentlist',[this.content_type,this.content_id]);
      }).then(() => {
        setTimeout(() => {
          this.$store.commit('changeFlag',['loading',false]);
        },500)
      });
    } else if(this.content_type == 'music') {
      this.$store.dispatch('getMusiclist',this.content_id)
      .then(() => {
        this.$store.dispatch('getCommentlist',[this.content_type,this.content_id]);
      }).then(() => {
        setTimeout(() => {
          this.$store.commit('changeFlag',['loading',false]);
        },500)
      });
    } else if(this.content_type == 'movie') {
      this.$store.dispatch('getMovielist',this.content_id);
      this.$store.dispatch('getMoviemsg',this.content_id)
      .then(() => {
        this.$store.dispatch('getCommentlist',[this.content_type,this.content_id]);
      }).then(() => {
        setTimeout(() => {
          this.$store.commit('changeFlag',['loading',false]);
        },500)
      });
    }
    //根据详情页的类型请求内容数据和评论数据,数据请求完成之后loading状态消失
  },
  computed: {
    ...mapState({
      loading: state => state.flag.loading,
      //loading状态是否存在
      publishTrans: state => state.flag.publishTrans,
      //评论遮罩层的开关
      user: state => state.user,
      //是否登录
      commentlist: state => state.commentlist,
      //评论数据
      moreComment: state => state.moreComment
      //更多评论数据
    }),
    length() {
    //评论列表最后一个数据的下标  
      return this.commentlist.data.length - 1;
    }
  },
  methods: {
    cancelPublish() {
      //关闭评论层
      if(this.textNub == 500) {
        this.$store.commit('changeFlag',['publishTrans',false]);
      } else {
        //关闭评论层时的提示框
        MessageBox({
          title: '放弃当前的评论?',
          showConfirmButton:true,
          showCancelButton: true,
          confirmButtonText: '放弃',
          closeOnClickModal: false
        }).then(action => {
          if (action == 'confirm') {
          //确定关闭评论层，并且重置评论框样式
            this.text = '';
            this.textNub = 500;
            this.active = false;
            this.color = false;
            this.$store.commit('changeFlag',['publishTrans',false]);
            this.$store.commit('changeFlag',['publishTrans',false]);
          } else {
            //取消关闭评论层，焦点回到评论输入框
            let textarea = document.querySelector('.publish textarea');
            textarea.focus();
          }
        });
      }
    },
    changeVal() {
    //当评论框已输入内容和未输入内容时的按钮样式以及字数提示  
      this.textNub = 500 - this.text.length;
      if(this.textNub < 500) {
        this.active = true;
      } else {
        this.active = false;
      }
      if(this.textNub < 0) {
      //评论超过字数限制时字数提示变红  
        this.color = true;
      } else {
        this.color = false;
      }
    },
    publish() {
    //发表评论  
      if(!this.active) {
      //如果尚未填写内容，无法发表评论  
        Toast({
          message: '无法发送空内容',
          position: 'middle',
          duration: 666,
          className: 'collectHint'
        });
      } else if(this.textNub < 0) {
        //如果超过字数限制，无法发表评论
        Toast({
          message: '内容超过字数限制',
          position: 'middle',
          duration: 666,
          className: 'collectHint'
        });
      } else {
        //否则发表评论成功
        Toast({
          message: '发布成功',
          position: 'middle',
          duration: 666,
          className: 'collectHint'
        })
        this.$store.commit('addComment',{
        //评论数据列表添加发表的评论 
          content:this.text,
          created_at:getTime("y-m-d h:i:s"),
          praisenum:0,
          touser:null,
          user:{
            user_name:this.user,
            web_url: photo
          }  
        });
        setTimeout(() => {
        //评论发表成功后重置评论框样式
          this.text = '';
          this.textNub = 500;
          this.active = false;
          this.color = false;
          this.$store.commit('changeFlag',['publishTrans',false]);
          //并且关闭评论层  
        },700)        
      }
    },
    loadMore() {
    //下拉加载更多评论，根据下拉是否还有新的评论信息来更改提示信息
      if(this.content_type != 'hp') {
      //图文没有评论，在详情页内容不是图文时才进行以下操作
        if(this.moreComment.length == 0) {
          this.pullTxt = '已经全部加载完毕';
        } else {
          this.pullTxt = "正在加载更多数据...";
        }
        this.$store.dispatch('getMoreComment',[this.content_type,this.content_id,this.commentlist.data[this.length].id]).then(() => {   
        //请求更多评论数据   
          setTimeout(() => {
            this.$refs.detailScroll.refresh();
            //初始化详情页scroll
            if(this.moreComment.length == 0) {
            //根据下拉是否还有新的评论信息来更改提示信息  
              this.pullTxt = '已经全部加载完毕';
            } else {
              this.pullTxt = "↓ 松开立即加载更多";
            }
          },200)
        });
      }
    }
  } 
}

</script>
<style type="text/css">
.detail .wrapper {
  top: .89rem;
  background: #fff;
} 
.detail .loading {
  width: 100%;
  height: .26rem;
  font-size: .26rem;
  line-height: 1;
  font-weight: bold;
  color: #5a5a5a;
  text-align: center;
  background: rgba(0,0,0,0);
}
.detail .publishTrans {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.2);
  z-index: 1000;
}
.publish {
  height: 1.99rem;
  border-bottom: .01rem solid #e6e6e6;
  margin-top: 2.6rem;
  background: #fff;
  padding: .4rem .52rem .29rem;
  box-sizing: border-box;
}
.publish textarea {
  width: 100%;
  height: 100%;
  resize: none;
  font: .24rem/.4rem "微软雅黑";
  color: #333;
}
.publishTrans p {
  width: 100%;
  height: 1rem;
  background: #fff;
  position: relative;
  text-indent: .4rem;
  font-size: .26rem;
  line-height: 1rem;
  color: #aaa;
}
.publishTrans p.active {
  color: #f00;
}
.publishTrans p button {
  position: absolute;
  top: .2rem;
  right: .4rem;
  width: .96rem;
  height: .6rem;
  border-radius: 0.05rem;
  font-size: .26rem;
  line-height: .6rem;
  color: #5e5e5e;
  background: #d8d8d8;
}
.publishTrans button.active {
  background: #fff;
  border: .01rem solid #808080;
  line-height: .58rem;
}
.mint-msgbox {
  width: 5.4rem;
  height: 2.1rem;
  border-radius: .25rem;
}
.mint-msgbox-header {
  padding: 0;
}
.mint-msgbox-title {
  height: 1.2rem;
  font-size: .32rem;
  line-height: 1.2rem;
  color: #000;
  border-bottom: .01rem solid #d9d9de;
}
.mint-msgbox-btn {
  width: 2.7rem;
  height: .88rem;
  font-size: .32rem;
  line-height: .88rem;
}
.mint-msgbox-cancel  {
  color: #007aff;
}
.mint-msgbox-confirm  {
  color: #ff3b30;
}
.v-modal {
  background: rgba(0,0,0,.2);
}
.collectHint {
  border-radius: .1rem;
  background: rgba(0,0,0,.6);
  z-index: 1001;
}
.collectHint .mint-toast-text {
  font-size: .26rem;
  line-height: .94rem;
  margin: 0 .3rem;
}
::-webkit-scrollbar {  
  width: .05rem;  
  height: .2rem;  
  background-color: #fff;  
}
::-webkit-scrollbar-thumb {  
  border-radius: 30%;  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
  background-color: rgba(0,0,0,.3);  
}
</style>