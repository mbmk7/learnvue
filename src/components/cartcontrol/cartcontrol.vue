<template>
<!-- 食物购买加减组件 -->
<div class="cartcontrol">
  <transition name="move">
    <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart"></div>
  </transition>
  <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
</div>
</template>

<script>
import Vue from 'vue';
export default {
  data () {
    return {};
  },

  props: {
    food: {
      type: Object
    }
  },

  // created () {
  //   console.log(this.food);
  // },

  methods: {
    addCart (event) {
      if (!event._constructed) { // 判断是不是PC浏览器，避免双击
        return;
      }
      // console.log('click');
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1); // 用Vue.set向响应式对象中添加一个响应式属性
      } else {
        this.food.count++;
      }
      this.$emit('cart-add', event.target); // 用$emit向父组件goods派发一个事件cart-add，并传递一个值event.target
    },
    decreaseCart (event) {
      if (!event._constructed) { // 判断是不是PC浏览器，避免双击
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang="less">
  .cartcontrol{
    font-size: 0;
    .cart-decrease, .cart-add{
      display: inline-block;
      padding: 6px; // 增加点击区域
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }
    .cart-count{
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
    // .cart-add{
    //   color: rgb(0, 160, 220);
    // }
     // 过渡
    .cart-decrease.move-enter,.cart-decrease.move-leave-to{ //进入过渡开始的状态，离开过渡结束状态
      opacity: 0;
      transform: translateX(24px)rotate(180deg);
    }
    .cart-decrease.move-enter-active,.cart-decrease.move-leave-active{ //进入过渡的过程，离开过渡的过程
      transition: all 0.4s linear;
    }
  }
</style>
