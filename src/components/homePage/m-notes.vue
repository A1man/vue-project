<template>
	<div class="m-notes" v-if="notes">
    <img :src="notes.img_url" @click="changeShow">
    <span class="title">{{notes.title}} | {{notes.pic_info}}</span>
    <p>{{notes.forward}}</p>
    <span>{{notes.words_info}}</span>
    <nav>
      <span @click="gotoAddress({path: '/detail',query:{type:type[notes.content_type],id:notes.content_id}})"></span>
      <span :class="{active: like}" @click="changeLike">{{notes.like_count}}</span>
      <span :class="{active: collect}" @click="changeCollect()"></span>
      <span @click="transpond"></span>
    </nav>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  computed: {
    ...mapState({
      notes: state => state.onelist.content_list[0],
      //首页图文数据
      collectHp: state => state.mine_collect.hp.list,
      //图文收藏数据
      user: state => state.user,
      //是否已登录
      type: state => state.type,
      //one内容类型
      likeList: state => state.likeList
      //点赞列表数据
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
    collect() {    
    //返回计算属性collect判断收藏状态
      if(JSON.stringify(this.collectHp).indexOf(JSON.stringify({type:this.notes.content_type, id:this.notes.content_id, img:this.notes.img_url, vol:this.notes.volume, date:this.notes.post_date, forward:this.notes.forward})) != -1) {  
      //根据在collectHp中是否存在本篇数据判断是否已被收藏
        return true;
      } else {
        return false;
      }
    },
    //返回计算属性like判断点赞状态
    like() {
      if(this.likeList.indexOf(this.notes.content_id) != -1) {  
      //根据在likeList中是否存在本篇id判断是否已点赞
        return true;
      } else {
        return false;
      }
    }  
  },
  methods: {
    changeShow() {
      this.$store.commit('changeFlag',['tarnsShow',true]);  
      //改变state.flag中的tarnsShow开关为了控制m-notes组件中的图片点击动画
    },    
    changeLike() {        
    //点赞处理
      if(!this.like) {
      //当this.like是false说明没被点赞
        this.$store.commit('like',this.notes.content_id);
        this.notes.like_count ++;
        //将本篇加入点赞列表
      } else {
        this.$store.commit('cancelLike',this.notes.content_id);
        this.notes.like_count --;
        //将本篇从已点赞列表中删除
      }
    },
    changeCollect() {     
    //收藏处理
      if(this.user=='') {                         
      //此时未登录
        this.closeMusic();
        //关闭首页音乐模块播放
        this.$store.commit('prevPage','index');
        //记录在跳转到登录页面之前所在属于index页面
        this.$router.push({name: 'MineIndex'});   
        //跳转到登录页面
        this.$store.commit('changeFlag',['me',true]);   
        this.$store.commit('changeFlag',['index',false]);   
        return;
      } else {                    
      //否则就说明此时已经登陆,继续操作         
          if(!this.collect) {     
          //当this.collect是false说明此时没被收藏
          Toast({                 
          //弹出提示框提示收藏成功
            message: '已收藏',
            position: 'middle',
            duration: 666,
            className: 'collectHint'
          });
          this.$store.commit('collect',['hp',{type:this.notes.content_type, id:this.notes.content_id, img:this.notes.img_url, vol:this.notes.volume, date:this.notes.post_date, forward:this.notes.forward}]);   
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
          this.$store.commit('cancelCollect',['hp',{type:this.notes.content_type, id:this.notes.content_id, img:this.notes.img_url, vol:this.notes.volume, date:this.notes.post_date, forward:this.notes.forward}]);    
          //将本篇从图文收藏列表中去除
        }
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
    gotoAddress(path) {
      this.closeMusic();
      //关闭首页音乐模块播放
      this.$store.commit('prevPage','index');
      //记录是从index页面进入的详情页                               
      this.$router.push(path);   
      //跳转页面
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
.m-notes {
  background: #fff;
  text-align: center;
  position: relative;
}
.m-notes img {
	width: 100%;
	height: auto;
	margin-bottom: .23rem;
}	
.m-notes span {
  display: block;
  height: .24rem;
  font-size: .24rem;
  line-height: 1;
  color: #a6a6a6;
  margin-bottom: .49rem;
}
.m-notes span.title {
  padding: 0 .88rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.m-notes span:nth-of-type(2) {
  margin-bottom: .58rem;
}
.m-notes p {
	font-size: .26rem;
  line-height: .56rem;
  color: #333;
  margin: 0 .88rem .51rem;
  text-align: left;
}
.m-notes nav {
  height: .82rem;
  overflow: hidden;
}
.m-notes nav span {
  float: left;
  height: .82rem;
  line-height: .82rem;
  margin-bottom: 0;
}
.m-notes nav span:nth-of-type(1) {
  width: 1.25rem;
  margin-left: .51rem;
  background: url("../../assets/img/sprite.png") 0 0rem no-repeat;
  background-size: 10rem 15rem;
}
.m-notes nav span:nth-of-type(2) {
  width: .78rem;
  margin-left: 1.89rem;
  background: url("../../assets/img/sprite.png") 0 -.82rem no-repeat;
  background-size: 10rem 15rem;
  font-size: .18rem;
  line-height: 1;
  color: #b9b9b9;
  padding: .18rem 0 0 .32rem;
  box-sizing: border-box;
}
.m-notes nav span:nth-of-type(2).active {
  background: url("../../assets/img/sprite.png") -4.48rem -7.98rem no-repeat;
  background-size: 10rem 15rem;
}
.m-notes nav span:nth-of-type(3) {
  width: .78rem;
  background: url("../../assets/img/sprite.png") 0 -1.64rem no-repeat;
  background-size: 10rem 15rem;
}
.m-notes nav span:nth-of-type(3).active {
  background: url("../../assets/img/sprite.png") -5.48rem -7.98rem no-repeat;
  background-size: 10rem 15rem;
}
.m-notes nav span:nth-of-type(4) {
  width: .99rem;
  margin-left: .2rem;
  background: url("../../assets/img/sprite.png") 0 -2.46rem no-repeat;
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