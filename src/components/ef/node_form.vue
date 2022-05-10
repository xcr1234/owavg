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
                  <el-form-item label="子项目">
                    <el-select v-model="node.message">
                      <el-option v-for="(item) in childProjects" :key="item.key" :value="item.key" :label="item.projectName"></el-option>
                    </el-select>
                    <el-button v-if="sub" type="text" @click="$emit('openSub')">管理子项目</el-button>
                  </el-form-item>
                  <template v-if="node.type === 'message' || node.type === 'choose'">
                    <el-form-item label="压缩字符串">
                      <el-switch
                        v-model="node.disableCompress" :active-value="false" :inactive-value="true"
                        active-color="#13ce66"
                        inactive-color="#ff4949" ></el-switch>
                    </el-form-item>
                    <el-form-item label="对话英雄">
                      <el-select v-model="node.hero"    filterable @change="heroChange"
                                 allow-create
                                 default-first-option>
                        <template v-if="data.externHeroes">
                          <el-option v-for="hero in data.externHeroes" :key="hero" :value="hero" :label="hero"></el-option>
                        </template>
                        <el-option :value="$config.defaultHero" :label="$config.defaultHero"></el-option>
                        <el-option v-for="hero in $config.allHeroes" :key="hero" :value="'英雄(' + hero + ')'" :label="hero"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="对话内容" >
                      <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入对话内容"
                        v-model="node.message">
                      </el-input>
                    </el-form-item>
                  </template>
                  <el-form-item label="代码内容" v-if="node.type === 'code'">
                    <el-input v-model="node.code" placeholder="粘贴OW代码，在导出代码时会原样输出"
                              type="textarea"
                              :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item label="条件" v-if="node.type === 'ow-if'">
                    <el-input v-model="node.code" placeholder="粘贴OW代码 if条件"></el-input>
                  </el-form-item>
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
                  <el-form-item label="选项编号" v-if="line.nodeType === 'choose'">
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
        props:{
          sub: Boolean,
          childProjects: []
        },
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
            heroChange(val){
              this.$emit('heroChange',val)
            },
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
                        node.message = this.node.message ? this.node.message.trim() : this.node.message
                        node.choose1 = this.node.choose1
                      node.choose2 = this.node.choose2
                      node.choose3 = this.node.choose3
                      node.choose4 = this.node.choose4
                      node.choose5 = this.node.choose5
                      node.code = this.node.code
                      node.disableCompress = this.node.disableCompress
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
