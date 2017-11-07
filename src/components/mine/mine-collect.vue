<template>
	<div class="mine-collect">
    <div class="title">
      <span @click="back()"></span>
      <h1 v-if="title=='音乐'">音乐故事收藏</h1>
      <h1 v-else-if="title=='影视'">电影收藏</h1>
      <h1 v-else>{{title}}收藏</h1>
    </div>
    <scroll :style="{background: bgColor}">
      <div>
        <div v-if="title=='图文'">
          <div class="none" v-if="hplist.length==0"></div>
          <ul class="hpLis" v-else>
            <li v-for="item in hplist" @click="gotoAddress({path: '/detail',query:{type:type[item.type],id:item.id}})">
              <img :src="item.img">
              <div class="trans">  
                <span>{{item.vol}}</span>
                <span>{{item.date | setDate('y/m/d')}}</span>
              </div>
              <p>{{item.forward}}</p>
            </li>
          </ul>
        </div>
        <div v-if="title=='文章'">
          <div class="none" v-if="readlist.length==0"></div>
          <ul class="readLis" v-else>
            <li v-for="item in readlist" @click="gotoAddress({path: '/detail',query:{type:type[item.type],id:item.id}})">
              <span class="logo"></span>
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
        <div v-if="title=='连载'">
          <div class="none" v-if="seriallist.length==0"></div>
          <ul class="serialLis" v-else>
            <li v-for="item in seriallist" @click="gotoAddress({path: '/detail',query:{type:type[item.type],id:item.id}})">
              <span class="logo"></span>
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
        <div v-if="title=='音乐'">
          <div class="none" v-if="musiclist.length==0"></div>
          <ul class="musicLis" v-else>
            <li v-for="item in musiclist" @click="gotoAddress({path: '/detail',query:{type:type[item.type],id:item.id}})">
              <div class="logo">
                <img :src="item.img">
              </div>
              <h2>{{item.author}}</h2>
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
        <div v-if="title=='影视'">
          <div class="none" v-if="movielist.length==0"></div>
          <ul class="movieLis" v-else>
            <li v-for="item in movielist" @click="gotoAddress({path: '/detail',query:{type:type[item.type],id:item.id}})">
              <span class="logo"></span>
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
import scroll from '@/components/scroll'
import setDate from '@/function/setDate.js'

export default {
  name: 'Collect',
  components: {
    scroll
  },
  filters: {
    setDate
  },
  data() {
    return {
      title: '',
      bgColor: ''
    }
  },
  mounted() {
    this.title = this.$route.query.title;
    //query传参
    if(this.title == "图文") {
      this.bgColor = "#e6e6e6";
    } else {
      this.bgColor = "#fff";
    }
  },
  computed: mapState({
    type: state => state.type,
    //one内容类型
    hplist: state => state.mine_collect.hp.list,
    //图文收藏列表
    readlist: state => state.mine_collect.essay.list,
    //文章收藏列表
    seriallist: state => state.mine_collect.serial.list,
    //连载收藏列表
    musiclist: state => state.mine_collect.music.list,
    //音乐收藏列表
    movielist: state => state.mine_collect.movie.list
    //影视收藏列表
  }),
  methods: {
    back() {
      this.$router.go(-1);
    },
    gotoAddress(path) {
      this.$router.push(path);
    }
  }
}

</script>

<style type="text/css">
.mine-collect .wrapper {
  top: .89rem;
}
.mine-collect .title {
  background: #fff;
  border-bottom: .01rem solid #b3b3b3;
}
.mine-collect .title h1{
  height: .88rem;
  font-size: .32rem;
  line-height: .88rem;
  color: #000;
  text-align: center;
  font-weight: bold;
}
.mine-collect .title span {
  position: absolute;
  top: 0;
  left: 0;
  width: .87rem;
  height: .88rem;
  background: url("../../assets/img/sprite.png") 0 -7.1rem no-repeat;
  background-size: 10rem 15rem;
}   
.mine-collect .none {
  height: 10.47rem;
  background: url("../../assets/img/collectBg.png") no-repeat;
  background-size: 6.4rem 10.47rem;
}
.hpLis {
  overflow: hidden;
}
.hpLis li {
  float: left;
  width: 2.96rem;
  height: 3.15rem;
  margin: 0 .12rem .24rem;
  background: #fff;
  box-shadow: 0 .02rem .2rem #999;
  position: relative;
}
.hpLis li img {
  width: 2.96rem;
  height: 2.22rem;
}
.hpLis li p {
  padding: .14rem .33rem 0 .1rem;
  font-size: .26rem;
  line-height: .33rem;
  color: #333;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.hpLis li .trans {
  position: absolute;
  top: 1.92rem;
  left: 0;
  width: 100%;
  height: .3rem;
  background: rgba(0,0,0,.3);
}
.hpLis .trans span {
  float: left;
  width: 50%;
  height: .3rem;
  font-size: .2rem;
  line-height: .3rem;
  color: #ebebea;
  text-indent: .13rem;
}
.hpLis .trans span:nth-of-type(2) {
  float: right;
  text-align: center;
}
.serialLis li,
.readLis li,
.movieLis li {
  height: .87rem;
  border-bottom: .01rem solid #e5e5e5;
  position: relative;
}
.serialLis li .logo,
.readLis li .logo,
.movieLis li .logo {
  position: absolute;
  top: 0;
  left: 0;
  width: .88rem;
  height: .88rem;
  background: #fff url("../../assets/img/sprite.png") -8.15rem -10rem no-repeat;
  background-size: 10rem 15rem;
}
.serialLis li .logo {
  background-position: -9.15rem -10rem;
}
.movieLis li .logo {
  background-position: -1.3rem -11.88rem;
}
.serialLis li p,
.readLis li p,
.movieLis li p {
  height: .87rem;
  font-size: .3rem;
  line-height: .87rem;
  color: #000;
  padding: 0 .6rem 0 .9rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.musicLis li {
  height: 1.19rem;
  border-bottom: .01rem solid #e5e5e5;
  position: relative;
  padding: .09rem 0 0 1.35rem;
}
.musicLis li .logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.24rem;
  height: 1.29rem;
  background: #fff url("../../assets/img/sprite.png") 0 -11.88rem no-repeat;
  background-size: 10rem 15rem;
}
.musicLis .logo img {
  width: .8rem;
  height: .78rem;
  position: absolute;
  top: .29rem;
  left: .3rem;
}
.musicLis li h2 {
  height: .7rem;
  font-size: .3rem;
  line-height: .7rem;
  color: #333;
}
.musicLis li p {
  padding-right: .6rem;
  height: .24rem;
  font-size: .24rem;
  line-height: .24rem;
  color: #979797;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>