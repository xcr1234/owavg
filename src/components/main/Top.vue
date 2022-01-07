<template>
  <div class="ef-tooltar">
    <el-link type="primary" :underline="false">项目名称</el-link>
    <el-divider direction="vertical"></el-divider>
    <el-button type="text" icon="el-icon-delete" size="large" disabled></el-button>
    <el-divider direction="vertical"></el-divider>
    <el-button type="text" icon="el-icon-download" size="large"></el-button>
    <div style="float: right;margin-right: 5px">
      <el-button type="info" plain round icon="el-icon-document" size="mini">帮助</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Top"
}
</script>
