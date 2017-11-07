<template>
	<div class="mine-interest">
    <div class="title">
      <span @click="back()"></span>
      <h1>我的关注</h1>
    </div>
    <scroll>
      <div>
        <div class="none" v-if="mine_interest.length == 0"></div>
        <ul class="interestLis" v-else>
          <li v-for="item in mine_interest" @click="gotoAddress({path: '/author',query:{author_id:item.id}})">
            <img :src="item.img">
            <h2>{{item.name}}</h2>
            <p>{{item.summary}}</p>
            <span></span>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
import scroll from '@/components/scroll'

export default {
  name: 'Collect',
  components: {
    scroll
  },
  computed: mapState({
    mine_interest: state => state.mine_interest
    //我的关注列表
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
.mine-interest .wrapper {
  top: .89rem;
}
.mine-interest .title {
  background: #fff;
  border-bottom: .01rem solid #b3b3b3;
}
.mine-interest .title h1{
  height: .88rem;
  font-size: .32rem;
  line-height: .88rem;
  color: #000;
  text-align: center;
  font-weight: bold;
}
.mine-interest .title span {
  position: absolute;
  top: 0;
  left: 0;
  width: .87rem;
  height: .88rem;
  background: url("../../assets/img/sprite.png") 0 -7.1rem no-repeat;
  background-size: 10rem 15rem;
}   
.mine-interest .none {
  height: 10.47rem;
  background: url("../../assets/img/interestBg.png") no-repeat;
  background-size: 6.4rem 10.47rem;
}
.mine-interest .interestLis {
  background: #efeff5;
}
.mine-interest .interestLis li {
  height: 1.14rem;
  margin-bottom: .2rem;
  background: #fff;
  position: relative;
  padding: .26rem 0 0 1.3rem;
}
.interestLis li img {
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: .3rem;
  left: .3rem;
  border-radius: 50%;
}
.interestLis li h2 {
  height: .56rem;
  font-size: .28rem;
  line-height: .56rem;
  color: #000;
}
.interestLis li p {
  width: 4.15rem;
  height: .2rem;
  font-size: .2rem;
  line-height: 1;
  color: #979797;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;animation-iteration-count: 
}
.interestLis li span {
  width: .16rem;
  height: .26rem;
  position: absolute;
  top: .58rem;
  left: 5.92rem;
  background: url("../../assets/img/sprite.png") -6.65rem -10.38rem no-repeat;
  background-size: 10rem 15rem;
}
</style>