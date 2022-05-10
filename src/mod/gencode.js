import lodash from 'lodash'

const mapChars = (message,node) => {
  if(node.disableCompress){
    return `自定义字符串("${message}")`
  }
  const result = []
  for(let c of message){
    result.push(`自定义字符串("${c}")`)
  }
  return result
}

const messageNode = (node,toNodeId) => {
  if(!node.message || !node.message.length){
    throw new Error(`请填写[${node.name}]的对话内容`)
  }
  return `规则("${node.name}")
{
\t事件
\t{
\t\t持续 - 每名玩家;
\t\t双方;
\t\t全部;
\t}

\t条件
\t{
\t\t事件玩家.route == 自定义字符串("${node.id}");
\t}

\t动作
\t{
\t\t事件玩家.text_input = 数组(${mapChars(node.message,node)});
\t\t事件玩家.next_route = 自定义字符串("${toNodeId}");
\t\t事件玩家.text_hero = ${node.hero};
\t\t事件玩家.playing = 真;
\t}
}
`
}
const view = (idx) => {
  return `事件玩家.select_index == ${idx} ? 图标字符串(箭头：向右) : 自定义字符串("")`
}

const selectView = (chooseArray) => {
  if(chooseArray.length === 2){
    return `自定义字符串("{0}${chooseArray[0]}\\r\\n{1}${chooseArray[1]}\\r\\n",${view(0)},${view(1)})`
  }
  if(chooseArray.length === 3){
    return `自定义字符串("{0}${chooseArray[0]}\\r\\n{1}${chooseArray[1]}\\r\\n{2}",${view(0)},${view(1)},自定义字符串("{0}${chooseArray[2]}\\r\\n",${view(2)}))`
  }
  if(chooseArray.length === 4){
    return `自定义字符串("{0}${chooseArray[0]}\\r\\n{1}${chooseArray[1]}\\r\\n{2}",${view(0)},${view(1)},`+
      `自定义字符串("{0}${chooseArray[2]}\\r\\n{1}${chooseArray[3]}\\r\\n",${view(2)},${view(3)}))`
  }
  if(chooseArray.length === 5){
    return `自定义字符串("{0}${chooseArray[0]}\\r\\n{1}${chooseArray[1]}\\r\\n{2}",${view(0)},${view(1)},`+
      `自定义字符串("{0}${chooseArray[2]}\\r\\n{1}${chooseArray[3]}\\r\\n{2}${chooseArray[4]}\\r\\n",${view(2)},${view(3)},${view(4)}))`
  }
}

const selectRoutes = (node,chooseLines) => {
  for(let i=0;i<chooseLines.length;i++){
    const chooseI = chooseLines[i].choose
    if(!chooseI || !chooseI.length){
      throw new Error(`选择节点[${node.name}]的连线都需要设置选择编号`)
    }
    for(let j=i+1;j<chooseLines.length;j++){
      const chooseJ = chooseLines[j].choose
      if(!chooseJ || !chooseJ.length){
        throw new Error(`选择节点[${node.name}]的连线都需要设置选择编号`)
      }
      if(chooseI === chooseJ){
        throw new Error(`选择节点[${node.name}]的连线的选择编号有冲突`)
      }
    }
  }
  let buf = ''
  for(let i=0;i<chooseLines.length;i++){
    const line = chooseLines[i]
    if(!line.choose || !line.choose.length){
      continue
    }
    buf += `规则("${node.name} 选择${i+1}")
{
\t事件
\t{
\t\t持续 - 每名玩家;
\t\t双方;
\t\t全部;
\t}

\t条件
\t{
\t\t事件玩家.route == 自定义字符串("${node.id}");
\t\t事件玩家.choice == ${line.choose.substring(1)};
\t}

\t动作
\t{
\t\t事件玩家.choice = 0;
\t\t事件玩家.route = 自定义字符串("${line.to}");
\t}
}
`
  }
  return buf
}



