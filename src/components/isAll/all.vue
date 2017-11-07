<template>
	<div id="all">
		<ring-loader :loading="loading"></ring-loader>
		<div class="all-header">
			<h1>ONE&nbsp;&nbsp;&nbsp;&nbsp;IS&nbsp;&nbsp;&nbsp;&nbsp;ALL</h1>
			<span class="search" @click="openSearchPage">
      </span>
		</div>
		<div class="searchPage" ref="searchPage">
      <form class="form" @submit="search(searchType)" action="javascript:;">
        <input type="search" placeholder="在这里写下你想寻找的" @focus="onFocus" @blur="onBlur" @input="changeIcon" ref="input">
        <span class="icon" v-show="iconShow" @click="changeValue"></span>
        <span @click="closeSearchPage">取消</span>
      </form>
      <ul class="list">
        <li @click="gotoClassify({path: '/classify',query:{type:0,title:'图文'}})">图文</li>
        <li @click="gotoClassify({path: '/classify',query:{type:3,title:'问答'}})">问答</li>
        <li @click="gotoClassify({path: '/classify',query:{type:1,title:'阅读'}})">阅读</li>
        <li @click="gotoClassify({path: '/classify',query:{type:2,title:'连载'}})">连载</li>
        <li @click="gotoClassify({path: '/classify',query:{type:5,title:'影视'}})">影视</li>
        <li @click="gotoClassify({path: '/classify',query:{type:4,title:'音乐'}})">音乐</li>
      </ul>
      <div class="searchContent" v-if="searchContent">
        <ring-loader :loading="searchLoading"></ring-loader>
        <nav>
          <span @click="search('hp')" :class="{active: searchType=='hp'}">图文</span>
          <span @click="search('reading')" :class="{active: searchType=='reading'}">阅读</span>
          <span @click="search('music')" :class="{active: searchType=='music'}">音乐</span>
          <span @click="search('movie')" :class="{active: searchType=='movie'}">影视</span>
          <span @click="search('author')" :class="{active: searchType=='author'}">作者</span>
        </nav>
        <scroll ref="searchScroll" :pullup="pullup" @scrollToEnd="loadMoreSearch">
          <div>
            <ul v-if="searchMsg.length == 0" class="noMsg"></ul>
            <ul v-else>
              <li v-for="(item,index) in searchMsg" @click="gotoAddress(item)">
                <img :src="item.cover">
                <p>{{item.title}}</p>
                <h2>{{item.subtitle}}</h2>
              </li>
              <div class="loadMoreSearch">{{searchMoreTxt}}</div>
            </ul>
          </div>
        </scroll>
      </div>
    </div>
		<scroll :pulldown="pulldown" @pulldown="loadData" :pullup="pullup" @scrollToEnd="loadMore" ref="allScroll">
			<div>
				<div class="loading" v-show="show">正在刷新数据中...</div>
				<all-slide></all-slide>
				<all-classify></all-classify>
				<all-banner></all-banner>
				<div class="loadmore">{{pullTxt}}</div>
			</div>
		</scroll>	
		<m-footer></m-footer>
	</div>
</template>

<script type="text/javascript">
import AllSlide from '@/components/isAll/all-slide'
import AllClassify from '@/components/isAll/all-classify'
import AllBanner from '@/components/isAll/all-banner'
import MFooter from '@/components/homePage/m-footer'
import scroll from '@/components/scroll'
import {mapState} from 'vuex'
import { Toast } from 'mint-ui'

