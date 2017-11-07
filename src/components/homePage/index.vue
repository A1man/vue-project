<template>
  <div id="index">
    <ring-loader :loading="loading"></ring-loader>
    <m-header ref="mHeader"></m-header>
    <scroll ref="scroll" v-if="isMenu" :class = "{isMenu:isMenu}">
      <div>       
        <div class="headerMenu">
          <h2>
            <span v-if="headerMenu[0]">{{headerMenu[0].date | setDate('m月')}}</span>
          </h2>
          <ul v-if="new Date().getHours()>6">
          <!-- 因为one在凌晨六点前请求不到当天的数据，所以做此判断 --> 
            <li v-for="(item,index) in headerMenu" @click="gotoAddress(item)" class="headerMenulis" :class="{active: item.cover==notes.img_url}">
              <img :src="item.cover">
              <p>{{item.date | setDate('y / m / d')}}</p>
            </li>
          </ul> 
          <ul v-else>
            <li v-for="(item,index) in headerMenu" v-if="index>0" @click="gotoAddress(item)" class="headerMenulis" :class="{active: item.cover==notes.img_url}">
              <img :src="item.cover">
              <p>{{item.date | setDate('y / m / d')}}</p>
            </li>
          </ul>      
        </div>
      </div>
    </scroll>       
    <scroll ref="scroll" :pulldown="pulldown" @pulldown="loadData" v-else>
      <div>
        <div class="loading" v-show="show">正在刷新数据中...</div>
        <m-notes></m-notes>
        <m-menu></m-menu>
        <m-content></m-content>
      </div>
    </scroll>

    <div v-if="isMenu">
      <h3 class="footerMenu" @click="openPicker" v-if="headerMenu[0]">{{headerMenu[0].date | setDate('y 年 m 月')}}</h3>
      <div class="shade"  @click="closePicker"></div>
      <mt-picker :slots="slots" :itemHeight="72" :visibleItemCount="3" @change="onValuesChange" ref="picker" :showToolbar="true">
        <div class="title">选择日期</div>
      </mt-picker>
      <h3 class="confirm" @click="confirm">确定</h3>
    </div>
    <m-footer v-else></m-footer>

    <transition name="tarns-fade">
      <div class="tarns" v-if="tarnsShow" @click="changeShow">
        <h3>{{notes.volume}}</h3>
        <img :src="notes.img_url" @click.stop>
        <p>{{notes.title}} | {{notes.pic_info}}</p>
      </div>
    </transition>  
  </div>
</template>

<script>
import MHeader from '@/components/homePage/m-header'
import MNotes from '@/components/homePage/m-notes'
import MMenu from '@/components/homePage/m-menu'
import MContent from '@/components/homePage/m-content'
import MFooter from '@/components/homePage/m-footer'
import scroll from '@/components/scroll'
import { mapState } from 'vuex'
import {changeTime} from '@/function/changeTime.js'
import setDate from '@/function/setDate.js'

