<template>
  <div class="guide">
  	<div class="guide"></div>
  </div>
</template>

<script type="text/javascript">
export default {
	mounted() {
		setTimeout(() => {
			this.$router.push({path: '/index'});
		},3000)
	}
}
	
</script>

<style type="text/css">
.guide {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  background: url("../../assets/img/guide.png") no-repeat;
}	
</style>
