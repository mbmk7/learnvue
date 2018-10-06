<template>
    <div class="star" :class="starSize" >
        <span
        v-for="(starType, index) in starTypes"
        :key="index"
        :class="starType"
        class="star-item"
        ></span>
    </div>
</template>

<script type='text/ecmascript-6'>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
  props: {
    size: { type: Number },
    score: { type: Number }
  },
  computed: {
    starSize: function () {
      return 'star-' + this.size;
    },
    starTypes: function () {
      let result = [];
      let score = Math.floor(this.score * 2) / 2; // 变成0.5的整数倍的数
      let hasDecimal = score % 1 !== 0;
      let integer = Math.floor(score);
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON);
      }
      if (hasDecimal) {
        result.push(CLS_HALF);
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF);
      }
      return result;
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/mixin.less";
.star {
  font-size: 0;
  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }
  &.star-48 {
    .star-item {
      width: 20px;
      height: 20px;
      margin-right: 22px;
      background-size: 20px 20px;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        // 全星
        .bg-image("star48_on");
      }
      &.half {
        // 半星
        .bg-image("star48_half");
      }
      &.off {
        // 无星
        .bg-image("star48_off");
      }
    }
  }
  &.star-36 {
    .star-item {
      width: 15px;
      height: 15px;
      margin-right: 6px;
      background-size: 15px 15px;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        // 全星
        .bg-image("star36_on");
      }
      &.half {
        // 半星
        .bg-image("star36_half");
      }
      &.off {
        // 无星
        .bg-image("star36_off");
      }
    }
  }
  &.star-24 {
    .star-item {
      width: 10px;
      height: 10px;
      margin-right: 3px;
      background-size: 10px 10px;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        // 全星
        .bg-image("star24_on");
      }
      &.half {
        // 半星
        .bg-image("star24_half");
      }
      &.off {
        // 无星
        .bg-image("star24_off");
      }
    }
  }
}
</style>
