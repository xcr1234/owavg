<template>
    <div v-show="node.id || line.from">
        <div class="ef-node-form">
            <div class="ef-node-form-header">
                编辑
            </div>
            <div class="ef-node-form-body">
                <el-form :model="node" ref="dataForm" label-width="80px" v-show="type === 'node'">
                  <el-form-item label="id">
                    <el-input v-model="node.id" disabled></el-input>
                  </el-form-item>
                    <el-form-item label="类型">
                        <el-input v-model="node.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model="node.name"></el-input>
                    </el-form-item>
                  <template v-if="node.type === 'message' || node.type === 'choose'">
                    <el-form-item label="对话英雄">
                      <el-select v-model="node.hero">
                        <el-option :value="$config.defaultHero" :label="$config.defaultHero"></el-option>
                        <el-option v-for="hero in $config.allHeroes" :key="hero" :value="'英雄(' + hero + ')'" :label="hero"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="对话内容" >
                      <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入对话内容"
                        v-model.trim="node.message">
                      </el-input>
                    </el-form-item>
                  </template>
                  <template  v-if="node.type === 'choose'">
                    <el-form-item label="选项1">
                      <el-input
                        placeholder="请输入选项"
                        v-model.trim="node.choose1" />
                    </el-form-item>
                    <el-form-item label="选项2">
                      <el-input
                        placeholder="请输入选项"
                        v-model.trim="node.choose2" />
                    </el-form-item>
                    <el-form-item label="选项3">
                      <el-input
                        placeholder="请输入选项，没有则留空"
                        v-model.trim="node.choose3" />
                    </el-form-item>
                    <el-form-item label="选项4">
                      <el-input
                        placeholder="请输入选项，没有则留空"
                        v-model.trim="node.choose4" />
                    </el-form-item>
                    <el-form-item label="选项5">
                      <el-input
                        placeholder="请输入选项，没有则留空"
                        v-model.trim="node.choose5" />
                    </el-form-item>
                  </template>
                  <!--                    <el-form-item label="left坐标">
                                          <el-input v-model="node.left" :disabled="true"></el-input>
                                      </el-form-item>
                                      <el-form-item label="top坐标">
                                          <el-input v-model="node.top" :disabled="true"></el-input>
                                      </el-form-item>
                                      <el-form-item label="ico图标">
                                          <el-input v-model="node.ico"></el-input>
                                      </el-form-item>
                                      <el-form-item label="状态">
                                          <el-select v-model="node.state" placeholder="请选择">
                                              <el-option
                                                      v-for="item in stateList"
                                                      :key="item.state"
                                                      :label="item.label"
                                                      :value="item.state">
                                              </el-option>
                                          </el-select>
                                      </el-form-item>-->
                    <el-form-item>
                      <el-button icon="el-icon-close" type="danger" :disabled="node.type === 'start'" @click="deleteNode">删除</el-button>
                      <el-button type="primary" icon="el-icon-check" @click="save">保存</el-button>
                    </el-form-item>
                  <el-form-item>
                  </el-form-item>
                </el-form>

                <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'">
                    <el-form-item label="标签">
                        <el-input v-model="line.label"></el-input>
                    </el-form-item>
                  <el-form-item label="选项编号">
                    <el-select v-model="line.choose" clearable placeholder="选择分支才需要填写">
                      <el-option value="c1" label="选项1"></el-option>
                      <el-option value="c2" label="选项2"></el-option>
                      <el-option value="c3" label="选项3"></el-option>
                      <el-option value="c4" label="选项4"></el-option>
                      <el-option value="c5" label="选项5"></el-option>
                    </el-select>
                  </el-form-item>
                    <el-form-item>
                      <el-button icon="el-icon-close" type="danger" @click="deleteLine">删除</el-button>
                        <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--            <div class="el-node-form-tag"></div>-->
        </div>
    </div>

</template>

<script>
    import { cloneDeep } from 'lodash'

    export default {
        data() {
            return {
                visible: true,
                // node 或 line
                type: 'node',
                node: {},
                line: {},
                data: {},
                stateList: [{
                    state: 'success',
                    label: '成功'
                }, {
                    state: 'warning',
                    label: '警告'
                }, {
                    state: 'error',
                    label: '错误'
                }, {
                    state: 'running',
                    label: '运行中'
                }]
            }
        },
        methods: {
            /**
             * 表单修改，这里可以根据传入的ID进行业务信息获取
             * @param data
             * @param id
             */
            nodeInit(data, id) {
                this.type = 'node'
                this.data = data
                data.nodeList.filter((node) => {
                    if (node.id === id) {
                        this.node = cloneDeep(node)
                    }
                })
            },
            lineInit(line) {
                this.type = 'line'
                this.line = line
            },
            // 修改连线
            saveLine() {
                this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label,this.line.choose)
            },
            save() {
                this.data.nodeList.filter((node) => {
                    if (node.id === this.node.id) {
                        node.name = this.node.name
                        node.left = this.node.left
                        node.top = this.node.top
                        node.ico = this.node.ico
                        node.state = this.node.state
                        node.hero = this.node.hero
                        node.message = this.node.message
                        node.choose1 = this.node.choose1
                      node.choose2 = this.node.choose2
                      node.choose3 = this.node.choose3
                      node.choose4 = this.node.choose4
                      node.choose5 = this.node.choose5
                        this.$emit('repaintEverything')
                    }
                })
            },
          deleteNode(){
              if(this.node.id){
                this.$emit('deleteNode',this.node.id)
              }
          },
          deleteLine(){
              if(this.line.from && this.line.to){
                this.$emit('deleteLine',{
                  from: this.line.from,
                  to: this.line.to
                })
              }
          }
        }
    }
</script>

<style>
    .el-node-form-tag {
        position: absolute;
        top: 50%;
        margin-left: -15px;
        height: 40px;
        width: 15px;
        background-color: #fbfbfb;
        border: 1px solid rgb(220, 227, 232);
        border-right: none;
        z-index: 0;
    }
</style>
