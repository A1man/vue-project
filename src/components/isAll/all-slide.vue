<template>
	<div class="all-slide">
		<mt-swipe :auto="3000">
		  <mt-swipe-item v-for="item in slide" :key="item.id" @click.native="gotoAddress(item,{path: '/banner',query:{id:item.content_id,cover:item.cover}})">
		  	<img :src="item.cover">
		  </mt-swipe-item>
		</mt-swipe>
	</div>
</template>

<script type="text/javascript">
import {mapState} from 'vuex'

export default {
	computed: mapState({
		slide: state => state.slide
		//轮播图数据
	}),
 	methods: {
    gotoAddress(item,path) {
    	if(item.link_url == '') {
    		this.$store.commit('prevPage','all');
      	//记录是从all页面进入的专题页
    		this.$router.push(path);
    	} else {
    		location = item.link_url;
    	}
    }
  }
}

</script>

<style type="text/css">
.all-slide {
	height: 3.8rem;
	border-bottom: .01rem solid #7a736a;
	background: #fff;
}
.all-slide img {
	width: 100%;
	height: 100%;
}
.mint-swipe-indicator {
	width: .1rem;
	height: .1rem;
	background: rgba(0,0,0,0);
	border: .01rem solid #fff;
	margin: 0 .08rem;
	opacity: 1;
}
.mint-swipe-indicators {
	bottom: 0;
}
</style>