export default {
	components: {
		AllSlide,
		AllClassify,
		AllBanner,
		MFooter,
		scroll
	},
	data() {
		return {
			pulldown: true,
      //scroll组件开启顶部下拉事件
      pullup: true,
      //scroll组件开启底部上拉事件
			show: false,
      //下拉刷新状态是否存在
      pullTxt: '↓ 松开立即加载更多',
      //all首页底部上拉提示信息
      iconShow: false,
      //搜索框的一键删除×号是否出现
      searchContent: false,
      //搜索后的页面是否出现
      searchType: '',
      //搜索内容类型
      searchLoading: false,
      //搜索后内容的页面的loading状态
      searchNub: 0,
      //请求更多搜索内容所需要的参数
      searchMoreTxt: '↓ 松开立即加载更多'
      //搜索页底部上拉提示信息
		}
	},
	mounted() {
    this.$store.commit('changeFlag',['all',true]);
    this.$store.commit('changeFlag',['loading',true]);
    //loading...
    this.$store.dispatch('getSlide').then(() => {
    //请求轮播图数据
    	this.$store.dispatch('getBanner');
    	//请求专题数据
    }).then(() => {
    	this.$store.dispatch('getHotAuthor');
    	//请求热门作者数据
    }).then(() => {
    	this.$store.dispatch('getQuestionBanner');
 			//请求问答专题数据
    }).then(() => {
    	setTimeout(() => {
        this.$refs.allScroll.refresh();
        this.$store.commit('changeFlag',['loading',false]);
      },500)
      //在获取到all页面所有数据之后延迟500ms初始化scroll,loading状态消失
    })
	},
	computed: mapState({
    type: state => state.type,
    //one内容类型
    loading: state => state.flag.loading,
    //loading状态是否存在
    banner: state => state.banner,
		//专题数据
		moreBanner: state => state.moreBanner,
    //更多专题数据
    searchMsg: state => state.searchMsg,
    //搜索数据
    moreSearch: state => state.moreSearch
    //更多搜索数据
  }),
  methods: {
  	loadData() {                                                          
    //顶部下拉刷新
      this.show = true;
	    this.$store.dispatch('getSlide').then(() => {
	    	this.$store.dispatch('getBanner');
	    }).then(() => {
	    	this.$store.dispatch('getHotAuthor');
	    }).then(() => {
	    	this.$store.dispatch('getQuestionBanner');
	    }).then(() => {
	    	setTimeout(() => {
	        this.show = false;
	        this.$refs.allScroll.refresh();
	      },500)
	      //在重新获取all页面所有数据后延迟500ms初始化scroll,刷新状态消失
	    })
    },
    loadMore() {
    	//all页面底部上拉加载更多专题，根据上拉是否还有新的专题来更改提示信息  
      if(this.moreBanner.length == 0) {
        this.pullTxt = '已经全部加载完毕';
      } else {
        this.pullTxt = "正在加载更多数据...";
      }
      this.$store.dispatch('getMoreBanner',this.banner[this.banner.length - 1].id).then(() => {
      //请求更多专题数据     
        setTimeout(() => {
          this.$refs.allScroll.refresh();
          //初始化all页面scroll
          if(this.moreBanner.length == 0) {
          //根据上拉是否还有新的专题来更改提示信息  
            this.pullTxt = '已经全部加载完毕';
          } else {
            this.pullTxt = "↓ 松开立即加载更多";
          }
        },200)
      });
    },
    search(type){
    //搜索  
      if(this.$refs.input.value != '') {
      //已输入关键字才能继续操作
        if(type == '') {
        //第一次搜索时默认图文类型  
          this.searchType = 'hp';
        } else {
          this.searchType = type;
        }
        //确定搜索类型
        this.searchContent = true;
        //搜索后页面出现
        this.searchLoading = true;
        //搜索数据中，loading...
        this.$store.dispatch('getSearchMsg',[this.searchType,this.$refs.input.value]).then(() => {
        //搜索关键字，拿到搜索数据
          setTimeout(() => {
            this.$refs.searchScroll.refresh();
            this.searchLoading = false;
            //初始化搜索内容页面的scroll，loading状态消失
          },500)
        });
      } else {
      //如果未输入关键字就进行提示
        Toast({
          message: '请输入内容',
          position: 'middle',
          duration: 666,
          className: 'collectHint'
        });
      }
    },
    loadMoreSearch() {
    //搜索页底部上拉加载更多搜索内容，根据上拉是否还有新的搜索内容来更改提示信息
      if(this.moreSearch.length == 0) {
        this.searchMoreTxt = '已经全部加载完毕';
      } else {
        this.searchMoreTxt = "正在加载更多数据...";
      }
      this.searchNub++;
      //搜索内容请求所需参数
      this.$store.dispatch('getMoreSearch',[this.searchType,this.$refs.input.value,this.searchNub]).then(() => {
      //请求更多搜索内容     
        setTimeout(() => {
          this.$refs.searchScroll.refresh();
          //初始化搜索页scroll
          if(this.moreSearch.length == 0) {
          //根据上拉是否还有新的搜索内容来更改提示信息  
            this.searchMoreTxt = '已经全部加载完毕';
          } else {
            this.searchMoreTxt = "↓ 松开立即加载更多";
          }
        },200)
      });
    },
    openSearchPage() {
    //打开搜索主页面  
      this.$refs.searchPage.style.height = '11.36rem';
      setTimeout(() => {
        this.$refs.input.focus();
        //页面打开后搜索框获得焦点
      },666)
    },
    closeSearchPage() {
    //关闭搜索主页面  
      this.$refs.searchPage.style.height = '0';
      this.$refs.input.value = '';
      this.iconShow = false;
      //清空搜索框内容
      this.onBlur();
      //失去焦点还原搜索框样式
      this.searchContent = false;
      //关闭已搜索内容页面
      this.searchType = '';
      //重置搜索内容初始类型
    },
    onFocus() {
    //当搜索框得到焦点时
      this.$refs.input.style.paddingLeft = '.56rem';
      this.$refs.input.style.backgroundPosition = '-0.78rem -13.18rem';     
    },
    onBlur() {
    //当搜索框失去焦点时
      if(this.$refs.input.value == '') {
        this.$refs.input.style.paddingLeft = '1.34rem';
        this.$refs.input.style.backgroundPosition = '0 -13.18rem';
      }
    },
    changeIcon() {
    //搜索框已输入关键字,就出现一键清空×号  
      if(this.$refs.input.value != '') {
        this.iconShow = true;
      } else {
        this.iconShow = false;
      }
    },
    changeValue() {
    //清空搜索框  
      this.$refs.input.value = '';
      //清空搜索框内容
      this.iconShow = false;
      //清空图标消失
      this.$refs.input.focus();
      //搜索框重新得到焦点
    },
    gotoClassify(path) {
    //跳转到分类详情页面  
      this.$router.push(path);
    },
    gotoAddress(item) {
      this.$store.commit('prevPage','all');
      //记录是从all页面进入的详情页
      if(item.category == 10) {
        this.$router.push({path: '/author',query:{author_id:item.content_id}});
        //跳转到作者详情页
      } else {
        this.$router.push({path: '/detail',query:{type:this.type[item.category],id:item.content_id}});
        //跳转到内容详情页
      }
    }
  }
}	

