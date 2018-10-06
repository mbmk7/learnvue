<template>
<div class="ratingselect">
  <div class="rating-type">
    <span class="block positive" :class="{active:innerSelectType===2}" @click="select(2,$event)">
      {{desc.all}}
      <span class="count">{{ratings.length}}</span>
      </span>
    <span class="block positive" :class="{active:innerSelectType===0}" @click="select(0,$event)">
      {{desc.positive}}
      <span class="count">{{positives.length}}</span>
      </span>
    <span class="block negative" :class="{active:innerSelectType===1}" @click="select(1,$event)">
      {{desc.negative}}
      <span class="count">{{negatives.length}}</span>
      </span>
  </div>
  <div class="switch" :class="{on:innerOnlyContent}" @click="toggleContent">
    <span class="icon-check_circle"></span>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script>
// import Vue from 'vue';

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  data () {
    return {
      innerSelectType: this.selectType,
      innerOnlyContent: this.onlyContent
    };
  },

  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
    // innerSelectType () { // 用计算属性存放传入的的prop，方便在methods中修改
    //   return this.selectType;
    // },
    // innerOnlyContent () { // 用计算属性存放传入的的prop，方便在methods中修改
    //   return this.onlyContent;
    // }
  },

  props: {
    ratings: {
      type: Array,
      default () {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },

  methods: {
    select (type, event) {
      if (!event._constructed) { // 避免PC段双击
        return;
      }
      this.innerSelectType = type;
      this.$emit('ratingtype-select', type); // 给父组件传递选择的类型，selectType
    },
    toggleContent (event) {
      if (!event._constructed) { // 避免PC段双击
        return;
      }
      this.innerOnlyContent = !this.innerOnlyContent;
      this.$emit('content-toggle', this.innerOnlyContent); // 给父组件传递是否只看有内容评价，onlyContent
    }
  },

  watch: {
    // 监听传入的值变化时，给内部值赋值
    selectType: function () {
      this.innerSelectType = this.selectType;
    },
    // 监听传入的值变化时，给内部值赋值
    onlyContent: function () {
      this.innerOnlyContent = this.onlyContent;
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/mixin.less";

.ratingselect{
  .rating-type{
    padding: 18px 0;
    margin: 0 18px;
    .border-btm-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;
    .block{
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      border-radius: 1px;
      color: rgb(77, 85, 93);
      font-size: 12px;
      line-height: 16px;
      &.active{
        color: #fff;
      }
      .count{
        font-size: 8px;
        margin-left: 2px;
      }
      &.positive{
        background-color: rgba(0, 160, 220, 0.2);
        &.active{
        background-color: rgba(0, 160, 220, 1);
        }
      }
      &.negative{
        background-color: rgba(77, 85, 93, 0.2);
        &.active{
          background-color: rgba(77, 85, 93, 1);
        }
      }
    }
  }
  .switch{
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(147, 153, 159);
    font-size: 0;
    .icon-check_circle{
      display: inline-block;
      vertical-align: top;
      margin-right: 4px;
      font-size: 24px;
    }
    .text{
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
    &.on{
      .icon-check_circle{
        color: #00c850;
      }
    }
  }
}
</style>
