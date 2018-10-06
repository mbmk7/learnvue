<template>
  <div class="header">
    <div class="content-wrapper">
      <!-- 头像 -->
      <div class="avatar">
        <img v-bind:src="seller.avatar" alt="" width="64" height="64"> <!-- v-bind 关联seller对象 -->
      </div>
      <!-- 顶部内容 -->
      <div class="content">
        <!-- 品牌图标与商家名称 -->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <!-- 商家描述 -->
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 支持的优惠，显示第一个 -->
        <div class="support" v-if="seller.supports">
          <span class="icon" v-bind:class="classMap[seller.supports[0].type]"></span> <!-- v-bind 动态绑定小图标的class -->
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <!-- 支持的优惠个数，点击显示详情页 -->
      <div v-if="seller.supports" class="support-count" v-on:click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i> <!-- 这里是图标字体 -->
      </div>
    </div>
    <!-- 公告 -->
    <div class="bulletin-wrapper" v-on:click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i> <!-- 这里是图标字体 -->
    </div>
    <!-- 背景图 -->
    <div class="background">
      <img :src="seller.avatar" width="100%">
    </div>
    <!-- 主体结束 -->
    <!-- 详情页浮层开始 -->
    <!-- transition组件包裹，淡入淡出效果 -->
    <transition name="fade"> <!-- 具名fade -->
      <div v-show="detailShow" class="detail"> <!-- 商家详情页浮层 css sticky footer布局 -->
        <div class="detail-wrapper clearfix"> <!-- 详细信息包裹 css sticky footer布局 1-->
          <!-- 详情页主体开始 -->
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1> <!-- 商家名称 -->
            <div class="star-wrapper"> <!-- 星星模块 -->
              <star :size="48" :score="seller.score"></star>
            </div>
            <!-- 优惠信息分栏 flex布局 -->
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <!-- 优惠信息详情 -->
            <ul class="supports" v-if="seller.supports">
              <li
              class="support-item"
              v-for="(item, index) in seller.supports"
              :key="index">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span> <!-- 小图标 -->
                <span class="text">{{seller.supports[index].description}}</span>  <!-- 文字内容 -->
              </li>
            </ul>
            <!-- 商家公告栏 flex布局 -->
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <!-- 商家公告内容 -->
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" v-on:click="hideDetail"> <!-- 关闭按钮 css sticky footer布局 2 -->
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type='text/ecmascript-6'>

import star from '../star/star.vue';

export default {
  props: {
    seller: { // 注册seller，设定类型为Object
      type: Object
    }
  },
  data: function () {
    return {
      detailShow: false
    };
  },
  methods: {
    showDetail: function () {
      this.detailShow = true;
    },
    hideDetail: function () {
      this.detailShow = false;
    }
  },
  // 将小图标的class与seller.supports[0].type 的 0 1 2 3 4 对应起来
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  components: {
    star
  }
};
</script>

<style lang="less">
@import "../../common/less/mixin.less";

.header{
  position: relative;
  color: #fff;
  background-color: rgba(7, 17, 27, 0.5);
  overflow: hidden;
  .content-wrapper{
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0px; //消除子元素因为一些空白字符产生的缝隙，但需要在有文字的子元素内重设字体大小
    .avatar{
      display: inline-block;
      vertical-align: top;
      img{
        border-radius: 2px;
      }
    }
    .content{
      display: inline-block;
      // font-size: 14px; //下边都有各自字体大小，这里取消   重设字体大小
      margin-left: 16px;
      .title{
        margin: 2px 0 8px 0;
        .brand{ //品牌
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          // background-image: url('brand@3x.png');
          .bg-image("brand");
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name{   //名称
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
        }
      }
      .description{ //描述
        margin-bottom: 10px;
        line-height: 12px;
        font-size: 12px;
      }
      // 支持的各种优惠活动
      .support{
        .icon{
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          //小图标动态绑定的class的相应图标
          &.decrease{
            .bg-image("decrease_1");
          }
          &.discount{
            .bg-image("discount_1");
          }
          &.guarantee{
            .bg-image("guarantee_1");
          }
          &.invoice{
            .bg-image("invoice_1");
          }
          &.special{
            .bg-image("special_1");
          }
        }
        .text{
          line-height: 12px;
          font-size: 10px;
        }
      }
    }
    .support-count{
      position: absolute;
      right: 12px;
      bottom: 14px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      background-color: rgba(0,0,0,0.2);
      text-align: center;
      .count{
        vertical-align: top;
        font-size: 10px;
      }
      .icon-keyboard_arrow_right{
        font-size: 10px;
        line-height: 24px;
        margin-left: 2px;
      }
    }
  }
  .bulletin-wrapper{
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    background-color: rgba(7,17,27,0.2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .bulletin-title{
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
      width: 22px;
      height: 12px;
      .bg-image("bulletin");
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }
    .bulletin-text{
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }
    .icon-keyboard_arrow_right{
      position: absolute;
      font-size: 10px;
      right: 10px;
      top: 8px;
    }
  }
  .background{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }
  .detail{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(7, 17, 27, 0.8);
    -webkit-backdrop-filter: blur(10px); // 为背景添加模糊，作用于当前元素，ios适用
    // backdrop-filter: blur(10px);
    .detail-wrapper{ // css sticky footer布局 外层包裹 清除浮动，让底部上来
      min-height: 100%;
      width: 100%;
      .detail-main{ // css sticky footer布局 1 底部留出关闭按钮的空间
        margin-top: 64px;
        padding-bottom: 64px;
        .name{
          line-height: 16px;
          font-size: 16px;
          text-align: center;
          font-weight: 700;
        }
        .star-wrapper{
          margin-top: 16px;
          padding: 2px 0;
          text-align: center;
        }
        .title{
          display: flex;
          width: 80%;
          margin: 28px auto 24px auto;
          .line{
            flex: 1;
            // position: relative;
            top: -6px;
            .border-btm-1px(rgba(255, 255, 255, 0.2));
          }
          .text{
            padding: 0 12px;
            font-size: 14px;
            font-weight: 700;
          }
        }
        .supports{
          width: 80%;
          margin: 0 auto;
          .support-item{
            padding: 0 12px;
            margin-bottom: 12px;
            font-size: 0;
            &:last-child{
              margin-bottom: 0;
            }
            .icon{
              display: inline-block;
              width: 16px;
              height: 16px;
              vertical-align: top;
              margin-right: 6px;
              background-size: 16px 16px;
              background-repeat: no-repeat;
              //小图标动态绑定的class的相应图标
              &.decrease{
                .bg-image("decrease_2");
              }
              &.discount{
                .bg-image("discount_2");
              }
              &.guarantee{
                .bg-image("guarantee_2");
              }
              &.invoice{
                .bg-image("invoice_2");
              }
              &.special{
                .bg-image("special_2");
              }
            }
            .text{
              line-height: 16px;
              font-size: 12px;
            }
          }
        }
        .bulletin{
          width: 80%;
          margin: 0 auto;
          .content{
            padding: 0 12px;
            line-height: 24px;
            font-size: 12px;
          }
        }
      }
    }
    // css sticky footer布局,底部关闭按钮
    .detail-close{
      position: relative;
      width: 32px;
      height: 32px;
      margin: -64px auto 0 auto;
      clear: both;
      font-size: 32px;
    }
  }
}
// 淡入淡出过渡
.fade-enter,.fade-leave-to{ //进入过渡开始的状态，离开过渡结束状态
  opacity: 0;
}
.fade-enter-active,.fade-leave-active{ //进入过渡的过程，离开过渡的过程
  transition: opacity 0.5s;
}
</style>
