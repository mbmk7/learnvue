<template>
  <transition name="move">
    <div class="food" v-show="showFlag">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
          <!-- 因为跨多级无法监听，所以在food里监听cart-add，再转发给goods -->
          <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <!-- 分格组件 -->
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <!-- 分格组件 -->
        <split></split>
        <!-- 评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 评价选择组件 -->
          <ratingselect
          :select-type="selectType"
          :only-content="onlyContent"
          :desc="desc"
          :ratings="food.ratings"
          @ratingtype-select="selectTypeChange"
          @content-toggle="contentToggle"></ratingselect> <!-- 绑定传入控制数据,监听传入事件 -->
          <!-- 评价内容 -->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li
              v-for="(rating, index) in food.ratings"
              v-show="needShow(rating.rateType,rating.text)"
              :key="index"
              class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,
                  'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import {formatDate} from '../../common/js/date.js';
import cartcontrol from '../cartcontrol/cartcontrol';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';

/* eslint-disable no-unused-vars */
const POSITIVE = 0; // 用于控制ratingselect组件的常量
const NEGATIVE = 1;
const ALL = 2;

export default {
  data () {
    return {
      showFlag: false,
      // 控制ratingselect组件的数据
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },

  props: {
    food: {
      type: Object
    },
    selectedFood: {
      type: Object
    }
  },

  filters: { // 过滤器
    formatDate (time) { // 格式化日期
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },

  components: {
    cartcontrol,
    split,
    ratingselect
  },

  methods: {
    show () { // 由父组件来调用，控制food组件展开
      this.showFlag = true;
      this.selectType = ALL; // 初始化ratingselect组件
      this.onlyContent = false; // 初始化ratingselect组件
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll('.food', {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide () {
      this.showFlag = false;
    },
    addFirst (event) {
      if (!event._constructed) { // 避免PC段双击
        return;
      }
      Vue.set(this.food, 'count', 1);
      this.$emit('cart-add', event.target); // 用$emit向父组件goods派发一个事件cart-add，并传递一个值event.target
    },
    // 因为跨多级无法监听，所以在food里监听cart-add，再转发给goods
    cartAdd (targrt) {
      this.$emit('cart-add', event.target); // 用$emit向父组件goods派发一个事件cart-add，并传递一个值event.target
    },
    needShow (type, text) {
      if (this.onlyContent && !text) { // 只显示有内容评价且无评价内容时不显示
        return false;
      }
      if (this.selectType === ALL) { // 显示所有时，返回true，全部显示
        return true;
      } else {
        return type === this.selectType; // 显示选择的type评价
      }
    },
    selectTypeChange (type) {
      this.selectType = type;
      // this.$nextTick(() => {
      //   this.scroll.refresh();
      // });
    },
    contentToggle (innerOnlyContent) {
      this.onlyContent = innerOnlyContent;
      // this.$nextTick(() => {
      //   this.scroll.refresh();
      // });
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/mixin.less";

.food{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background-color: #fff;
  transform: translateX(0);
  // 过渡
  &.move-enter,&.move-leave-to{ //进入过渡开始的状态，离开过渡结束状态
    transform: translateX(100%);
  }
  &.move-enter-active,&.move-leave-active{ //进入过渡的过程，离开过渡的过程
    transition: all 0.6s linear;
  }
  .image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%; // 这里默认会和width一样
    img{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .back{
      position: absolute;
      top: 10px;
      left: 0;
      .icon-arrow_lift{
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .content{
    position: relative;
    padding: 18px;
    .title{
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }
    .detail{
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;
      .sell-count,.rating{
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
      .sell-count{
        margin-right: 12px;
      }
    }
    .price{
      font-weight: 700;
      line-height: 24px;
      .now{
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old{
        text-decoration: line-through;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .cartcontrol-wrapper{
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy{
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      font-size: 10px;
      border-radius: 12px;
      color: #fff;
      background-color: rgb(0, 160, 220);
      opacity: 1;
      // 淡入淡出过渡
      &.fade-enter,&.fade-leave-to{ //进入过渡开始的状态，离开过渡结束状态
        opacity: 0;
      }
      &.fade-enter-active,&.fade-leave-active{ //进入过渡的过程，离开过渡的过程
        transition: opacity 0.5s;
      }
    }
  }
  .info{
    padding: 18px;
    .title{
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .text{
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }
  .rating{
    padding-top: 18px;
    .title{
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .rating-wrapper{
      padding: 0 18px;
      .rating-item{
        position: relative;
        padding: 16px 0;
         border-bottom: 1px solid rgba(7, 17, 27, 0.1);
         .user{
           position: absolute;
           right: 0;
           top: 16px;
           line-height: 12px;
           font-size: 0;
           .name{
             display: inline-block;
             margin-right: 6px;
             vertical-align: top;
             font-size: 10px;
             color: rgb(147, 153, 159);
           }
           .avatar{
             border-radius: 50%;
           }
         }
         .time{
           margin-bottom: 6px;
           line-height: 12px;
           font-size: 10px;
           color: rgb(147, 153, 159);
         }
         .text{
           line-height: 16px;
           font-size: 12px;
           color: rgb(7, 17, 27);
           .icon-thumb_up,.icon-thumb_down{
             line-height: 16px;
             margin-right: 4px;
             font-size: 12px;
           }
           .icon-thumb_up{
             color: rgb(0, 160, 220);
           }
           .icon-thumb_down{
             color: rgb(147, 153, 159);
           }
         }
      }
      .no-rating{
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>
