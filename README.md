# react-tree-show
#### 在react项目中需求一个树形数据的展示组件，在网上找找好像没有找到合适的，在此自己写了一个，做一个小分享
#### 效果如下：

![image](https://github.com/zhangyuhuihh/react-tree-show/blob/master/demo.png)
#### 依赖：lodash , memoize-one

#### 数据结构：(其中pid是必须的，值为父节点主键值)
```treeData = [
  {
    positionId: '0',
    pid: null,
    name: '最顶级',
    children: [
      {
        positionId: '1',
        pid: '0',
        name: '第一层',
        children: [
          { positionId: '4', pid: '1', name: '第一层子一' },
          { positionId: '5', pid: '1', name: '第一层子二' }
        ]
      },
      {
        positionId: '2',
        pid: '0',
        name: '第一层',
        children: [
          {
            positionId: '6',
            pid: '2',
            name: '第一层子一',
            children: [{ positionId: '8', pid: '6', name: '第一层子子一' }]
          }
        ]
      },
      {
        positionId: '3',
        pid: '0',
        name: '第一层',
        children: [
          { positionId: '7', pid: '3', name: '第一层子一' },
          { positionId: '9', pid: '3', name: '第一层子二' },
          { positionId: '10', pid: '3', name: '第一层子三' }
        ]
      }
    ]
  }
] 
```
#### 参数配置：
参数 | 类型 | 是否必传 | 描述
---- | ----- | ------ | ------
cellMarginTop  | number |否，默认10| 每一个cell距离上面的cell的距离
cellMarginLeft  | number |否，默认50| 每一个cell距离前面竖线左边的距离
cellColor  | String |否，默认#fff| cell颜色
cellBgColor  | String |否，默认#232C3E| cell背景色
activeCellColor  | String |否，默认red| cell激活时候的颜色
activeCellBgColor  | String |否，默认blue| cell激活时候的背景色
fontSize  | Number |否，默认13| 字体大小
cellHeight  | Number |否，默认30| 每个cell的高度()
lineWidth  | Number |否，默认2| 线的宽度
lineColor  | String |否，默认#232C3E| 线的颜色
treeData  | Array |是| 树形数据
models  | Object |是| 树形数据要展示的的label和value的key
cellClick | Function| 否| 每个cell的点击事件，接收的参数是点击的cell对象
