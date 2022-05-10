<template>
  <el-dialog title="子项目管理" :visible.sync="dialog" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-button type="text" @click="add">新增</el-button>
    <el-table :data="data">
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          <el-button type="text"  @click="editSubProject(scope.row,scope.$index)">{{scope.row.projectName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="changeName(scope.$index)">更改名称</el-button>
          <el-button size="mini" type="danger" @click="del(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false" type="primary">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getData} from "@/components/ef/data";
import { v4 as uuidv4 } from 'uuid';

export default {
  name:"SubProject",
  props:{
    data:Array
  },
  data(){
    return {
      dialog: false
    }
  },
  methods:{
    open(){
      this.dialog = true
    },
    add(){
      const i  = prompt('输入项目名称')
      if(i){
        this.data.push({
          projectName: i,
          data: getData(),
          key: uuidv4()
        })
      }

    },
    del(index){
      this.$confirm('是否确认删除此项目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.data.splice(index,1)
      })
    },
    changeName(index){
      this.$prompt('请输入新的名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.data[index].projectName = value
      })
    },
    editSubProject(row,index){
      this.$emit('editSub',{
        data:row.data,
        key:row.key
      })
      this.dialog = false
    }
  }
}
</script>
