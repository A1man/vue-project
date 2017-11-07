<template>
	<div class="m-footer">
      <nav>
        <span @click="goIndex" :class="{active: index}"></span>
        <span @click="goAll" :class="{active: all}"></span>
        <span @click="goMine" :class="{active: me}"></span>
      </nav>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      index: state => state.flag.index,
      all: state => state.flag.all,
      me: state => state.flag.me
      //每个主页面的footer图标
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
    goIndex() {
    //跳转到首页
      this.$store.commit('prevPage','');
      this.$store.commit('changeFlag',['index',true]);
      this.$store.commit('changeFlag',['all',false]);
      this.$store.commit('changeFlag',['me',false]);
      this.$router.push({name: 'Index'});
    },
    goAll() {
    //跳转到all页面
      this.$store.commit('prevPage','');
      this.$store.commit('changeFlag',['index',false]);
      this.$store.commit('changeFlag',['all',true]);
      this.$store.commit('changeFlag',['me',false]);
      this.$router.push({name: 'All'});

      this.closeMusic();
      //关闭首页音乐模块播放
    },
    goMine() {
    //跳转到me页面
      this.$store.commit('changeFlag',['index',false]);
      this.$store.commit('changeFlag',['all',false]);
      this.$store.commit('changeFlag',['me',true]);
      this.$router.push({name: 'MineIndex'});

      this.closeMusic();
      //关闭首页音乐模块播放
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
.m-footer {
  width: 100%;
  height: .98rem;
  border-top: .01rem solid #a7a7a7;
  background: #fefefe;
  position: fixed;
  left: 0;
  bottom: 0;
}
.m-footer nav {
  height: .98rem;
  overflow: hidden;
}
.m-footer nav span {
  display: block;
  float: left;
  width: 33.3%;
  height: .98rem;
}
.m-footer nav span:nth-of-type(1) {
  background: url("../../assets/img/sprite.png") 0 -4.16rem no-repeat;
  background-size: 10rem 15rem;
}
.m-footer span:nth-of-type(1).active {
  background: url("../../assets/img/sprite.png") -2.13rem -4.16rem no-repeat;
  background-size: 10rem 15rem;
}
.m-footer nav span:nth-of-type(2) {
  background: url("../../assets/img/sprite.png") 0 -5.14rem no-repeat;
  background-size: 10rem 15rem;
}
.m-footer span:nth-of-type(2).active {
  background: url("../../assets/img/sprite.png") -2.13rem -5.14rem no-repeat;
  background-size: 10rem 15rem;
}
.m-footer nav span:nth-of-type(3) {
  background: url("../../assets/img/sprite.png") 0 -6.12rem no-repeat;
  background-size: 10rem 15rem;
}
.m-footer span:nth-of-type(3).active {
  background: url("../../assets/img/sprite.png") -2.13rem -6.12rem no-repeat;
  background-size: 10rem 15rem;
}
</style>