export default {
  filters: {
    setDate
  },
  data() {
    return {
      pulldown: true,
      //scroll组件开启顶部下拉事件 
      show: false,
      //下拉刷新状态是否存在
      slots: [
        {
          flex: 1,
          values: ['2017 年', '2016 年', '2015 年', '2014 年', '2013 年', '2012 年'],
          className: 'slot1',
          textAlign: 'center'
        }, 
        {
          flex: 1,
          values: ['12 月', '11 月', '10 月', '9 月', '8 月', '7 月','6 月','5 月','4 月','3 月','2 月','1 月'],
          className: 'slot2',
          textAlign: 'center'
        }
      ],
      //picker数据
      values: '',
      //选择的时间
      prevValue: ''
      //上一次选中的年份,
    }
  },
  components: {
    MHeader,
    MNotes,
    MMenu,
    MContent,
    MFooter,
    scroll
  },
  created() {

  },
  mounted() {
    this.$store.commit('changeFlag',['index',true]);
    //改变state.flag中的index开关为了控制m-footer组件中的当前页图标active
    this.$store.commit('changeFlag',['loading',true]);
    //loading...
    this.$store.commit('refresh',this.$refs.scroll.refresh);
    //把首页里scroll组件的refresh方法传给vuex 
    this.$store.dispatch('getOnelist','this.nowDate').then(() => {
    //获取首页数据  
      setTimeout(() => {
        this.$store.commit('changeFlag',['loading',false]);
      },500)
      //在获取到首页数据之后延迟500ms，loading状态消失
    });
  },
  computed: mapState({
    onelist: state => state.onelist,
    //首页数据
    nowDate: state => state.nowDate,
    //数据所属时间
    tarnsShow: state => state.flag.tarnsShow,
    //判断notes组件图片是否点开的开关
    notes: state => state.onelist.content_list[0],
    //首页图文数据
    headerMenu: state => state.headerMeun,
    //头目录数据
    isMenu: state => state.flag.isMenu,
    //判断头目录是否展开的开关
    refresh: state => state.refresh,
    //scroll初始化方法
    openY: state => state.openY,
    //打开日期选择器时的选中年份
    openM: state => state.openM,
    //打开日期选择器时的选中月份
    loading: state => state.flag.loading
    //loading状态是否存在
  }),
  methods: {
    changeShow() {
      this.$store.commit('changeFlag',['tarnsShow',false]);       
      //改变state.flag中的tarnsShow开关为了控制notes组件中的图片点击动画
    },
    loadData() {                                                          
    //顶部下拉刷新
      this.show = true;
      this.$store.dispatch('getOnelist',this.nowDate).then(() => {      
      //重新获取首页数据后延迟500ms初始化scroll,刷新状态消失
        setTimeout(() => {
          this.refresh();
          this.show = false;
        },500)
      });
    },
    openPicker() {
    // 展开日期选择器
      this.$refs.picker.setSlotValue(0, this.openY);
      this.$refs.picker.setSlotValue(1, this.openM);
      //设置每次打开日期选择器时的选中日期
      let shade = document.querySelector('#index .shade');
      let picker = document.querySelector('#index .picker');
      let confirm = document.querySelector('#index .confirm');
      shade.style.display = "block";
      picker.style.height = "4.8rem";
      confirm.style.height = ".99rem";
      confirm.style.borderTop = ".01rem solid #e3e3e3";
    },
    closePicker() {
    // 关闭日期选择器  
      let shade = document.querySelector('#index .shade');
      let picker = document.querySelector('#index .picker');
      let confirm = document.querySelector('#index .confirm');
      shade.style.display = "none";
      picker.style.height = "0";
      confirm.style.height = "0";
      confirm.style.borderTop = "none";
    },
    onValuesChange(picker, values) {
    //日期选择器选中的值发生变化时触发的change事件
      let index;
      if(picker.getSlotValues(1)) {
        for(let i = 0; i< picker.getSlotValues(1).length;i++) {
          if(picker.getSlotValues(1)[i] == values[1]) {
            index = i;
          }
        }
      }
      //声明index记录每次选中的月份在当前月份数组的下标

      if(values[0] != this.prevValue) {
      //在当前年份选中时间不等于上一次年份选中时间时才进行以下操作
        if(values[0] == '2012 年') {
          picker.setSlotValues(1, ['12 月','11 月','10 月']);
        } else if(values[0] == '2017 年') {
          picker.setSlotValues(1, ['11 月','10 月', '9 月', '8 月', '7 月','6 月','5 月','4 月','3 月','2 月','1 月']);
        } else {
          picker.setSlotValues(1, ['12 月','11 月','10 月', '9 月', '8 月', '7 月','6 月','5 月','4 月','3 月','2 月','1 月']);
        }
        //设置时间限制
        if(picker.getSlotValues(1)) {
          picker.setSlotValue(1, picker.getSlotValues(1)[index]);
        }
        //设置选中月份
        this.prevValue = values[0];
        //执行完毕后更新上一次年份选中时间
      }

      if(values[0] && values[1]) {
        this.$store.commit('openTime',{openY:values[0],openM:values[1]});
        //记录选中日期
        this.values = values[0].split(' ')[0] +'-'+ values[1].split(' ')[0];
        //记录选中日期用于请求头目录数据
      }
    },
    confirm() {
      if(this.values != '') {
        this.closePicker();
        //关闭日期选择器
        this.$store.dispatch('getHeaderMenu',this.values).then(() => {
          setTimeout(() => {
            this.refresh();
          },200)
        });
        //根据选中日期请求数据后初始化scroll
      }
    },
    gotoAddress(item) {
    //重新请求首页数据  
      this.$store.commit('changeFlag',['loading',true]);
      //loading...
      this.$store.commit('changeFlag',['isMenu',false]);
      this.$refs.mHeader.$refs.menuIcon.style.transform = 'rotate(0)';
      //收起下拉导航
      this.$store.commit('openTime',{openY: new Date().getFullYear()+' 年',openM: new Date().getMonth()+1+' 月'});
      //更新首页日期选择器选中日期为最新日期
      this.$store.commit('setDate',changeTime(0,item.date));
      //同步vuex里的时间为选中内容的时间
      this.$store.dispatch('getOnelist',this.nowDate).then(()=> {
      //获取新的首页数据  
        setTimeout(() => {
          this.refresh();
          this.$store.commit('changeFlag',['loading',false]);
        },500)
      });
      //在获取到首页数据之后延迟500ms初始化scroll,loading状态消失 
    }
  }
} 
</script>

