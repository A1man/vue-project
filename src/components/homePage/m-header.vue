<template>
  <div class="m-header">
    <h1>{{onelist.date | setDate('y / m / d')}}</h1>
    <p>
      <span>{{onelist.weather.city_name}}</span>
      <span>{{onelist.weather.climate}}</span>
      <span>{{onelist.weather.temperature}}°C</span>
    </p>
    <div class="today" v-if="!today" @click="backNow"></div>
    <div class="pulldown"  @click="pulldown">
      <span class="icon" ref="menuIcon"></span>
    </div>
  </div>
</template>

<script type="text/javascript">
import setDate from '@/function/setDate.js'
import { mapState } from 'vuex'
import {changeTime} from '@/function/changeTime.js'

export default {
  //管道符方法注册
  filters: {
    setDate
  },
  created() {
    if(this.nowDate == '') {
    //刚打开页面时如果nowDate为空
      let time = new Date().getHours();
      if(time < 6) {    
      //因为在早晨6点之前还拿不到今天的数据，所以依然渲染前一天的数据
        this.$store.commit('setDate',changeTime(-1));     
        //设置vuex中当前时间为前一天
      } else {
        this.$store.commit('setDate',changeTime(0));     
        //设置vuex中当前时间为今天
      }
    }
  },
  computed: {
    ...mapState({
      onelist: state => state.onelist,
      //首页数据
      refresh: state => state.refresh,
      //scroll初始化方法
      nowDate: state => state.nowDate,
      //数据所属时间
      isMenu: state => state.flag.isMenu,
      //头目录是否展开
      loading: state => state.flag.loading
      //loading状态是否存在
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
    today() {
    //判断当前首页数据是不是今天的数据
      let nowTime;
      let time = new Date().getHours();
      if(time < 6) {    
        nowTime = changeTime(-1);
      } else {
        nowTime = changeTime(0);     
      }
      //早上六点之前仍以前一天数据为准
      if(changeTime(0,this.nowDate) == nowTime) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    backNow() {
    //请求并渲染今天的首页数据  
      this.closeMusic();
      //关闭首页音乐模块播放

      let time = new Date().getHours();
      if(time < 6) {    
      //因为在早晨6点之前还拿不到今天的数据，所以依然渲染前一天的数据
        this.$store.commit('setDate',changeTime(-1));      
        //设置vuex里当前时间为前一天
      } else {
        this.$store.commit('setDate',changeTime(0));      
        //设置vuex里当前时间为今天
      }
      this.$store.commit('changeFlag',['menuShow',false]);
      //收起首页中部目录
      this.$store.commit('changeFlag',['isMenu',false]);
      this.$refs.menuIcon.style.transform = 'rotate(0)';
      //收起首页头目录
      this.$store.commit('openTime',{openY: new Date().getFullYear()+' 年',openM: new Date().getMonth()+1+' 月'});
      //更新首页日期选择器选中日期为最新日期
      this.$store.dispatch('getOnelist',this.nowDate).then(()=> {
        setTimeout(() => {
          this.refresh();
        },200)
      });
      //请求今天的首页数据
    },
    pulldown() {
      this.closeMusic();
      //关闭首页音乐模块播放

      if(!this.isMenu) {
        this.$store.commit('changeFlag',['loading',true]);
        //loading...
        this.$refs.menuIcon.style.transform = 'rotate(-180deg)';
        this.$store.commit('changeFlag',['isMenu',true]);
        //展开头目录
        this.$store.dispatch('getHeaderMenu',this.onelist.date).then(()=> {
        //请求头目录数据  
        setTimeout(() => {
          this.refresh();
          this.$store.commit('changeFlag',['loading',false]);
        },200);
        //在获取到头目录数据之后延迟200ms,loading状态消失
        }); 
      } else {
        this.$refs.menuIcon.style.transform = 'rotate(0)';
        this.$store.commit('changeFlag',['loading',false]);
        //loading状态消失
        this.$store.commit('changeFlag',['isMenu',false]);
        //收起头目录
        this.$store.commit('openTime',{openY: new Date().getFullYear()+' 年',openM: new Date().getMonth()+1+' 月'});
        //更新首页日期选择器选中日期为最新日期
      }
      setTimeout(() => {
        this.refresh();
      },200)
      //初始化scroll
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
.m-header {
  border-bottom: .01rem solid #f3f3f3; 
  padding: .27rem 0 .23rem 0;
  box-sizing: border-box;
  background: #fff;
  text-align: center;
  width: 100%;
  height: 1.3rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.m-header h1 {
  font: .4rem/1 "Courier New";
  color: #000;
  margin-bottom: .15rem;
}
.m-header p {
  height: .2rem;
}
.m-header .today {
  width: 1rem;
  height: .8rem;
  position: absolute;
  top: .25rem;
  left: .3rem;
  background: url("../../assets/img/sprite.png") -3.71rem -11.88rem no-repeat;
  background-size: 10rem 15rem;
}
.m-header span {
  display: inline-block;
  vertical-align: top;
  font-size: .2rem;
  line-height: 1;
  color: #3e3e3e;
}
.m-header .pulldown {
  width: 2rem;
  height: 1rem;
  position: absolute;
  top: .3rem;
  left: 2.2rem;
}
.m-header .pulldown .icon {
  width: .16rem;
  height: .08rem;
  position: absolute;
  bottom: .08rem;
  left: .92rem;
  background: url("../../assets/img/sprite.png") -3.39rem -11.88rem no-repeat;
  background-size: 10rem 15rem;
  transition: .3s;
}
</style>
