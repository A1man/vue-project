<template>
  <div id="app">
  	<keep-alive exclude="Detail,Banner,Classify,Collect,Author">
   		<router-view></router-view>
  	</keep-alive>
  </div>
</template>

<script type="text/javascript">
export default {
	created() {
		if(localStorage.user) {
			this.$store.commit('login',localStorage.user);
		}
		if(localStorage.user != '') {
		//如果此时已登录，把localStorage中的数据传给vuex
			if(localStorage.collect) {
				this.$store.commit('passCollect',JSON.parse(localStorage.collect));
			}
			if(localStorage.interest) {
				this.$store.commit('passInterest',JSON.parse(localStorage.interest));
			}
			if(localStorage.likeList) {
				this.$store.commit('passLikelist',JSON.parse(localStorage.likeList));
			}
		}
	}
}

</script>