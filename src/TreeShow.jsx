import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'

const flatTree = data => {
  let arr = []
  const itera = tree => {
    for (let i = 0; i < tree.length; i++) {
      const element = tree[i]
      if (element.children && element.children.length > 0) {
        arr.push(_.omit(element, ['children']))
        itera(element.children)
      } else {
        arr.push({ ...element })
      }
    }
  }
  itera(data)
  return arr
}

class CascderTest extends React.Component {
  constructor() {
    super()
    this.state = {
      activeCell: null
    }
  }

  getWidthForHorizelLine = memoize(this.getObjeckForHorizelLine)

  flattenData = []

  render() {
    const { treeData } = this.props
    this.flattenData = this.getWidthForHorizelLine(treeData)
    return <div>{this.renderCasc(treeData)}</div>
  }

  renderCasc(tree) {
    const { cellMarginTop, models } = this.props
    let arr = []
    for (let i = 0; i < tree.length; i++) {
      const element = tree[i]
      if (element.children && element.children.length > 0) {
        arr[i] = (
          <div
            key={element[models.value]}
            style={{
              marginLeft: `${
                element.pid === null ? 0 : this.calCellMarginLeft(element)
              }px`,
              marginTop: `${cellMarginTop}px`,
              position: 'relative'
            }}
          >
            <div
              style={this.setCellStyle(element)}
              onClick={() => this.handleClick(element)}
            >
              {/* 文字内容 */}
              {this.renderContent(element)}

              {/* 竖线 */}
              {this.renderVerticalLine(element)}

              {/* 横线 ,去除第一个没有父级的前面的横线*/}
              {element.pid ? this.renderHorizontalLine(element) : null}
            </div>
            {this.renderCasc(element.children)}
          </div>
        )
      } else {
        arr[i] = (
          <div
            key={element[models.value]}
            style={{
              marginLeft: `${this.calCellMarginLeft(element)}px`,
              marginTop: `${cellMarginTop}px`,
              position: 'relative'
            }}
          >
            <div
              style={this.setCellStyle(element)}
              onClick={() => this.handleClick(element)}
            >
              {/* 文字内容 */}
              {this.renderContent(element)}
              {/* 横线 */}
              {this.renderHorizontalLine(element)}
            </div>
          </div>
        )
      }
    }
    return arr
  }

