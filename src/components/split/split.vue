<template>
<div class="split"></div>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "../../common/less/mixin.less";
.split{
  width: 100%;
  height: 16px;
  background-color: #f3f5f7;
  .border-btm-1px(rgba(7, 17, 27, 0.1));
  .border-top-1px(rgba(7, 17, 27, 0.1));
}
</style>
