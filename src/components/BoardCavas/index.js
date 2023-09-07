import React, { Component } from "react";
import { draftEvent } from "root/utils/utils";
import CanvasContainerByPc from "./CanvasContainerByPc";
import "./index.less";
class Init extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    startCreateArea = (type, e) => {
        // e.stopPropagation();
        // e.dataTransfer.effectAllowed = "move";
        draftEvent(e, "type", type);
        // return false;
        e.stopPropagation();

    };
    render(){
        return(
            <div className="init-font">
                <div className="left">
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('area_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >折线图
                </div>
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('donut_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >环图
                </div>
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('bar_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >柱状图
                </div>
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('heatmap',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >分组图
                </div>
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('scatter_plot',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >散点图
                </div>
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('radar_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >雷达图
                </div>
                <div
                draggable={true}
                onDragStart={(e)=>this.startCreateArea('pie_chart',e)}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                >饼图
                </div>
                </div>
                <div className="right">
                    <CanvasContainerByPc />
                </div>
                </div>
              
        );

    }
}
export default Init;