<template>
<div class="shopcart">
  <!-- 分成左右2块 -->
  <div class="content" @click="toggleList">
    <!-- 左块自适应宽度 -->
    <div class="content-left">
      <!-- logo为字体图标 -->
      <!-- 动态绑定高亮类名 -->
      <div class="logo-wrapper">
        <div class="logo" :class="{highlight:totalCount>0}">
          <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
        </div>
      <!-- 选择的商品数量 -->
        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
      </div>
      <!-- 价格 -->
      <!-- 动态绑定高亮类名 -->
      <div class="price" :class="{highlight:totalCount>0}">￥{{totalPrice}}</div>
      <!-- 运费等描述 -->
      <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <!-- 右块固定宽度 结算-->
    <div class="content-right" @click.stop="pay">
      <div class="pay" :class="payClass">{{payDesc}}</div>
    </div>
  </div>
  <!-- 点击加号小球掉落到购物车 -->
  <div class="ball-container">
    <transition-group name="drop" tag="div"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:after-enter="afterEnter">
      <div v-for="(ball, index) in balls" :key="index" v-show="ball.show" class="ball">
        <div class="inner inner-hook"></div> <!--因为要做抛物线轨迹，所以分成X轴Y轴2个过渡,inner 为X轴-->
      </div>
    </transition-group>
  </div>
  <!-- 购物车列表 -->
  <transition name="fold">
    <div class="shopcart-list" v-show="ListShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content">
        <ul>
          <li class="food" v-for="(food, index) in selectFoods" :key="index">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price * food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
          <!-- 因为跨多级无法监听，所以在food里监听cart-add，再转发给goods -->
              <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
  <!-- 购物车列表展开时的模糊背景,同样用ListShow控制 -->
  <transition name="fade">
    <div class="list-mask" v-show="ListShow" @click="hideList"></div>
  </transition>
</div>
</template>

<script>
// import Vue from 'vue';
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';