const messageChoose = (node,chooseArray,chooseLines) => {
  if(!node.message || !node.message.length){
    throw new Error(`请填写[${node.name}]的对话内容`)
  }
  return `规则("${node.name}")
{
\t事件
\t{
\t\t持续 - 每名玩家;
\t\t双方;
\t\t全部;
\t}

\t条件
\t{
\t\t事件玩家.route == 自定义字符串("${node.id}");
\t}

\t动作
\t{
\t\t事件玩家.text_input = 数组(${mapChars(node.message,node)});
\t\t事件玩家.text_hero = ${node.hero};
\t\t事件玩家.is_select = 真;
\t\t事件玩家.select_number = ${chooseArray.length};
\t\t事件玩家.playing = 真;
\t}
}

规则("${node.name} 选择分支")
{
\t事件
\t{
\t\t持续 - 每名玩家;
\t\t双方;
\t\t全部;
\t}

\t条件
\t{
\t\t事件玩家.route == 自定义字符串("${node.id}");
\t\t事件玩家.refresh_select == 真;
\t}

\t动作
\t{
\t\t事件玩家.refresh_select = 假;
\t\t事件玩家.select_view = ${selectView(chooseArray)};
\t}
}
${selectRoutes(node,chooseLines)}
`
}

const messageCode = (node,next) => {
  if(!node.code || !node.code.length){
    throw new Error(`请填写[${node.name}]的对话内容`)
  }
  return `规则("${node.name}")
{
\t事件
\t{
\t\t持续 - 每名玩家;
\t\t双方;
\t\t全部;
\t}

\t条件
\t{
\t\t事件玩家.route == 自定义字符串("${node.id}");
\t}

\t动作
\t{
${node.code}
${next || ''}
\t}
}`
}

const getToLines = (lineList,nodeId) => {
  return lineList.filter(line => line.from === nodeId)
}

const getChooseArray = (node) => {
  const result = []
  for(let i=1;i<=5;i++){
    if(node['choose' + i] && node['choose' + i].length){
      result.push(node['choose' + i])
    }
  }
  return result
}

const subProjectNode = (node,ctx,idPool) => {
  const key = node.message
  const project = ctx.childProjects.filter(project => project.key === key)[0]
  if(!project){
    throw new Error(`无法找到key为${key}的子项目`)
  }
  try{
    const result = gen(project.data,idPool)
    const {code,triggerId} = result
    ctx.append(code)
    ctx.append(`规则("${node.name}")
{
\t事件
\t{
\t\t持续 - 每名玩家;
\t\t双方;
\t\t全部;
\t}

\t条件
\t{
\t\t事件玩家.route == 自定义字符串("${node.id}");
\t}

\t动作
\t{
\t\t事件玩家.route = 自定义字符串("${triggerId}");
\t}
}`)
  } catch (e){
    console.error(e)
    throw new Error(`[${node.name}]生成子项目[${project.projectName}]代码失败：` + e.message)
  }
}

