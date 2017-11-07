<template>
	<div class="content-hp">
    <img :src="hplist.img_url">
    <span>{{hplist.title}} | {{hplist.pic_info}}</span>
    <p>{{hplist.forward}}</p>
    <span>{{hplist.words_info}}</span>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'

export default {
  computed: mapState({
    hplist: state => state.hplist
    //图文详细数据
  })
}

</script>

<style type="text/css">
.content-hp {
  background: #fff;
  min-height: 10.47rem;
  text-align: center;
  overflow: hidden;
}
.content-hp img {
  width: 100%;
  height: auto;
  margin-bottom: .43rem;
} 
.content-hp span {
  display: block;
  height: .24rem;
  font-size: .24rem;
  line-height: 1;
  color: #a6a6a6;
  margin-bottom: .6rem;
}
.content-hp p {
  font-size: .26rem;
  line-height: .56rem;
  color: #333;
  margin: 0 .48rem .6rem;
  padding: .2rem .2rem .5rem;
  text-align: left;
  border: .02rem solid #f4f4f4;
  border-radius: .1rem;
  background: #fdfdfd;
  box-shadow: 0 0 .05rem .02rem #f4f4f4;
}
.content-hp span:nth-of-type(2) {
  margin-bottom: 2.8rem;
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