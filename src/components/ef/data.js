import { v4 as uuidv4 } from 'uuid';

export default () => {
  const idA = uuidv4()
  const idB = uuidv4()
  return {
    name: '对话1',
    nodeList:[
      {
        id: idA,
        name: '开始节点',
        type: 'start',
        left: '18px',
        top: '223px',
        ico: 'el-icon-house',
        state: 'success'
      },
      {
        id: idB,
        type: 'message',
        name: '对话',
        left: '351px',
        top: '96px',
        ico: 'el-icon-user',
        message: '这是一段对话'
      }
    ],
    lineList:[
      {
        from: idA,
        to: idB
      }
    ]
  }
}