const getNodeCode = (node,ctx,idPool) => {
  if(node.type === 'message'){
    const lines = getToLines(ctx.lineList,node.id)
    if(lines.length > 1){
      throw new Error(`[${node.name}]后面只能连接一个节点`)
    }else if(lines.length === 1){
      const toNode = ctx.nodeMap[lines[0].to]
      ctx.append(messageNode(node,toNode.id))
      getNodeCode(toNode,ctx)
    }else{
      ctx.append(messageNode(node,''))
    }
  }else if(node.type === 'subProject'){
    const lines = getToLines(ctx.lineList,node.id)
    if(lines.length > 1){
      throw new Error(`[${node.name}]后面只能连接一个节点`)
    }else if(lines.length === 1){
      const toNode = ctx.nodeMap[lines[0].to]
      subProjectNode(node,ctx,idPool)
      getNodeCode(toNode,ctx)
    }else{
      subProjectNode(node,ctx,idPool)
    }
  }else if(node.type === 'choose'){
    const lines = getToLines(ctx.lineList,node.id)
    const choose = getChooseArray(node)
    if(choose.length < 2){
      throw new Error(`[${node.name}]至少需要两个选项`)
    }
    if(choose.length !== lines.length){
      throw new Error(`[${node.name}]选项数量和连线数量不一致`)
    }
    ctx.append(messageChoose(node,choose,lines))
    for(let i= 0;i<lines.length;i++){
      const line = lines[i]
      const toNode = ctx.nodeMap[line.to]
      getNodeCode(toNode,ctx)
    }
  }else if(node.type === 'code'){
    const lines = getToLines(ctx.lineList,node.id)
    if(lines.length === 0){
      ctx.append(messageCode(node,null))
      return
    }
    let owIf = []
    let other = []
    for(let line of lines){
      const node = ctx.nodeMap[line.to]
      if(node.type === 'ow-if'){
        owIf.push(node)
      }else{
        other.push(node)
      }
    }
    if(owIf.length > 0 && other.length > 0){
      throw new Error(`节点[${node.name}]后面根了OW条件 不能再跟其他类型的节点了`)
    }
    if(owIf.length === 1){
      throw new Error(`节点[${node.name}]后面OW条件至少一个`)
    }
    if(other.length > 1){
      throw new Error(`节点[${node.name}]后面只能有一个常规节点`)
    }
    if(other.length === 1){
      ctx.append (messageCode(node,`事件玩家.route = 自定义字符串("${other[0].id}");`))
      getNodeCode(other[0],ctx)
    }else{
      //合并OW条件节点
      messageOwIf(ctx,node,owIf)
    }
  }
}

const messageOwIf = (ctx,node,owIf) => {
  let tmp = ''
  const targets = []
  for(let i=0;i<owIf.length;i++){
    const oif = owIf[i]
    const lines = getToLines(ctx.lineList,oif.id)
    if(lines.length !== 1){
      throw new Error(`OW条件[${oif.name}]后面必须跟一个节点`)
    }
    if(!oif.code || !oif.code.length){
      throw new Error(`请填写[${oif.name}]的条件内容`)
    }
    const target = ctx.nodeMap[lines[0].to]
    targets.push(target)
    if(oif.code === 'else'){
      tmp += `Else;
事件玩家.route = 自定义字符串("${target.id}");
`
    }else{
      if(i > 0){
        tmp += 'Else '
      }
      tmp += `If(${oif.code});
事件玩家.route = 自定义字符串("${target.id}");
`
    }

  }
  tmp += 'End;'
  ctx.append(messageCode(node,tmp))
  for(let target of targets){
    getNodeCode(target,ctx)
  }
}

const triggerCode = (node) => {
  return `动作
{
\t事件玩家.route = 自定义字符串("${node.id}");
}
`
}


export const poolId = (data,iPool) => {
  let pool = {}
  if(typeof iPool === 'object'){
    pool = iPool
  }
  data.nodeList.forEach(node => {
    let pos = 6
    let id = ''
    do{
      id = node.id.substring(0,pos);
      pos+=4;
    }while (pool[id])
    pool[id] = node.id
    pool[node.id] = id
    node.id = id
  })
  data.lineList.forEach(line => {
    line.from = pool[line.from]
    line.to = pool[line.to]
  })
  return pool
}

const gen =  (i,pool) => {
  const data = lodash.cloneDeep(i)
  const idPool = poolId(data,pool)

  const nodeMap = {}
  data.nodeList.forEach(node => {
    nodeMap[node.id] = node
  })

  //找到start节点
  const start = data.nodeList.filter(node => node.type === 'start')[0]
  const lines = getToLines(data.lineList,start.id)
  if(lines.length === 0){
    throw new Error(`[${start.name}]后面没有下一个节点`)
  }
  if(lines.length > 1){
    throw new Error(`[${start.name}]后面只能连接一个节点`)
  }
  const ctx = {
    nodeMap,
    nodeList:data.nodeList,
    lineList:data.lineList,
    childProjects: data.childProjects,
    buf: '',
    idPool,
    append(str){
      this.buf += str
    }
  }
  const node = nodeMap[lines[0].to]
  getNodeCode(node,ctx,idPool)
  return {
    code: ctx.buf,
    trigger: triggerCode(node),
    triggerId: node.id
  }
}

export default gen
