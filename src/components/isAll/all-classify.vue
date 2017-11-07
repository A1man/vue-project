<template>
	<div class="all-classify">
		<h2>分类导航</h2>
		<div class="classifys">
			<span @click="gotoAddress({path: '/classify',query:{type:0,title:'图文'}})">
				<img src="../../assets/img/hp.png">
			</span>
			<span @click="gotoAddress({path: '/classify',query:{type:3,title:'问答'}})">
				<img src="../../assets/img/question.png">
			</span>
			<span @click="gotoAddress({path: '/classify',query:{type:1,title:'阅读'}})"">
				<img src="../../assets/img/read.png">
			</span>
			<span @click="gotoAddress({path: '/classify',query:{type:2,title:'连载'}})">
				<img src="../../assets/img/serial.png">
			</span>
			<span @click="gotoAddress({path: '/classify',query:{type:5,title:'影视'}})"">
				<img src="../../assets/img/movie.png">
			</span>
			<span @click="gotoAddress({path: '/classify',query:{type:4,title:'音乐'}})">
				<img src="../../assets/img/music.png">
				<strong>音乐</strong>
			</span>
		</div>
	</div>
</template>

<script type="text/javascript">
export default {
	methods: {
		gotoAddress(path) {
			this.$router.push(path);
		}
	}
}	

</script>

<style type="text/css">
.all-classify {
	height: 4.26rem;
	margin-bottom: .2rem;
	background: #fff;
	padding: 0 .4rem;
}
.all-classify h2 {
	height: .8rem;
	font-size: .26rem;
	line-height: .8rem;
	color: #333;
	margin-bottom: .1rem;
}
.all-classify .classifys {
	overflow: hidden;
	height: 2.84rem;
}
.all-classify .classifys span {
	display: block;
	float: left;
	width: 1.34rem;
	height: 1.34rem;
	margin: 0 .08rem .08rem 0;
}
.classifys span img {
	width: 1.34rem;
	height: 1.34rem;
}
.classifys span:nth-of-type(3),
.classifys span:nth-of-type(6) {
	width: 2.76rem;
	margin-right: 0;
	position: relative;
}
.classifys span:nth-of-type(3) img,
.classifys span:nth-of-type(6) img {
	width: 2.76rem;
	height: 1.34rem;
}
.classifys span:nth-of-type(6) strong {
	position: absolute;
	top: .92rem;
	left: 0;
	width: 2.76rem;
	height: .22rem;
	font-size: .22rem;
	line-height: 1;
	color: #c5c6c6;
	text-align: center;
	font-weight: normal;
}
</style>