<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header> <!-- v-bind向子组件传递seller对象 -->
    <div class="tab border-1px"> <!-- 这里添加了一个border-1px，用于实现1px边框，在base中定义 -->
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view v-bind:seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue';
import {urlParse} from './common/js/util.js';

const ERR_OK = 0; // 设置一个错误代码常量，方便维护

export default {
  data: function () {
    return {
      seller: {
        id: (() => { // id用于本地储存
          let queryParam = urlParse(); // 通用方法 写在common中,解析url中的ID数据
          console.log(queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created () { // 调用created钩子函数,真实中向服务器请求数据时会附上商家ID，让服务器返回相应id的数据
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;
      // console.log(response);
      if (response.errno === ERR_OK) {
        // this.seller = response.data;
        this.seller = Object.assign({}, this.seller, response.data); // Object.assign()合并对象属性
      }
    });
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang="less">
  @import "./common/less/mixin.less";

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // border-bottom: 1px solid rgba(7,17,27,0.1);
    .border-btm-1px(rgba(7,17,27,0.1)); // less mixin 给.boder-1px传如参数，调用mixin.less,这里并没有实现移动端1px
    // .border-top-1px(rgba(7,17,27,0.1)); // 这里是上边框，这里并不需要

    .tab-item {
      flex: 1;
      text-align: center;
      a{
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);
      }
      a.router-link-active{
        color: rgb(240, 20, 20)
      }
    }
  }
}
</style>
