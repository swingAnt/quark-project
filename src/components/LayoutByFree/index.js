
import React, {Component} from 'react'
import { draftEvent } from "root/utils/utils";
import FreeBox from "./FreeBox";
import "./index.less";
export default class LayoutByFree  extends Component {
 
    componentDidMount(){

    
    }
    startCreateArea = (key,type, e) => {
      console.log('startCreateArea',e)
      const dragDom=document.querySelector(`.${type}`)
      console.log('dragDomdragDomdragDom',dragDom)
      console.log('offsetWidth',dragDom.offsetWidth)
      console.log('offsetHeight',dragDom.offsetHeight)

      // console.log('offsetWidth',Math.floor(dragDom.offsetWidth/3))
      // console.log('offsetHeight',Math.floor(dragDom.offsetHeight/3))
      console.log('offsetTop',dragDom.offsetTop)
      console.log('offsetLeft',dragDom.offsetLeft)
      draftEvent(e, "dragData", {key,type,lt:Math.floor(dragDom.offsetWidth/2),tp:dragDom.offsetHeight/2});
      e.stopPropagation();

  };
    render() {
        return (
            <>
              <div className="layoutByFree">
              <div className="tool" 
              >
                 <span
                 style={{marginLeft:'5px'}}
                 draggable={true}
                 className="area_chart"
                onDragStart={(e)=>this.startCreateArea('chart','area_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >折线图
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="donut_chart"
                onDragStart={(e)=>this.startCreateArea('chart','donut_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >环图
                </span>
                <span
                 draggable={true}
                 style={{marginLeft:'5px'}}
                 className="bar_chart"
                onDragStart={(e)=>this.startCreateArea('chart','bar_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >柱状图
                </span>
                <span
                draggable={true}
                className="heatmap"
                style={{marginLeft:'5px'}}
                onDragStart={(e)=>this.startCreateArea('chart','heatmap',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >分组图
                </span>
                <span
                draggable={true}
                className="scatter_plot"
                style={{marginLeft:'5px'}}
                onDragStart={(e)=>this.startCreateArea('chart','scatter_plot',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >散点图
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="radar_chart"
                onDragStart={(e)=>this.startCreateArea('chart','radar_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >雷达图
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="pie_chart"
                onDragStart={(e)=>this.startCreateArea('chart','pie_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >饼图
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="input"
                onDragStart={(e)=>this.startCreateArea('antd','input',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >输入框
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="rate"
                onDragStart={(e)=>this.startCreateArea('antd','rate',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >打分
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="table"
                onDragStart={(e)=>this.startCreateArea('antd','table',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >表格
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="tree"
                onDragStart={(e)=>this.startCreateArea('antd','tree',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >树
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="switch"
                onDragStart={(e)=>this.startCreateArea('antd','switch',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >开关
                </span>
                <span
                draggable={true}
                style={{marginLeft:'5px'}}
                className="panel"
                onDragStart={(e)=>this.startCreateArea('antd','panel',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >面板
                </span>
                </div>
                <div className="layout" >     
                 <FreeBox />
                </div>
                
              </div>
            </>
        )
    }
    
}
 

