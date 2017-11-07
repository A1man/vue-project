<template>
	<div class="m-menu">
      <h2 @click="change()">
        一个&nbsp;&nbsp;VOL.{{menu.vol}}
        <img src="../../assets/img/logo1.png" :class="{openIcon: menuShow}">
      </h2>
      <ul class="list" ref="menu" :class="{active: !menuShow}">
        <li v-for="(item,index) in contentList" v-if="index > 0 && item.content_type != 6" @click="gotoAddress({path: '/detail',query:{type:type[item.content_type],id:item.content_id}})">
          <h3 v-if="item.tag_list[0]">{{item.tag_list[0].title}}</h3>
          <h3 v-else>{{item.share_list.wx.title | strSplit(' | ',0)}}</h3>
          <p>{{item.title}}</p>
        </li>
      </ul>
  </div>
</template>

<script type="text/javascript">
import strSplit from '@/function/strSplit.js'  
import { mapState } from 'vuex'

export default {
  filters: {
    strSplit
  },
  computed: {
    ...mapState({
      menu: state => state.onelist.menu,
      //首页目录数据
      contentList: state => state.onelist.content_list,
      //首页主要内容数据
      type: state => state.type,
      //one内容类型
      refresh: state => state.refresh,
      //scroll初始化方法
      menuShow: state => state.flag.  menuShow
      //判断首页目录是否已展开
    }),
    rotate: {
    //音乐CD旋转角度  
      get: function() {
        return this.$store.state.rotate;
      },
      set: function(newValue) {
        this.$store.commit('setRotate',{rotate:newValue,bannerRotate:0});
      }
    }
  },
  methods: {
    gotoAddress(path) {
      this.$store.commit('prevPage','index');
      //记录是从index页面进入的详情页
      this.$router.push(path);
      //路由跳转
      let media = document.querySelector('#media');
      let cover = document.querySelector('.m-content .musicCover');
      if(media && cover) {
        media.load(); 
        //重新加载音频
        this.$store.commit('changeFlag',['musicPlay',false]);
        //音乐停止播放,更改图标
        this.rotate = 0;
        cover.style.transform = "rotate(" + this.rotate + "deg)";
        //CD旋转角度归零
        this.$store.commit('clearTimer');
        //清除定时器
      }
    },
    change() {
    //首页中部目录展开收起 
      if(!this.menuShow) {
        this.$refs.menu.style.height = this.menu.list.length*1.3 + 'rem';
        this.$refs.menu.style.paddingTop = '.33rem';
        this.$refs.menu.style.paddingBottom = '.28rem';
        this.$store.commit('changeFlag',['menuShow',true]);
      } else {
        this.$store.commit('changeFlag',['menuShow',false]);
      }
      setTimeout(() => {
        this.refresh();
        //初始化scroll
      },500)
    }
  }
}	

</script>

<style type="text/css">
.m-menu {
  margin: .1rem 0 .1rem 0;
  width: 100%;
}
.m-menu h2 {
  width: 100%;
  height: .8rem;
  font-size: .26rem;
  line-height: .8rem;
  color: #808080;
  background-color: #fff;
  text-align: center;
  position: relative;
}	
.m-menu h2 img {
  width: .18rem;
  height: .1rem;
  position: absolute;
  top: 0.35rem;
  right: 1.89rem;
  transition: .3s;
}
.m-menu h2 .openIcon {
  transform: rotate(-180deg);
}
.m-menu .list {
  padding: 0;
  background: #fff;
  overflow: hidden;
  height: 0;
  transition: .5s;
}
.m-menu .list.active {
  height: 0 !important;
  padding: 0 !important;
}
.m-menu .list li {
  margin-bottom: .42rem;
  padding: 0 .78rem 0 .81rem;
  background: url("../../assets/img/sprite.png") 0 -3.28rem no-repeat;
  background-size: 10rem 15rem;
}
.m-menu .list h3 {
  height: .48rem;
  font-size: .24rem;
  line-height: .48rem;
  color: #333;
}
.m-menu .list p {
  height: .4rem;
  font-size: .26rem;
  line-height: .4rem;
  color: #333;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>