import Vue from 'vue'
import './public/config'
import api from '@/request/api'

Vue.prototype.$api = api

// 应用
this.$api.user.userDetail(1, { test: 1 })
  .then(res => {})