</script>

<style type="text/css">
#all .wrapper {
  top: .89rem;
}
.loading {
  font-size: .26rem;
  line-height: .7rem;
  font-weight: bold;
  color: #5a5a5a;
  text-align: center;
}
#all .all-header {
	background: #fff;
	width: 100%;
  height: .89rem;
  position: fixed;
  top: 0;
  left: 0;
}	
#all .all-header h1 {
	height: .88rem;
	border-bottom: .01rem solid #7a736a;
	font-size: .28rem;
	line-height: .88rem;
	color: #333;
	font-weight: bold;
	text-align: center;
}
#all .all-header .search {
	position: absolute;
	top: 0;
	right: 0;
	width: 1.04rem;
	height: .88rem;
	background: url("../../assets/img/sprite.png") 0 -7.98rem no-repeat;
  background-size: 10rem 15rem;
}
#all .searchPage {
	width: 100%;
	height: 0;
	position: absolute;
  top: 0;
	left: 0;
	background: #fff;
  z-index: 1010;
  transition: .3s;
  overflow: hidden;
}
#all .searchPage .searchContent {
  position: absolute;
  top: 1.29rem;
  left: 0;
  width: 100%;
  height: 10.07rem;
  background: #fff;
}
#all .searchContent .wrapper {
  top: .79rem;
}
#all .searchContent .v-spinner {
  top: .79rem;
}
.searchContent .v-spinner .v-ring0 {
  top: 2.7rem !important  ;
}
.searchContent .v-spinner .text {
  top: 4.2rem;
}
.searchContent .noMsg {
  background: url('../../assets/img/searchBg.png') no-repeat;
  width: 100%;
  height: 9.27rem;
}
.searchContent ul {
  min-height: 9.28rem;
  position: relative;
}
.searchContent ul li {
  box-sizing: border-box;;
  height: 1.2rem;
  border-bottom: .02rem solid #eee;
  position: relative;
  padding: .25rem 0 0 1.48rem;
}
.searchContent li img {
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: .2rem;
  left: .4rem;
}
.searchContent li p { 
  height: .3rem;
  font-size: .3rem;
  line-height: 1;
  color: #333;
  padding-right: .76rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.searchContent li h2 {
  height: .6rem;
  font-size: .2rem;
  line-height: .6rem;
  color: #a6a6a6;
  padding-right: .8rem;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.searchPage .searchContent nav {
  overflow: hidden;
  height: .79rem;
  width: 100%;
}
.searchContent nav span {
  float: left;
  width: 20%;
  height: .75rem;
  font-size: .26rem;
  line-height: .75rem;
  text-align: center;
  color: #808080;
}
.searchContent nav span.active {
  border-bottom: .04rem solid #333;
}
#all .searchPage .form {
  height: .72rem;
  border-bottom: .01rem solid #b3b3b3;
  padding: .56rem 0 0 .16rem;
}
.searchPage .form input {
  box-sizing: border-box;
  width: 5.14rem;
  height: .56rem;
  border-radius: .08rem;
  vertical-align: top;
  font-size: .26rem;
  line-height: .56rem;
  background: #eaebed url('../../assets/img/sprite.png') 0 -13.18rem no-repeat;
  background-size: 10rem 15rem;
  padding: 0 .88rem 0 1.34rem;
}
.searchPage .form .icon {
  display: block;
  width: .28rem;
  height: .28rem;
  position: absolute;
  top: .7rem;
  left: 4.86rem;
  background: #eaebed url('../../assets/img/sprite.png') -5.98rem -13.18rem no-repeat;
  background-size: 10rem 15rem;
}
.searchPage .form span {
  display: block;
  width: 1rem;
  height: .56rem;
  font-size: .26rem;
  line-height: .56rem;
  color: #333;
  text-align: center;
  position: absolute;
  top: .56rem;
  right: .1rem;
}
#all .searchPage .list {
  padding: 0 2.7rem;
  overflow: hidden;
}
.searchPage .list li {
  margin: .4rem 0 .8rem;
  height: .7rem;
  font-size: .3rem;
  line-height: .7rem;
  text-align: center;
  color: #808080;
}
#all .loadmore,
#all .loadMoreSearch {
  width: 100%;
  height: .26rem;
  font-size: .26rem;
  line-height: 1;
  font-weight: bold;
  color: #5a5a5a;
  text-align: center;
  background: rgba(0,0,0,0);
}
#all .loadMoreSearch {
  position: absolute;
  left: 0;
  bottom: -1rem;
}
.collectHint {
  border-radius: .1rem;
  background: rgba(0,0,0,.6);
  z-index: 1100;
}
.collectHint .mint-toast-text {
  font-size: .26rem;
  line-height: .94rem;
  margin: 0 .3rem;
}
</style>