export default {
  data () {
    return {
      // scroll: {},
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      // 下落的小球
      dropBalls: [],
      // 购物车列表爱是否折叠,折叠时true，展开时false
      fold: true
    };
  },

  props: {
    // 从goods组建传入选择的食物food对象数组，key为 价格 数量
    selectFoods: {
      type: Array,
      default () {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },

  components: {
    cartcontrol
  },

  computed: {
    // 根据goods组件传来的selectfoods对象数组计算总价
    totalPrice () {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    // 计算数量总和
    totalCount () {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    // 结账
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差${diff}元起送`;
      } else {
        return '去结算';
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      }
      return 'enough';
    },
    // 控制购物车列表折叠展开,这里加入betterScroll滚动插件
    ListShow () {
      if (!this.totalCount) {
        // 没有点菜时，保持折叠，fold为true，返回false
        // this.fold = true; // 不应在计算属性中对属性赋值
        return false;
      }
      let show = !this.fold; // 有点菜时，点击后取了一次反，为false，这里再取反一次，然后返回展开
      // 因为只有列表展开时才需要给她滚动，所以在这里初始化
      // if (show) {
      //   this.$nextTick(() => { // 同样的，滚动依赖于dom，所以等更新完再调用
      //     if (!this.scroll.refresh) { // 如果之前没有初始化过，就NEW一个
      //       let wrapper = document.querySelector('.list-content');
      //       // this.scroll = new BScroll(wrapper, { // 因为在计算属性中最好不要给属性赋值，所以移动到监听器中
      //       //   click: true
      //       // });
      //       // 可以使用Vue.set在计算属性中设置属性值，但是需要在data中注册，上边的逻辑会变化，还要引入Vue
      //       Vue.set(this, 'scroll', new BScroll(wrapper, {click: true}));
      //     } else {
      //       this.scroll.refresh(); // 之前初始化过，刷新
      //     }
      //   });
      // }
      return show;
    }
  },
  watch: {
    // 因为在计算属性中最好不要给属性赋值，所以在监听器中完成
    // 当ListShow变化时，查看是否有点菜，没有就设置购物车列表状态为折叠
    // 这里会在ListShow变为false时直接设置fold为true
    // 避免上一次在展开时去掉所有菜品后，fold为false时，添加菜品会直接展开购物车列表的bug
    ListShow: function () {
      if (!this.totalCount) {
        this.fold = true;
      }
      if (!this.fold) { // 列表展开时，初始化BetterScroll
        this.$nextTick(() => { // 同样的，滚动依赖于dom，所以等更新完再调用
          if (!this.scroll) { // 如果之前没有初始化过，就NEW一个
            this.scroll = new BScroll('.list-content', { // 因为在计算属性中最好不要给属性赋值，所以移动到监听器中
              click: true
            });
          } else {
            this.scroll.refresh(); // 之前初始化过，刷新
          }
        });
      }
    }
  },

  methods: {
    drop (el) {
      // el为点击的那个加号dom元素
      // console.log(el);
      // 遍历小球，取第一个show是false的小球，改为true
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          // 增加一个key，表示点击的加号元素
          ball.el = el;
          // 将小球推入dropball，下落的小球数组
          this.dropBalls.push(ball);
          return;
        }
      }
    },

    // JS钩子
    beforeEnter (el) {
      // el是小球，不是加号
      // console.log('beforeenter');
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          // 获取show为true的小球，即要运动的小球
          let rect = ball.el.getBoundingClientRect(); // 获取小球相对于视窗的位置集合
          let x = rect.left - 32; // X轴上，小球从起点相对于终点的位移
          let y = -(window.innerHeight - rect.top - 22); // y轴上，小球从起点相对于终点的位移
          // console.log(x);
          // console.log(y);
          let inner = el.getElementsByClassName('inner-hook')[0]; // 因为要做抛物线轨迹，所以分成X轴Y轴2个过渡，inner为X轴
          // el.style.display = 'block';
          el.style.transform = `translateY(${y}px)`; // 设定掉落小球起始位置,Y轴
          inner.style.transform = `translateX(${x}px)`; // 设定掉落小球起始位置,X轴
        }
      }
    },
    // enter必须用done回调
    enter (el, done) {
      // console.log('enter');
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight; // 触发浏览器重绘
      this.$nextTick(() => {
        // dom更新后，调用
        let inner = el.getElementsByClassName('inner-hook')[0]; // 因为要做抛物线轨迹，所以分成X轴Y轴2个过渡，inner为X轴
        el.style.transform = 'translateY(0)';
        inner.style.transform = 'translateX(0)';
      });
      done();
    },
    afterEnter (el) {
      // console.log('afterenter');
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        // el.style.display = 'none';
      }
    },
    // 展开、收起购物车列表
    toggleList () {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    // 清空购物车列表
    empty () {
      // this.selectFoods = []; // 不要直接改成空数组，会影响到父组件
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    // 购物车列表展开时点击模糊背景，收起列表
    hideList () {
      this.fold = true;
    },
    // 结账
    pay () {
      if (this.totalPrice < this.minPrice) { // 总价小于最低价
        return;
      }
      window.alert(`支付${this.totalPrice}元`);
    },
    // 因为跨多级无法监听，所以在food里监听cart-add，再转发给goods
    cartAdd (targrt) {
      this.$emit('cart-add', event.target); // 用$emit向父组件goods派发一个事件cart-add，并传递一个值event.target
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/mixin.less";

// 整个模块固定定位在底部
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  .content {
    display: flex;
    background-color: #141d27;
    font-size: 0px;
    color: rgba(255, 255, 255, 0.4);
    .content-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background-color: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #2b343c;
          text-align: center;
          &.highlight {
            // 有选中商品时高亮
            background-color: rgb(0, 160, 220);
          }
          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            // color: rgba(255, 255, 255, 0.4);
            &.highlight {
              // 有选中商品时高亮
              color: #fff;
            }
          }
        }
        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background-color: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price {
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        border-right: 1px solid rgba(255, 255, 255, 0.4);
        // color: rgba(255, 255, 255, 0.4);
        font-size: 16px;
        font-weight: 700;
        &.highlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin: 12px 0 0 12px;
        // color: rgba(255, 255, 255, 0.4);
        font-size: 10px;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 700;
        background-color: #2b333b;
        &.not-enough {
          background-color: #2b333b;
        }
        &.enough {
          background-color: #00b43c;
          color: #fff;
        }
      }
    }
  }
  // 小球过渡
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgb(0, 160, 220);
        transition: all 0.4s;
      }
    }
  }
  // 购物车列表
  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translateY(-100%);
    .list-header{
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background-color: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title{
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .empty{
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }
    .list-content{
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background-color: #fff;
      .food{
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        .border-btm-1px(rgba(7, 17, 27, 0.1));
        .name{
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .price{
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }
        .cartcontrol-wrapper{
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
  // 购物车列表展开时的模糊背景
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 1;
    background-color: rgba(7, 17, 27, 0.6);
    -webkit-backdrop-filter: blur(10px);
    // backdrop-filter: blur(10px);
  }
  // 购物车列表过渡
  .fold-enter,.fold-leave-to{ //进入过渡开始的状态，离开过渡结束状态
    transform: translateY(0);
  }
  .fold-enter-active,.fold-leave-active{ //进入过渡的过程，离开过渡的过程
    transition: all 0.6s;
  }
  // 购物车列表模糊背景过渡
  .fade-enter,.fade-leave-to{ //进入过渡开始的状态，离开过渡结束状态
    background-color: rgba(7, 17, 27, 0);
    opacity: 0;
  }
  .fade-enter-active,.fade-leave-active{ //进入过渡的过程，离开过渡的过程
    transition: all 0.6s;
  }
}
</style>
