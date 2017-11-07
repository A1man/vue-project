## 说明

基于vue2+vuex制作的仿ONE一个app移动端项目。


## 技术栈

vue2 + vuex + vue-router + Mint UI + fetch + better-scroll + localstorage


## 项目运行

```
### 安装依赖
npm install

### 开启本地服务器localhost:8080
npm run dev

### 发布环境
npm run build

```


## 目标功能

- 文章点赞，收藏
- 关注作者
- 内容详情页面评论点赞，发表评论
- 顶部下拉刷新页面
- 底部上拉加载更多
- loading加载状态
- ONE头部下拉导航
- ONE页面中部展开导航
- ONE页面头部导航日期选择器
- ALL页面搜索内容
- ALL页面轮播图
- ALL页面分类导航
- ME页面收藏列表
- ME页面关注列表
- ME页面登录退出


## 部分截图

### ONE首页

![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/ONE.jpg)
![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/ONE.gif)

### All页面

![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/ALL.jpg)
![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/ALL.gif)



### 搜索页面

![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/search.jpg)
![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/search.gif)

### ME页面

![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/ME.jpg)
![Image](https://github.com/A1man/vue-project/blob/master/src/assets/effect/ME.gif)


## 遇到的部分问题及总结

1、在页面刷新时页面数据丢失，所以使用了keep-alive用来缓存组件解决刷新页面内容丢失的问题。

2、关于点赞、收藏和关注等操作因为无法真正传递给ONE的后端，所以是将数据存在vuex里，但是这样会出现问题，在刷新页面时vuex里的数据并不会保存下来，所以利用了localstorage本地缓存存储了数据，在需要用到的时候传递给vuex，解决了登录退出刷新时收藏、关注等列表无法保存数据的问题。

3、在组件中有操作需要刷新数据、加载更多数据时，会导致页面内容变多或减少，而使用scroll组件只会在刚进页面时计算父元素和子元素的高度和宽度，这就导致了页面内容虽然变化了，但scroll并没有重新计算，页面滑动会出现问题。所以我在组件数据发生变化的时候，稍微延时调用了scroll的refresh()方法重新计算来确保滚动效果的正常，稍微延时是为了保证dom结构已经正确渲染了scroll再进行计算。

4、在对页面时间进行操作显示的时候，想根据字符串获取日期时，比如var date = new Date（'2017-11-01 08:00'），在Firefox、Chrome中都能够正常显示，但放在Safari会报错，时间显示会出现NAN，需要根据字符串获取日期的话要改成var date = new Date("2017/11/01 08:00")这种格式，就可以正常显示了。  

5、在制作项目时，因为one限制了只能在app里获取到音乐链接等数据，所以我在asstes文件夹里存储了mp3文件用来充当音乐播放的源文件。

6、在使用vue-router进行路由跳转时，router-link配合v-for一起用会出现警告，所以弃用了router-link，改成用$router.push()就没问题了。

7、 还有些零零散散的小问题，比如在做搜索时，因为要响应手机键盘上的搜索键，所以使用了from表单，在action为空时第一次搜索会跳转到首页，显然不需要这个效果，所以填写了action="javascript:;"，还有给组件的根元素绑定原生事件时需要加上修饰符native，ref注册引用信息，用在子组件上就是指向组件实例，用在DOM元素上就是指向DOM元素，这些需要注意的细节因为我的功力不够深厚而或多或少阻止了我前进的步伐，总而言之，千里之行始于足下，继续加油吧。