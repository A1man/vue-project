import Vue from 'vue'
import Router from 'vue-router'

import Guide from '@/components/homePage/guide'
import Index from '@/components/homePage/index'
import Detail from '@/components/contents/detail'
import All from '@/components/isAll/all'
import Banner from '@/components/banners/banner'
import Classify from '@/components/classifys/classify'
import MineIndex from '@/components/mine/mine-index'
import MineCollect from '@/components/mine/mine-collect'
import MineInterest from '@/components/mine/mine-interest'
import Author from '@/components/mine/author'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '/',
  		redirect: '/guide'
  	},
    {
      path: '/guide',
      name: 'Guide',
      component: Guide
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/all',
      name: 'All',
      component: All
    },
    {
      path: '/banner',
      name: 'Banner',
      component: Banner
    },
    {
      path: '/classify',
      name: 'Classify',
      component: Classify
    },
    {
      path: '/mine',
      name: 'MineIndex',
      component: MineIndex
    },
    {
      path: '/collect',
      name: 'MineCollect',
      component: MineCollect
    },
    {
      path: '/interest',
      name: 'MineInterest',
      component: MineInterest
    },
    {
      path: '/author',
      name: 'Author',
      component: Author
    }
  ]
})