<style type="text/css">
#index .wrapper {
  top: 1.3rem;
  bottom: .99rem;
} 
#index .wrapper.isMenu {
  background: #fff;
  bottom: 0;
}
.loading {
  font-size: .26rem;
  line-height: .7rem;
  font-weight: bold;
  color: #5a5a5a;
  text-align: center;
}
#index .tarns {
  background: rgba(0,0,0,.8);
  width: 5.6rem;
  height: 13rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding: 0 .4rem 0;
}
#index .tarns h3 {
  font-size: .24rem;
  line-height: 1.2rem;
  color: #fff;
  text-align: left;
  margin: 1.34rem 0 3.87rem;
}
#index .tarns p {
  font-size: .22rem;
  line-height: 1.2rem;
  color: #fff;
  text-align: left;
  margin: 0;
}
#index .tarns img {
  width: 5.81rem;
  height: 3.87rem;
  position: absolute;
  top: 2.54rem;
  left: .3rem;
}
.tarns-fade-enter-active {
  transition: all .5s ease;
}
.tarns-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.tarns-fade-enter, .tarns-fade-leave-to {
  transform: translateY(-.3rem);
  opacity: 0;
}
.headerMenu {
  width: 100%;
  height: auto;
  background: #fff;
  overflow: hidden;
  transition: .3s;
} 
.headerMenu h2 {
  height: .58rem;
  border-bottom: .02rem solid #eee;
  position: relative;
}
.headerMenu h2 span {
  width: 1.12rem;
  height: .24rem;
  position: absolute;
  top: .47rem;
  left: 2.64rem;
  background: #fff;
  font-size: .24rem;
  line-height: 1;
  color: #b8b8b8;
  text-align: center;
}
.headerMenu ul {
  overflow: hidden;
  margin: .49rem .2rem 1.11rem;
}
.headerMenu ul li {
  width: 2.56rem;
  height: 2.56rem;
  border: .02rem solid #eee;
  margin: .1rem .2rem;
  float: left;
}
.headerMenu ul li.active {
  border-color: #808080;
}
.headerMenu li img {
  width: 2.56rem;
  height: 1.71rem;
}
.headerMenu li p {
  height: .85rem;
  font-size: .3rem;
  line-height: .85rem;
  color: #808080;
  text-align: center;
}
#index .footerMenu {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 888;
  width: 100%;
  height: .8rem;
  border-top: .01rem solid #efefef;
  font-size: .26rem;
  line-height: .8rem;
  color: #808080;
  text-indent: 2.3rem;
  background: #fff url("../../assets/img/sprite.png") -3.55rem -2.46rem no-repeat;
  background-size: 10rem 15rem;
}
#index .shade {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.2);
  z-index: 1000;
  display: none;
}
#index .picker {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1001;
  width: 100%;
  height: 0;
  background: #fff;
  transition: .3s;
}
#index .picker .title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: .9rem;
  font-size: .26rem;
  line-height: .9rem;
  color: #999;
  text-align: center;
}
.picker-items {
  margin-top: .72rem;
}
.picker-item {
  color: #e1e1e1;
}
.picker-item.picker-selected.picker-selected {
  font-size: .28rem;
  color: #999;
}
.slot1 .picker-item.picker-selected.picker-selected {
  padding-right: .35rem;
}
.slot2 .picker-item.picker-selected.picker-selected {
  padding-left: .35rem;
}
#index .picker-slot {
  font-size: .26rem;
}
#index .confirm {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1002;
  width: 100%;
  height: 0;
  background: #fff;
  text-align: center;
  font-size: .26rem;
  line-height: .99rem;
  color: #333;
  transition: .3s;
}
</style>