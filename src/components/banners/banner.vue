<template>
	<div class="banner">
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
		<scroll :style="{backgroundColor: bannerMsg.bg_color}" :pullup="pullup" @scrollToEnd="loadMore" ref="bannerScroll">
			<div>
				<banner-content></banner-content>
				<content-comment></content-comment>
				<div class="loading">{{pullTxt}}</div>
			</div>
		</scroll>	
		<content-footer></content-footer>
	</div>
</template>

<script type="text/javascript">
import BannerContent from '@/components/banners/banner-content'
import ContentComment from '@/components/contents/content-comment'
import ContentFooter from '@/components/contents/content-footer'
import scroll from '@/components/scroll'
import {mapState} from 'vuex'
import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui';
import {getTime} from '@/function/getTime.js'
import photo from '@/assets/img/photo.png'
  
export default {
	name: 'Banner',
	components: {
		BannerContent,
    ContentComment,
    ContentFooter,
    scroll
  },
  data() {
  	return {
  		banner_id: '',
  		//专题页面id
  		pullup: true,
  		//允许scroll底部上拉事件
  		pullTxt: '↓ 松开立即加载更多',
  		//底部上拉提示信息
  		textNub: 500,
  		//评论文本输入框字数提示
      text: '',
      //评论内容
      active: false,
      //发表按钮样式
      color: false
      //字数提示样式
  	}
  },
	mounted() {
		this.banner_id = this.$route.query.id;
		//路由query传递参数
		this.$store.commit('changeFlag',['loading',true]);
    //loading...
		this.$store.dispatch('getBannerMsg',this.banner_id).then(() => {
		//请求专题内容数据	
			this.$store.dispatch('getBannerComment',this.banner_id);
			//请求专题评论数据
		}).then(() => {
      setTimeout(() => {
        this.$refs.bannerScroll.refresh();
        this.$store.commit('changeFlag',['loading',false]);
      },500)
    });
	},
	computed: mapState({
  	loading: state => state.flag.loading,
    //loading状态是否存在
    bannerMsg: state => state.bannerMsg,
    //专题详细信息
    publishTrans: state => state.flag.publishTrans,
    //评论遮罩层的开关
    user: state => state.user,
    //是否登录
    commentlist: state => state.commentlist,
    //评论数据
    moreComment: state => state.moreComment
    //更多评论数据
  }),
  methods: {
  	loadMore() {
    //下拉加载更多评论，根据下拉是否还有新的评论信息来更改提示信息
      if(this.moreComment.length == 0) {
        this.pullTxt = '已经全部加载完毕';
      } else {
        this.pullTxt = "正在加载更多数据...";
      }
      this.$store.dispatch('getMoreComment',['topic',this.banner_id,this.commentlist.data[this.commentlist.data.length - 1].id]).then(() => {   
      //请求更多评论数据   
        setTimeout(() => {
          this.$refs.bannerScroll.refresh();
          //初始化专题页scroll
          if(this.moreComment.length == 0) {
          //根据下拉是否还有新的评论信息来更改提示信息  
            this.pullTxt = '已经全部加载完毕';
          } else {
            this.pullTxt = "↓ 松开立即加载更多";
          }
        },200)
      });
    },
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
    }
  }
}	

</script>
<style>
.banner .loading {
  width: 100%;
  height: .26rem;
  font-size: .26rem;
  line-height: 1;
  font-weight: bold;
  color: #5a5a5a;
  text-align: center;
  background: rgba(0,0,0,0);
}	
.banner .publishTrans {
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
</style>