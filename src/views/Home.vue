<!--
 描述: 主页模板
 作者: Jack Chen
 日期: 2020-06-15
-->

<template>
  <div class="home-container">
    <Header />
    <div class="content clearfix">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name: 'Home',
  components: {
    Header,
    Footer,
  },
  computed: {},
  created() {},
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 60px);
  padding: 30px 40px;
}
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