  renderContent(element) {
    const { models } = this.props
    return (
      <div
        style={{
          padding: '0 5px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        {element[models.label]}
      </div>
    )
  }

  getObjeckForHorizelLine(treeData) {
    const { models } = this.props
    let temp = {}
    let arr = flatTree(treeData)
    for (let i = 0; i < arr.length; i++) {
      temp[arr[i][models.value]] = arr[i]
    }
    return temp
  }

  resolveCellWidth(element) {
    return this.props.cellWidth
      ? `${this.props.cellWidth}px`
      : `${this.calCellWidth(element)}px`
  }

  setCellStyle(element) {
    // 单元样式
    const { cellHeight, fontSize, cellBgColor, cellColor } = this.props
    return {
      width: this.resolveCellWidth(element),
      height: `${cellHeight}px`,
      borderRadius: '5px',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: `${fontSize}px`,
      backgroundColor: cellBgColor,
      color: cellColor,
      ...this.renderActiveStyle(element)
    }
  }

  // 横线
  renderHorizontalLine(element) {
    const { lineWidth, lineColor, cellHeight } = this.props
    return (
      <div
        style={{
          width: this.calHorizontalLineWidth(element),
          height: lineWidth,
          backgroundColor: lineColor,
          position: 'absolute',
          left: this.calHorizontalLeft(element),
          top: `${cellHeight * 0.5}px`
        }}
      ></div>
    )
  }

  // 竖线
  renderVerticalLine(element) {
    const { lineWidth, cellHeight, cellMarginTop, lineColor } = this.props
    return (
      <div
        style={{
          width: lineWidth,
          height: `${this.findYaxisNumber(element) *
            (cellHeight + cellMarginTop) -
            cellHeight * 0.5 +
            lineWidth}px`,
          backgroundColor: lineColor,
          position: 'absolute',
          top: `${cellHeight}px`,
          left: `${this.calCellWidth(element) * 0.5}px`
        }}
      ></div>
    )
  }

  // 横线宽度
  calHorizontalLineWidth(element) {
    const cellMarginLeft = this.calCellMarginLeft(element)
    if (element.pid && !this.props.cellWidth) {
      let parentElement = this.flattenData[element.pid]
      return `${cellMarginLeft - this.calCellWidth(parentElement) * 0.5}px`
    } else {
      return `${cellMarginLeft - this.props.cellWidth * 0.5}px`
    }
  }

  calHorizontalLeft(element) {
    const cellMarginLeft = this.calCellMarginLeft(element)
    if (element.pid && !this.props.cellWidth) {
      let parentElement = this.flattenData[element.pid]
      return `-${cellMarginLeft - this.calCellWidth(parentElement) * 0.5}px`
    } else {
      return `-${cellMarginLeft - this.props.cellWidth * 0.5}px`
    }
  }

  calCellMarginLeft(element) {
    const { cellMarginLeft } = this.props
    if (element.pid) {
      let parentElement = this.flattenData[element.pid]
      return this.calCellWidth(parentElement) * 0.5 + cellMarginLeft
    } else {
      return 0
    }
  }

  calCellWidth(element) {
    const { models, fontSize } = this.props
    return element[models.label].length * fontSize + 20
  }

  renderActiveStyle(element) {
    const { activeCell } = this.state
    const { activeCellColor, models, activeCellBgColor } = this.props
    if (activeCell === element[models.value]) {
      return {
        color: activeCellColor,
        backgroundColor: activeCellBgColor
      }
    }
  }

  handleClick = element => {
    const { cellClick, models } = this.props
    cellClick(element)
    this.setState({
      activeCell: element[models.value]
    })
  }

  findYaxisNumber(item) {
    const currentObj = this.findCurrentObj(item)
    let num = 0
    const iteraTwo = arr => {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        if (element.children && element.children.length > 0) {
          num++
          iteraTwo(element.children)
        } else {
          num++
        }
      }
    }
    // 这里在循环你里面的定位已经是树形结构里面的单独的一个节点了，
    // 所以只考虑当前的这个节点 在计算的时候，应该包括哪些子节点在内，所以
    // 这里的iteraTwo(_.initial(currentObj.children))的逻辑不需要带到上面的迭代里
    if (currentObj.children.length > 1) {
      iteraTwo(_.initial(currentObj.children))
      return num + 1
    } else {
      return 1
    }
  }

  findCurrentObj(item) {
    const { models, treeData } = this.props
    const mainKey = models.value
    let result
    const iteraOne = list => {
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (element[mainKey] === item[mainKey]) {
          result = element
        } else {
          if (element.children && element.children.length) {
            iteraOne(element.children)
          }
        }
      }
    }
    iteraOne(treeData)
    return result
  }
}

CascderTest.propTypes = {
  cellMarginTop: PropTypes.number,
  cellMarginLeft: PropTypes.number,
  cellColor: PropTypes.string,
  cellBgColor: PropTypes.string,
  activeCellColor: PropTypes.string,
  activeCellBgColor: PropTypes.string,
  cellWidth: PropTypes.number,
  cellHeight: PropTypes.number,
  fontSize: PropTypes.number,
  lineWidth: PropTypes.number,
  lineColor: PropTypes.string,
  cellClick: PropTypes.func,
  treeData: PropTypes.array.isRequired,
  models: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  }).isRequired
}

CascderTest.defaultProps = {
  cellMarginTop: 10,
  cellMarginLeft: 50,
  cellColor: '#fff',
  cellBgColor: '#232C3E',
  activeCellColor: 'red',
  activeCellBgColor: 'blue',
  // cellWidth: 65,
  fontSize: 13,
  cellHeight: 30,
  lineWidth: 2,
  lineColor: '#232C3E',
  cellClick: () => {}
}

export default CascderTest
