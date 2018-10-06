<template>
<!-- 根元素goods -->
<div class="goods">
<!-- 左侧菜单栏 -->
  <div class="menu-wrapper">
    <ul>
      <!-- 对比遍历的index与计算的滚动的当前index，来激活current类名 -->
      <!-- 点击菜单后，右侧食物滚动到相应区块，传入index参数 -->
      <li
      v-for="(item, index) in goods"
      :key="index"
      :class="{current: currentIndex === index}"
      class="menu-item"
      @click="selectMenu(index,$event)">
      <span class="text">
        <span
        v-show="item.type>0"
        :class="classMap[item.type]"
        class="icon">
        </span>{{item.name}}
      </span>
      </li>
    </ul>
  </div>
  <!-- 右侧食物栏 -->
  <div class="foods-wrapper">
    <ul>
      <!-- 遍历goods，得到每个类别的food-list -->
      <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
        <h1 class="title">{{item.name}}</h1>
        <ul>
          <!-- 遍历foods，得到每一个food -->
          <li @click="selectFood(food,$event)" v-for="(food, index) in item.foods" :key="index" class="food-item">
            <!-- 每一个food，分为左右两块 -->
            <div class="icon">
              <img :src="food.icon" width="57" height="57">
            </div>
            <!-- 右部 -->
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}份</span>
                <span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
              </div>
              <!-- 食物购买加减组件 -->
              <div class="cartcontrol-wrapper">
              <!-- v-on:cart-add,监听子组件派发的事件cart-add -->
                <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <!-- 给购物车组件传入配送费和最低起送价 -->
  <!-- 传选择的食物数组给购物车 -->
  <!-- shopcart组件，监听food组件转发的cart-add事件  -->
  <shopcart
  :delivery-price="seller.deliveryPrice"
  :min-price="seller.minPrice"
  :select-foods="selectFoods"
  ref="shopcart"
  v-on:cart-add="cartAdd"></shopcart> <!-- ref引用，因为在子组件上使用，父组件的 $refs 指向子组件实例 -->
  <!-- food组件，监听food组件转发的cart-add事件  -->
  <food :food="selectedFood" ref="food" v-on:cart-add="cartAdd"></food>
</div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';

const ERR_OK = 0; // 设置一个错误代码常量，方便维护

export default {

  props: {
    seller: {
      type: Object
    }
  },

  data: function () {
    return {
      goods: [],
      listHeight: [], // 一个递增的数组，记录的是每一个区块的累计高度
      scrollY: 0, // 当前滚动到的高度
      selectedFood: {}
    };
  },

  components: {
    shopcart,
    cartcontrol,
    food
  },

  computed: {
    // 当滚动发生时，scrollY实时变化，这里对比滚动高度与区块高度，实时计算i值
    currentIndex: function () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        // 当前高度，不是最后一个的高度，且在相邻2个区块高度之间
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0; // 未滚动返回0
    },
    // 被选择的菜品数组
    selectFoods () {
      let foods = []; // foods,被选择的菜品数组
      this.goods.forEach((good) => { // goods，所有菜品分类的对象，good，每一个菜品分类对象
        good.foods.forEach((food) => { // good.foods，菜品分类里的菜品对象数组，food每一道菜品对象
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },

  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(function () { // 在拿到数据，Dom更新后立刻调用，操作dom时要用$nextTick
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },

  methods: {
    // 选择菜单，右侧食物滚动到对应区块
    selectMenu (index, event) {
      // pc浏览器的原生event事件对象是没有_constructed属性的，这里pc判断是浏览器时，直接return
      // 当是better-scroll派发的时，event._constructed为true，判断为非，不return，向下执行
      if (!event._constructed) {
        return;
      }
      // console.log(index);
      let foodList = document.querySelectorAll('.food-list-hook'); // 获取区块列表
      // let foodList = this.$els.foodsWrapper.getElementsByClassName('.food-list-hook');
      let el = foodList[index]; // 找到点击的index对应的区块Dom
      this.foodsScroll.scrollToElement(el, 300); // Better-scroll方法scrollToElement
    },
    // 点击食物，展开食物详情页
    selectFood (food, event) {
      if (!event._constructed) { // 避免PC段双击
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    // 滚动
    _initScroll () {
      // 完整写法
      let wrapper = document.querySelector('.menu-wrapper');
      // 在移动端因为better-scroll默认会阻止原生事件，所以在options中设置click: true，给它派发一个click事件
      // PC浏览器中不会阻止，如果设置了，这时候就会点击两次
      this.menuScroll = new BScroll(wrapper, {
        click: true
      });
      // 简写
      this.foodsScroll = new BScroll('.foods-wrapper', {
        click: true,
        probeType: 3 // 在屏幕滚动或滚动动画中实时派发scroll事件
      });
      // 在滚动时获取scrollY，BSscroll的on方法监听,获取当前高度
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y)); // 当前滚动到的高度
      });
    },
    // 计算foods各个区块高度
    _calculateHeight () {
      let foodList = document.querySelectorAll('.food-list-hook');
      // console.log(foodList);
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height); // 构造了一个递增的数组，记录的是每一个区块的累计高度
      }
    },

    // 这里是子组件cartcontrol派发的cart-add事件处理函数cartAdd
    cartAdd (target) {
      // console.log(1111);
      // console.log(target); // target为子组件传递的值，点击的加号的dom元素
      this.$nextTick(() => { // 因为会同时开启两个过渡，异步执行下落动画，优化性能
        this.$refs.shopcart.drop(target); // $refs指向子组件实例,这里调用了shopcart组件的drop方法，小球动画
      });
    }
  }
  // events: {}
};
</script>

<style lang="less">
@import "../../common/less/mixin.less";

//根元素
.goods{
  display: flex; //flex布局
  position: absolute;
  top: 174px; //head模块+tab的高度
  bottom: 46px; //购物车组件横框高度
  width: 100%;
  overflow: hidden;
  //左侧菜单栏
  .menu-wrapper{
    flex: 0 0 80px; //项目长度80px
    width: 80px;
    background-color: #f3f5f7;
    .menu-item{
      display: table; // 让下边的text居中
      height: 54px;
      width: 56px;
      padding: 0 12px;
      line-height: 14px;
      &.current{
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background-color: #fff;
        font-weight: 700;
        .text{
          .border-none();
        }
      }
      .icon{
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        //小图标动态绑定的class的相应图标
        &.decrease{
          .bg-image("decrease_3");
        }
        &.discount{
          .bg-image("discount_3");
        }
        &.guarantee{
          .bg-image("guarantee_3");
        }
        &.invoice{
          .bg-image("invoice_3");
        }
        &.special{
          .bg-image("special_3");
        }
      }
      .text{
        display: table-cell; // 不管一行还是两行都会垂直居中
        width: 56px;
        vertical-align: middle; // 垂直居中
        .border-btm-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }
  //右侧食物栏
  .foods-wrapper{
    flex: 1;
    .title{
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
    }
    .food-item{
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      .border-btm-1px(rgba(7, 17, 27, 0.1));
      &:last-child{
        .border-none();
        margin-bottom: 0;
      }
      .icon{
        flex: 0 0 57px;
        margin-right: 10px;
      }
      .content{
        flex: 1;
        .name{
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .desc,.extra{
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .desc{
          margin-bottom: 8px;
          line-height: 12px;
        }
        .extra{
          .count{
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
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
