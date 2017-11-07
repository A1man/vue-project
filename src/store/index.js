import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {    
    nowDate: '',                  //首页数据所属时间
    user: '',                     //登录用户
    type: ['hp','essay','serial','question','music','movie'],
    
    mine_collect: {               //收藏列表
      hp: {
        title: '图文',
        list: []                  
      },
      essay: {
        title: '文章',
        list: []
      },
      music: {
        title: '音乐',
        list: []
      },
      movie: {
        title: '影视',
        list: []
      },
      serial: {   
        title: '连载',    
        list: []
      }
    },
    mine_interest: [],              //关注列表
    likeList: [],                   //点赞列表

    flag: {                         //开关
      tarnsShow: false,
      index: false,
      all: false,
      me: false,
      isMenu: false,
      menuShow: false,
      musicPlay: false,
      bannerMusicPlay: false,
      detailMusicPlay: false,
      loading: true,
      publishTrans: false
    },    
    onelist: {                      //首页数据
      weather: '',
      date: '',
      menu: '',
      content_list: {
        title: ''
      }
    },

    headerMeun: {                   //首页头部导航数据

    },

    hplist: {                       //图文类型详细数据
      post_date: '',
      share_info: ''
    },

    readinglist: {                  //阅读类型详细数据
      tag_list: '',
      hp_title: '',
      hp_content: '',
      editor_email:'',
      hp_author_introduce: '',
      copyright: '',
      praisenum: '',
      author: {
        user_id: '',
        user_name: '',
        wb_name: '',
        summary: '',
        web_url: ''
      }
    },
    
    seriallist: {                   //连载类型详细数据
      tag_list: '',
      title: '',
      content: '',
      editor_email:'',
      charge_edt: '',
      copyright: '',
      praisenum: '',
      author: {
        user_id: '',
        user_name: '',
        wb_name: '',
        summary: '',
        web_url: ''
      }
    },
    
    questionlist: {               //问答类型详细数据
      tag_list: '',
      question_title: '',
      answer_content: '',
      charge_email:'',
      charge_edt: '',
      copyright: '',
      praisenum: '',
      asker: {
        user_name: '',
        question_content: ''
      },
      answerer: {
        user_id: '',
        user_name: '',
        wb_name: '',
        summary: '',
        web_url: ''
      }
    },

    musiclist: {                   //音乐类型详细数据
      tag_list: '',
      feeds_cover: '',
      cover: '',
      title: '',
      album: '',
      story_title: '',
      story: '',
      editor_email:'',
      charge_edt: '',
      copyright: '',
      praisenum: '',
      author: {
        user_name: '',
      },
      story_author: {
        user_id: '',
        user_name: '',
        wb_name: '',
        summary: '',
        web_url: ''
      }
    },

    movielist: {                    //影视类型文章详细数据
      title: '',
      content: '',
      editor_email:'',
      charge_edt: '',
      praisenum: '',
      user: {
        user_id: '',
        user_name: '',
        wb_name: '',
        summary: '',
        web_url: ''
      }  
    },
    moviemsg: {                     //影视类型电影数据
      tag_list: '',
      detailcover: '',
      title: ''
    },

    commentlist: {                  //评论信息
      count: '',
      data: []
    },
    moreComment: ['any'],           //更多评论信息

    authorMsg: '',                  //作者信息
    authorWork: '',                 //作者著作

    searchMsg: '',                  //搜索结果
    moreSearch: ['any'],            //更多搜索结果

    slide: '',                      //轮播图信息

    banner: '',                     //专题信息
    moreBanner: ['any'],            //更多专题信息
    questionBanner: '',             //问答专题信息
    hotAuthor: '',                  //近期热门作者信息

    banner_id: '',                  //通过banner_id获取数据
    bannerMsg: {                    //获取专题详细信息
      html_content: '',
      praisenum: ''
    },
    cover: '',                      //专题封面

    classify: '',                   //分类信息
    classifyTitle: '',              //分类标题

    prevPage: '',
    refresh: '',
    openY: '2017 年',
    openM: '11 月',
    timer: 0,
    rotate: 0,
    bannerRotate: 0
  },
  actions: {
    // 获取首页数据
    getOnelist({ commit },dateNub) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/channel/one/'+ dateNub +'/上海市?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('onelist',result);
          resolve(); 
        })
      })
    },
    // 获取首页头部下拉目录数据
    getHeaderMenu({ commit },dateNub) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/feeds/list/'+ dateNub +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('headerMeun',result);
          resolve(); 
        })
      })
    },
    //获取图文类型数据
    getHplist({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/hp/feeds/'+ contentId +'/?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('hplist',result);
          resolve(); 
        })
      })
    },
    //获取阅读类型数据
    getReadinglist({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/essay/'+ contentId +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('readinglist',result);
          resolve(); 
        })
      })
    },
    //获取连载类型数据
    getSeriallist({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/serialcontent/detail/'+ contentId +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('seriallist',result);
          resolve(); 
        })
      })
    },
    //获取问答类型数据
    getQuestionlist({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/question/'+ contentId +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('questionlist',result);
          resolve(); 
        })
      })
    },
    //获取音乐类型数据
    getMusiclist({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/music/detail/'+ contentId +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('musiclist',result);
          resolve(); 
        })
      })
    },
    //获取影视类型数据
    getMovielist({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/movie/'+ contentId +'/story/1/0?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('movielist',result);
          resolve(); 
        })
      })
    },
    //获取影视信息
    getMoviemsg({ commit },contentId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/movie/detail/'+ contentId +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('moviemsg',result);
          resolve(); 
        })
      })
    },
    //获取评论数据
    getCommentlist({ commit },[commentType,contentId]) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/comment/praiseandtime/'+ commentType +'/'+ contentId +'/0?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('commentlist',result);
          resolve(); 
        })
      })
    },
    //获取更多评论数据
    getMoreComment({ commit },[commentType,contentId,lastId]) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/comment/praiseandtime/'+commentType +'/'+contentId+'/'+lastId+'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('moreComment',result);
          resolve(); 
        })
      })
    },
    //搜索
    getSearchMsg({ commit },[type,text]) {
      return new Promise(function(resolve) {                   
        fetch(' http://v3.wufazhuce.com:8000/api/search/'+type+'/'+text+'/0?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('searchMsg',result);
          resolve(); 
        })
      })
    },
    //获取更多搜索内容
    getMoreSearch({ commit },[type,text,nub]) {
      return new Promise(function(resolve) {                   
        fetch(' http://v3.wufazhuce.com:8000/api/search/'+type+'/'+text+'/'+nub+'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('moreSearch',result);
          resolve(); 
        })
      })
    },
    //获取轮播图数据
    getSlide({ commit }) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/banner/list/3?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('slide',result);
          resolve(); 
        })
      })
    },
    //获取专题数据
    getBanner({ commit }) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/banner/list/4?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('banner',result);
          resolve(); 
        })
      })
    },
    //获取更多专题信息
    getMoreBanner({ commit },lastId) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/banner/list/4?last_id='+lastId)
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('moreBanner',result);
          resolve(); 
        })
      })
    },
    //获取近期热门作者
    getHotAuthor({ commit }) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/author/hot?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('hotAuthor',result);
          resolve(); 
        })
      })
    },
    //获取问答专题
    getQuestionBanner({ commit }) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/banner/list/5?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('questionBanner',result);
          resolve(); 
        })
      })
    },
    //获取专题页面信息
    getBannerMsg({ commit },banner_id) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/topic/htmlcontent/'+ banner_id +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('bannerMsg',result);
          resolve(); 
        })
      })
    },
    //获取专题评论信息
    getBannerComment({ commit },banner_id) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/comment/praiseandtime/topic/'+ banner_id +'/0?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('bannerComment',result);
          resolve(); 
        })
      })
    },
    //获取分类数据信息
    getClassify({ commit },content_type) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/all/list/'+ content_type +'?')
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('classify',result);
          resolve(); 
        })
      })
    },
    //获取作者数据
    getAuthorMsg({ commit },id) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/author/info?author_id='+id)
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('authorMsg',result);
          resolve(); 
        })
      })
    },
    //获取作者文章信息
    getAuthorWork({ commit },id) {
      return new Promise(function(resolve) {                   
        fetch('http://v3.wufazhuce.com:8000/api/author/works?author_id='+id)
        .then(response => {
          return response.json();
        })
        .then(result => {
          commit('authorWork',result);
          resolve(); 
        })
      })
    }
  },
  mutations: {
    //设置当前时间
    setDate(state,result) {
      state.nowDate = result;
    },

    //记录之前所在页面
    prevPage(state,result) {
      state.prevPage = result;
    },

    //获取首页数据
    onelist(state,result) {
      state.onelist = result.data;
    },

    //获取首页头部下拉目录数据
    headerMeun(state,result) {
      state.headerMeun = result.data;
    },

    //获取图文数据
    hplist(state,result) {
      state.hplist = result.data;
    },

    //获取阅读数据
    readinglist(state,result) {
      state.readinglist = result.data;
      state.readinglist.author = result.data.author[0];
    },

    //获取连载数据
    seriallist(state,result) {
      state.seriallist = result.data;
    },

    //获取问答数据
    questionlist(state,result) {
      state.questionlist = result.data;
    },

    //获取音乐数据
    musiclist(state,result) {
      state.musiclist = result.data;
    },

    //获取电影文章数据
    movielist(state,result) {
      state.movielist = result.data.data[0];
    },

    //获取电影信息数据
    moviemsg(state,result) {
      state.moviemsg = result.data;
    },

    //获取评论数据
    commentlist(state,result) {
      state.commentlist = result.data;
    },

    //获取更多评论数据
    moreComment(state,result) {
      state.moreComment = result.data.data;
      state.commentlist.data = state.commentlist.data.concat(state.moreComment);
    },

    //添加我的评论
    addComment(state,result) {
      state.commentlist.data.splice(8,0,result);
      state.commentlist.count++;
    },

    //获取作者信息
    authorMsg(state,result) {
      state.authorMsg = result.data;
    },

    //获取作者文章信息
    authorWork(state,result) {
      state.authorWork = result.data;
    },

    //获取搜索数据
    searchMsg(state,result) {
      state.searchMsg = result.data.list;
    },

    //获取更多搜索数据
    moreSearch(state,result) {
      state.moreSearch = result.data.list;
      state.searchMsg = state.searchMsg.concat(state.moreSearch);
    },

    //获取轮播图数据
    slide(state,result) {
      state.slide = result.data;
    },

    //获取专题数据
    banner(state,result) {
      state.banner = result.data;
    },

    //获取更多专题数据
    moreBanner(state,result) {
      state.moreBanner = result.data;
      state.banner = state.banner.concat(state.moreBanner);
    },

    //获取热门作者数据
    hotAuthor(state,result) {
      state.hotAuthor = result.data;
    },

    //获取问答专题数据
    questionBanner(state,result) {
      state.questionBanner = result.data;
    },

    //获取专题详细数据
    bannerMsg(state,result) {
      state.bannerMsg = result.data;
    },

    //获取专题评论数据
    bannerComment(state,result) {
      state.commentlist = result.data;
    },

    //获取分类内容数据
    classify(state,result) {
      state.classify = eval(result.html_content.split('allarticles=')[1].split('</scr')[0]);
    },


    //更改开关对象中的某个开关
    changeFlag(state,[is,result]) {
      state.flag[is] = result;
    },

    //更新登录状态
    login(state,result) {
      state.user = result;
      localStorage.setItem('user',result);
      //登录状态存储到localStorage的user中
    },

    //收藏列表添加
    collect(state,[type,result]) {
      state.mine_collect[type].list.push(result);
      localStorage.setItem('collect',JSON.stringify(state.mine_collect));
      //每次添加收藏都存储到localStorage的collect中
    },

    //收藏列表删除
    cancelCollect(state,[type,result]) {
      let index;
      for(let i = 0; i < state.mine_collect[type].list.length; i++) {
        if(state.mine_collect[type].list[i].id == result.id) {
          index = i;
        }
      }
      state.mine_collect[type].list.splice(index,1);
      localStorage.setItem('collect',JSON.stringify(state.mine_collect));
      //每次删除收藏都更新localStorage中的collect
    },

    //清空state里的收藏列表，关注列表，点赞列表
    emptyMine(state) {
      state.mine_collect.hp.list = [];
      state.mine_collect.essay.list = [];
      state.mine_collect.serial.list = [];
      state.mine_collect.music.list = [];
      state.mine_collect.movie.list = [];
      state.mine_interest = [];
      state.likeList = [];
    },

    //关注列表添加
    attention(state,result) {
      state.mine_interest.push(result);
      localStorage.setItem('interest',JSON.stringify(state.mine_interest));
      //每次添加关注都存储到localStorage的attention中
    },

    //关注列表删除
    cancelAttention(state,result) {
      let index;
      for(let i = 0; i < state.mine_interest.length; i++) {
        if(state.mine_interest[i].id == result.id) {
          index = i;
        }
      }
      state.mine_interest.splice(index,1);
      localStorage.setItem('interest',JSON.stringify(state.mine_interest));
      //每次删除关注都更新localStorage的attention
    },

    //点赞列表添加
    like(state,result) {
      state.likeList.push(result);
      localStorage.setItem('likeList',JSON.stringify(state.likeList));
      //每次点赞都添加到localStorage的likeList中
    },

    //点赞列表删除
    cancelLike(state,result) {
      let index;
      for(let i = 0;i < state.likeList.length ;i++) {
        if(state.likeList[i] == result) {
          index = i;
        }
      }
      state.likeList.splice(index,1);
      localStorage.setItem('likeList',JSON.stringify(state.likeList));
      //每次取消点赞都更新localStorage的likeList
    },

    //更改openY,openM
    openTime(state,result) {
      state.openY = result.openY;
      state.openM = result.openM;
    },

    //设置定时器
    setTimer(state,result) {
      state.timer = result;
    },

    //清除定时器
    clearTimer(state) {
      clearInterval(state.timer);
      state.timer = null;
    },

    //设置音乐CD旋转角度
    setRotate(state,result) {
      state.rotate = result.rotate;
      state.bannerRotate = result.bannerRotate;
      state.authorRotate = result.authorRotate;
    },

    //首页scroll组件的refresh方法
    refresh(state,result) {
      state.refresh = result;
    },

    //更新收藏列表
    passCollect(state,result) {
      state.mine_collect = result
    },
    //更新关注列表
    passInterest(state,result) {
      state.mine_interest = result;
    },
    //更新点赞列表
    passLikelist(state,result) {
      state.likeList = result;
    }
  }
})

export default store