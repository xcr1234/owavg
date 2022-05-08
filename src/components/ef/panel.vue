<template>
    <div v-if="easyFlowVisible" style="height: calc(100vh);">
        <el-row>
            <!--顶部工具菜单-->
            <el-col :span="24">
                <div class="ef-tooltar">
                  <el-dropdown  @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{projectName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="new">新建</el-dropdown-item>
                      <el-dropdown-item command="save">保存</el-dropdown-item>
                      <el-dropdown-item command="open">打开</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-divider direction="vertical"></el-divider>

                  <!--                    <el-button type="text" icon="el-icon-delete" size="large" @click="deleteElement" :disabled="!this.activeElement.type"></el-button>
                                      <el-divider direction="vertical"></el-divider>-->
                  <el-upload action="" :auto-upload="false" :show-file-list="false" :on-change="fileChange" accept=".json" style="display: inline-block">
                    <el-button type="text" ref="openBtn" icon="el-icon-upload2" size="large"></el-button>
                  </el-upload>
                  <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-download" size="large" @click="downloadData"></el-button>
<!--                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-plus" size="large" @click="zoomAdd"></el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-minus" size="large" @click="zoomSub"></el-button>-->
                    <div style="float: right;margin-right: 5px">
<!--                        <el-button type="info" plain round icon="el-icon-document" @click="dataInfo" size="mini">流程信息</el-button>-->
<!--                        <el-button type="primary" plain round @click="dataReloadA" icon="el-icon-refresh" size="mini">切换流程A</el-button>
                        <el-button type="primary" plain round @click="dataReloadB" icon="el-icon-refresh" size="mini">切换流程B</el-button>
                        <el-button type="primary" plain round @click="dataReloadC" icon="el-icon-refresh" size="mini">切换流程C</el-button>
                        <el-button type="primary" plain round @click="dataReloadD" icon="el-icon-refresh" size="mini">自定义样式</el-button>
                        <el-button type="primary" plain round @click="dataReloadE" icon="el-icon-refresh" size="mini">力导图</el-button>-->
                      <el-button type="primary" plain round icon="el-icon-document-checked" @click="downloadData">保存项目</el-button>
                      <el-button type="primary" plain round icon="el-icon-check" @click="exportCode">导出代码</el-button>
                      <el-button type="info" plain round icon="el-icon-document" @click="openHelp" size="mini">帮助</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div style="display: flex;height: calc(100% - 47px);">
            <div style="width: 230px;border-right: 1px solid #dce3e8;">
                <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
            </div>
            <div id="efContainer" ref="efContainer" class="container" v-flowDrag>
                <template v-for="node in data.nodeList">
                    <flow-node
                            :id="node.id"
                            :key="node.id"
                            :node="node"
                            :activeElement="activeElement"
                            @changeNodeSite="changeNodeSite"
                            @nodeRightMenu="nodeRightMenu"
                            @clickNode="clickNode"
                    >
                    </flow-node>
                </template>
                <!-- 给画布一个默认的宽度和高度 -->
                <div style="position:absolute;top: 2000px;left: 2000px;">&nbsp;</div>
            </div>
            <!-- 右侧表单 -->
            <div style="width: 300px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">
                <flow-node-form ref="nodeForm" @setLineLabel="setLineLabel"
                                @heroChange="heroChange"
                                @deleteNode="deleteNode" @deleteLine="onDeleteLine"
                                @repaintEverything="repaintEverything"></flow-node-form>
            </div>
        </div>
        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
        <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help>
      <el-dialog
        title="OWMOD GAL Designer"
        :visible.sync="modal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
        width="30%">
        <el-form>
          <el-form-item>
            <el-button type="text" @click="createProject" style="font-size: 18px;color:#409EFF">创建项目</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload action="" :auto-upload="false" :show-file-list="false" :on-change="fileChange" accept=".json" style="display: inline-block">
              <el-button type="text" style="font-size: 18px;color:#6cf">打开项目</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="openHelp" style="font-size: 18px;color:#909399">帮助</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      </span>
      </el-dialog>
      <el-dialog title="创建项目" :visible.sync="createModal" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form>
          <el-form-item label="项目名称">
            <el-input v-model.trim="createProjectData"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createModal = false">取消</el-button>
          <el-button @click="doCrateProject" type="primary">确定</el-button>

        </div>
      </el-dialog>
      <el-dialog title="生成代码" :visible.sync="codeModal" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-tabs v-model="codeTab">
          <el-tab-pane label="生成的代码" name="code">
            <pre class="code-pre">{{code}}</pre>
          </el-tab-pane>
          <el-tab-pane label="触发的代码" name="trigger">
            <pre class="code-pre">{{triggerCode}}</pre>
          </el-tab-pane>
          <el-tab-pane label="全局代码" name="all">
            <pre class="code-pre">{{modcode}}</pre>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="copyCode">复制到剪贴板</el-button>
          <el-button @click="codeHelp">帮助</el-button>
          <el-button @click="codeModal = false" type="primary">关闭</el-button>
        </div>
      </el-dialog>
    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    // import { jsPlumb } from 'jsplumb'
    // 使用修改后的jsplumb
    import './jsplumb'
    import { easyFlowMixin } from '@/components/ef/mixins'
    import flowNode from '@/components/ef/node'
    import nodeMenu from '@/components/ef/node_menu'
    import FlowInfo from '@/components/ef/info'
    import FlowHelp from '@/components/ef/help'
    import FlowNodeForm from './node_form'
    import lodash from 'lodash'
    import { getDataA } from './data_A'
    import { getDataB } from './data_B'
    import { getDataC } from './data_C'
    import { getDataD } from './data_D'
    import { getDataE } from './data_E'
    import { ForceDirected } from './force-directed'
    import { v4 as uuidv4 } from 'uuid';
    import {getData} from './data'
    import { saveAs } from 'file-saver';
    import gencode from "@/mod/gencode";
    import modcode from "@/mod/modcode";



    export default {
        data() {
            return {
              triggerCode: '',
              code: '',
              modcode:modcode,
              codeModal: false,
              codeTab: 'code',
               projectName: '',
              modal: true,
              createModal: false,
              createProjectData: this.$config.defaultProjectName,
                // jsPlumb 实例
                jsPlumb: null,
                // 控制画布销毁
                easyFlowVisible: true,
                // 控制流程数据显示与隐藏
                flowInfoVisible: false,
                // 是否加载完毕标志位
                loadEasyFlowFinish: false,
                flowHelpVisible: false,
                // 数据
                data: {},
                // 激活的元素、可能是节点、可能是连线
                activeElement: {
                    // 可选值 node 、line
                    type: undefined,
                    // 节点ID
                    nodeId: undefined,
                    // 连线ID
                    sourceId: undefined,
                    targetId: undefined
                },
                zoom: 0.5
            }
        },
        // 一些基础配置移动该文件中
        mixins: [easyFlowMixin],
        components: {
            draggable, flowNode, nodeMenu, FlowInfo, FlowNodeForm, FlowHelp
        },
        directives: {
            'flowDrag': {
                bind(el, binding, vnode, oldNode) {
                    if (!binding) {
                        return
                    }
                    el.onmousedown = (e) => {
                        if (e.button == 2) {
                            // 右键不管
                            return
                        }
                        //  鼠标按下，计算当前原始距离可视区的高度
                        let disX = e.clientX
                        let disY = e.clientY
                        el.style.cursor = 'move'

                        document.onmousemove = function (e) {
                            // 移动时禁止默认事件
                            e.preventDefault()
                            const left = e.clientX - disX
                            disX = e.clientX
                            el.scrollLeft += -left

                            const top = e.clientY - disY
                            disY = e.clientY
                            el.scrollTop += -top
                        }

                        document.onmouseup = function (e) {
                            el.style.cursor = 'auto'
                            document.onmousemove = null
                            document.onmouseup = null
                        }
                    }
                }
            }
        },
        mounted() {
            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(() => {
                this.dataReload(getData())
            })
          window.onbeforeunload=(e) => {
            if(!this.modal){
              var e = window.event||e;
              e.returnValue=("确定离开当前页面吗？");
            }
          }
        },
        methods: {
            // 返回唯一标识
            getUUID() {
                return uuidv4()
            },
            jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 导入默认配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    this.jsPlumb.setSuspendDrawing(false, true);
                    // 初始化节点
                    this.loadEasyFlow()
                    // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.activeElement.type = 'line'
                        this.activeElement.sourceId = conn.sourceId
                        this.activeElement.targetId = conn.targetId
                        this.$refs.nodeForm.lineInit({
                            from: conn.sourceId,
                            to: conn.targetId,
                            label: conn.getLabel(),
                          choose:this.data.lineList.filter(l => l.from ===  conn.sourceId && l.to === conn.targetId)[0].choose,
                          nodeType:this.data.nodeList.filter(node => node.id === conn.sourceId)[0].type
                        })
                    })
                    // 连线
                    this.jsPlumb.bind("connection", (evt) => {
                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadEasyFlowFinish) {
                            this.data.lineList.push({from: from, to: to})
                        }
                    })

                    // 删除连线回调
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    this.jsPlumb.bind("connectionMoved", (evt) => {
                        this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 连线右击
                    this.jsPlumb.bind("contextmenu", (evt) => {
                        console.log('contextmenu', evt)
                    })

                    // 连线
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('节点不支持连接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('该关系已存在,不允许重复创建')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('不支持两个节点之间连线回环');
                            return false
                        }
                        this.$message.success('连接成功')
                        return true
                    })

                    // beforeDetach
                    this.jsPlumb.bind("beforeDetach", (evt) => {
                        console.log('beforeDetach', evt)
                    })
                    this.jsPlumb.setContainer(this.$refs.efContainer)
                })
            },
            // 加载流程图
            loadEasyFlow() {
                // 初始化节点
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    if (!node.viewOnly) {
                        this.jsPlumb.draggable(node.id, {
                            containment: 'parent',
                            stop: function (el) {
                                // 拖拽节点结束后的对调
                                console.log('拖拽结束: ', el)
                            }
                        })
                    }
                }
                // 初始化连线
                for (var i = 0; i < this.data.lineList.length; i++) {
                    let line = this.data.lineList[i]
                    var connParam = {
                        source: line.from,
                        target: line.to,
                        label: line.label ? line.label : '',
                        connector: line.connector ? line.connector : '',
                        anchors: line.anchors ? line.anchors : undefined,
                        paintStyle: line.paintStyle ? line.paintStyle : undefined,
                    }
                    this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadEasyFlowFinish = true
                })
            },
            // 设置连线条件
            setLineLabel(from, to, label,choose) {
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0]
                if (!label || label === '') {
                    conn.removeClass('flowLabel')
                    conn.addClass('emptyFlowLabel')
                } else {
                    conn.addClass('flowLabel')
                }
                conn.setLabel({
                    label: label,
                })
                this.data.lineList.forEach(function (line) {
                    if (line.from == from && line.to == to) {
                        line.label = label
                        line.choose = choose
                    }
                })

            },
            // 删除激活的元素
            deleteElement() {
                if (this.activeElement.type === 'node') {
                    this.deleteNode(this.activeElement.nodeId)
                } else if (this.activeElement.type === 'line') {
                    this.$confirm('确定删除所点击的线吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var conn = this.jsPlumb.getConnections({
                            source: this.activeElement.sourceId,
                            target: this.activeElement.targetId
                        })[0]
                        this.jsPlumb.deleteConnection(conn)
                    }).catch(() => {
                    })
                }
            },
            // 删除线
            deleteLine(from, to) {
                this.data.lineList = this.data.lineList.filter(function (line) {
                    if (line.from == from && line.to == to) {
                        return false
                    }
                    return true
                })
            },
            // 改变连线
            changeLine(oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite(data) {
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            /**
             * 拖拽结束后添加新的节点
             * @param evt
             * @param nodeMenu 被添加的节点对象
             * @param mousePosition 鼠标拖拽结束的坐标
             */
            addNode(evt, nodeMenu, mousePosition) {
                var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
                let efContainer = this.$refs.efContainer
                var containerRect = efContainer.getBoundingClientRect()
                var left = screenX, top = screenY
                // 计算是否拖入到容器中
                if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
                    this.$message.error("请把节点拖入到画布中")
                    return
                }
                left = left - containerRect.x + efContainer.scrollLeft
                top = top - containerRect.y + efContainer.scrollTop
                // 居中
                left -= 85
                top -= 16
                var nodeId = this.getUUID()
                // 动态生成名字
                var origName = nodeMenu.name
                var nodeName = origName
                var index = 1
                while (index < 10000) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = origName + index
                            repeat = true
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }
                var node = {
                    id: nodeId,
                    name: nodeName,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    ico: nodeMenu.ico,
                    state: 'success',
                    hero: this.$config.defaultHero
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent',
                        stop: function (el) {
                            // 拖拽节点结束后的对调
                            console.log('拖拽结束: ', el)
                        }
                    })
                })
            },
            /**
             * 删除节点
             * @param nodeId 被删除节点的ID
             */
            deleteNode(nodeId) {
                this.$confirm('确定要删除节点?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    /**
                     * 这里需要进行业务判断，是否可以删除
                     */
                    this.data.nodeList = this.data.nodeList.filter(function (node) {
                        if (node.id === nodeId) {
                            // 伪删除，将节点隐藏，否则会导致位置错位
                            // node.show = false
                            return false
                        }
                        return true
                    })
                    this.$nextTick(function () {
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
                return true
            },
            clickNode(nodeId) {
                this.activeElement.type = 'node'
                this.activeElement.nodeId = nodeId
                this.$refs.nodeForm.nodeInit(this.data, nodeId)
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine(from, to) {
                return this.hasLine(to, from)
            },
            nodeRightMenu(nodeId, evt) {
                this.menu.show = true
                this.menu.curNodeId = nodeId
                this.menu.left = evt.x + 'px'
                this.menu.top = evt.y + 'px'
            },
            repaintEverything() {
                this.jsPlumb.repaint()
            },
            // 流程数据信息
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            // 加载流程图
            dataReload(data) {
                this.easyFlowVisible = false
                this.data.nodeList = []
                this.data.lineList = []
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    this.easyFlowVisible = true
                    this.data = data
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // 模拟载入数据dataA
            dataReloadA() {
                this.dataReload(getDataA())
            },
            // 模拟载入数据dataB
            dataReloadB() {
                this.dataReload(getDataB())
            },
            // 模拟载入数据dataC
            dataReloadC() {
                this.dataReload(getDataC())
            },
            // 模拟载入数据dataD
            dataReloadD() {
                this.dataReload(getDataD())
            },
            // 模拟加载数据dataE，自适应创建坐标
            dataReloadE() {
                let dataE = getDataE()
                let tempData = lodash.cloneDeep(dataE)
                let data = ForceDirected(tempData)
                this.dataReload(data)
                this.$message({
                    message: '力导图每次产生的布局是不一样的',
                    type: 'warning'
                });
            },
            zoomAdd() {
                if (this.zoom >= 1) {
                    return
                }
                this.zoom = this.zoom + 0.1
                this.$refs.efContainer.style.transform = `scale(${this.zoom})`
                this.jsPlumb.setZoom(this.zoom)
            },
            zoomSub() {
                if (this.zoom <= 0) {
                    return
                }
                this.zoom = this.zoom - 0.1
                this.$refs.efContainer.style.transform = `scale(${this.zoom})`
                this.jsPlumb.setZoom(this.zoom)
            },
            // 下载数据
            downloadData() {
                this.$confirm('确定要下载该项目数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                  this.$message.success("正在下载中,请稍后...")
                  const blob = new Blob([
                    JSON.stringify({
                      data: this.data,
                      version: this.$config.dataFileVersion,
                      project: 'designer',
                      projectName: this.projectName
                    },
                      // null, '\t'
                    )
                  ], {type: "text/plain;charset=utf-8"});

                  saveAs(blob, this.projectName +  ".json");

                }).catch(() => {
                })
            },
            openHelp() {
                this.flowHelpVisible = true
                this.$nextTick(function () {
                    this.$refs.flowHelp.init()
                })
            },
            onDeleteLine({from,to}){
              var conn = this.jsPlumb.getConnections({
                source: from,
                target: to
              })[0]
              this.jsPlumb.deleteConnection(conn)
            },
          fileChange(file){
            const reader = new FileReader();//新建一个FileReader
            reader.readAsText(file.raw, "UTF-8");//读取文件
            reader.onload = (evt) => {
              const fileString = evt.target.result;
              try{
                this.loadFileData(fileString)
              }catch (e) {
                this.$message.error('打开项目失败：' + e.message)
              }
            }
          },
          heroChange(val){
              if(this.$config.allHeroes.indexOf(val) === -1 && this.data.externHeroes.indexOf(val) === -1){
                this.data.externHeroes.push(val)
              }
          },
          loadFileData(fileString){
              const data = JSON.parse(fileString)
              if(data.project !== 'designer'){
                throw new Error('数据格式有误')
              }
              if(data.version === 100){
                data.data.nodeList.forEach(node => {
                  node.hero = this.$config.defaultHero
                })
              }
              if(data.version < 103){
                data.data.externHeroes = []
              }

              this.dataReload(data.data)
              this.projectName = data.projectName
            if(this.modal){
              this.modal = false
            }
          },

          createProject(){

            this.createProjectData = this.$config.defaultProjectName
            this.createModal = true
          },
          doCrateProject(){
              if(!this.createProjectData.length){
                this.$message.error('输入有误！')
                return
              }
              this.createModal = false
              this.$nextTick(() => {
                this.projectName = this.createProjectData
                this.modal = false
              })
          },
          handleCommand(cmd){
              if(cmd === 'save') {
                this.downloadData()
              }else if(cmd === 'open'){
                this.$refs.openBtn.$el.click()
              }else if(cmd === 'new'){
                this.$confirm('确定要新建吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  closeOnClickModal: false
                }).then(() => {
                  this.dataReload(getData())
                  this.createModal = true
                })
              }
          },
          exportCode(){
              try{
                const result =   gencode(this.data)
                this.code = result.code
                this.triggerCode = result.trigger
              }catch (e){
                console.error(e)
                this.$message.error('生成代码出错：' + e.message)
                return
              }
              this.codeTab = 'code'
              this.codeModal = true
          },
          copyCode(){
              let toCopy = ''
              if(this.codeTab === 'all'){
                toCopy = this.modcode
              }else if(this.codeTab === 'code'){
                toCopy = this.code
              }else if(this.codeTab === 'trigger'){
                toCopy = this.triggerCode
              }
            this.$copyText(toCopy).then(() => {
              this.$message.success('已经复制')
            }).catch(() => {
              this.$message.error('复制失败！')
            })
          },
          codeHelp(){
            this.$alert(`<ul>
              <li>生成的代码 - 复制到OW中</li>
              <li>触发代码 - 一个动作，用于触发这个项目 需添加到某个事件中</li>
              <li>全局代码 - 复制到OW中，只需要添加一次！</li>
            </ul>`, '提示', {
              dangerouslyUseHTMLString: true
            });
          }
        },
    }
</script>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
