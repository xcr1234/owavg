<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://s95.cnzz.com/z_stat.php?id=1280767745&web_id=1280767745'
    script.language = 'JavaScript'
    document.body.appendChild(script)
  },
  watch: {
    '$route': {
      handler(to, from) {
        setTimeout(() => { //避免首次获取不到window._czc
          if (window._czc) {
            let location = window.location;
            let contentUrl = location.pathname + location.hash;
            let refererUrl = '/';
            // 用于发送某个URL的PV统计请求，
            window._czc.push(['_trackPageview', contentUrl, refererUrl])
          }
        }, 300)
      },
      immediate: true  // 首次进入页面即执行
    }
  }
}
</script>


