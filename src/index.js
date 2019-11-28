import React from 'react'
import TreeShow from './TreeShow'

const treeData = [
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


class Test extends React.Component {
  state = {
    treeData: treeData
  }

  render() {
    const { treeData } = this.state
    return (
      <TreeShow
        cellMarginTop={10}
        cellMarginLeft={20}
        cellColor={'#fff'}
        cellBgColor={'#232C3E'}
        activeCellColor={'red'}
        activeCellBgColor={'blue'}
        fontSize={13}
        // cellWidth={30}
        cellHeight={30}
        lineWidth={2}
        lineColor={'#232C3E'}
        cellClick={v => {
          console.log(v)
        }}
        treeData={treeData} // required
        models={{ // required
          label: 'name',
          value: 'positionId'
        }}
      />
    )
  }
}
