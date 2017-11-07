<template> 
  <div class="content-comment" :style="{backgroundColor: bannerMsg.bg_color,color: bannerMsg.font_color}">
    <h3 :style="{borderColor: bannerMsg.font_color}">评论</h3>
    <ul class="hotComment">
      <li v-for="(item,index) in commentlist.data" class="commentLis" v-if="index <= 7" :style="{borderColor: bannerMsg.bg_color}">
        <h4>
          <img :src="item.user.web_url">
          <span :style="{color: bannerMsg.font_color}">{{item.user.user_name}}</span>
          <span :style="{color: bannerMsg.font_color}">{{item.created_at | setDate('y.m.d h:i')}}</span>
        </h4>
        <p v-if="item.touser != null" class="quote" :style="{color: bannerMsg.font_color,borderColor: bannerMsg.bg_color}">{{item.touser.user_name}}：{{item.quote}}</p>
        <p :style="{color: bannerMsg.font_color}">{{item.content}}</p>
        <nav>
          <span @click="changePraisenum(item)" :class="{active: praisenum(item)}" :style="{color: bannerMsg.font_color}">{{item.praisenum}}</span>
        </nav>
      </li>
      <div class="cut" :style="{backgroundColor: bannerMsg.font_color}">
        <span :style="{backgroundColor: bannerMsg.bg_color,color: bannerMsg.font_color}">以上是热门评论</span>
      </div>
    </ul>
    <ul class="generalComment">
      <li v-for="(item,index) in commentlist.data" class="commentLis" v-if="index > 7" :style="{borderColor: bannerMsg.bg_color}">
        <h4>
          <img :src="item.user.web_url">
          <span :style="{color: bannerMsg.font_color}">{{item.user.user_name}}</span>
          <span :style="{color: bannerMsg.font_color}">{{item.created_at | setDate('y.m.d h:i')}}</span>
        </h4>
        <p v-if="item.touser != null" class="quote" :style="{color: bannerMsg.font_color,borderColor: bannerMsg.bg_color}">{{item.touser.user_name}}：{{item.quote}}</p>
        <p :style="{color: bannerMsg.font_color}">{{item.content}}</p>
        <nav>
          <span @click="changePraisenum(item)" :class="{active: praisenum(item)}" :style="{color: bannerMsg.font_color}">{{item.praisenum}}</span>
        </nav>
      </li>
    </ul>
  </div>
</template>    

<script type="text/javascript">
import setDate from '@/function/setDate.js'
import {mapState} from 'vuex'

export default {
  filters: {
    setDate
  },
  computed: mapState({
    commentlist: state => state.commentlist,
    //评论信息
    likeList: state => state.likeList,
    //已点赞列表
    bannerMsg: state => state.bannerMsg
    //专题详细信息
  }),
  methods: {
    praisenum(item) {
      if(this.likeList.indexOf(item.id) != -1) {
      //判断点赞列表中是否存在此评论  
        return true;
      } else {
        return false;
      }
    },
    changePraisenum(item) {
      if(this.likeList.indexOf(item.id) == -1) {
        this.$store.commit('like',item.id);
        item.praisenum ++;
        //如果点赞列表中不存在此评论,就加入点赞列表
      } else {
        this.$store.commit('cancelLike',item.id);
        item.praisenum --;
        //如果已经存在此评论,就从点赞列表中删除
      }
    }
  }
} 

</script>

<style type="text/css">
.content-comment {
  background: #fff;
  position: relative;
  padding: 1.03rem .41rem 1.3rem;
}
.content-comment h3 {
  width: 1.2rem;
  height: .84rem;
  position: absolute;
  top: 0;
  left: .41rem;
  font-size: .26rem;
  line-height: .84rem;
  border-bottom: .08rem solid #000;
}  
.hotComment,
.generalComment {
  padding-bottom: .2rem;
  position: relative;
}
.hotComment li:last-of-type,
.generalComment li:last-of-type {
  border-bottom: none;
}
.commentLis {
  border-bottom: .02rem solid #ebebeb;
}
.commentLis h4 {
  position: relative;
  height: 1.03rem;
}
.commentLis h4 img {
  position: absolute;
  top: .32rem;
  left: 0;
  width: .4rem;
  height: .4rem;
  border-radius: 50%;
}
.commentLis h4 span {
  position: absolute;
  top: 0;
  height: 1.03rem;
  line-height: 1.03rem;
  color: #979797;
}
.commentLis h4 span:nth-of-type(1) {
  width: 2.88rem;
  left: .59rem;
  font-size: .28rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.commentLis h4 span:nth-of-type(2) {
  width: 2.1rem;
  right: 0;
  font-size: .26rem;
}
.commentLis p {
  font-size: .28rem;
  line-height: .48rem;
  color: #333;
  padding: 0 .14rem 0 .4rem;
}
.commentLis .quote {
  border: .02rem solid #ebebeb;
  padding: .1rem .19rem .1rem;
  margin: .09rem 0 .3rem .4rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.commentLis nav {
  height: .84rem;
  position: relative;
}
.commentLis nav span {
  position: absolute;
  top: 0;
  height: .84rem;
  font-size: .2rem;
  line-height: .84rem;
  color: #666;
}
.commentLis nav span:nth-of-type(1) {
  text-indent: .73rem;
  width: 1.35rem;
  right: .2rem;
  background: url("../../assets/img/sprite.png") -3.13rem -7.1rem no-repeat;
  background-size: 10rem 15rem;
}
.commentLis nav span:nth-of-type(1).active {
  background: url("../../assets/img/sprite.png") -5.65rem -11.88rem no-repeat;
  background-size: 10rem 15rem;
}
.hotComment .cut {
  position: absolute;
  left: -.41rem;
  bottom: 0;
  width: 6.4rem;
  height: .02rem;
  background: #ebebeb;
}
.hotComment .cut span {
  position: absolute;
  top: -.12rem;
  left: 2.16rem;
  width: 2.08rem;
  height: .24rem;
  font-size: .24rem;
  line-height: 1;
  color: #979797;
  background: #fff;
  text-align: center;
}
</style>