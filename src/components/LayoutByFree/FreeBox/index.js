
import React, {Component} from 'react'
import { getDragData,draftEvent } from "root/utils/utils";
import Thumbnails, { Thumbnail } from '@antv/thumbnails';
import {Form} from 'antd'
import {getView} from './config'
import "./index.less";
export default class FreeBox  extends Component {
    state = {
        data: [],
      };
    componentDidMount(){

    
    }
    handleDrop = (e) => {
        console.log('e',e)
        let {data}=this.state;
        console.log('getDragData',getDragData(e))
        const dragData=getDragData(e).dragData;
        const {key,type,lt,tp}=dragData;
        data=data.filter(item=>item.id!==type)
        const headDom=document.querySelector('.header')
        const leftDom=document.querySelector('.tool')
        const selfDom=document.querySelector(`chart-${type}`)
        let  top= headDom ? headDom.clientHeight : 0;
        let left = leftDom ? leftDom.clientWidth : 0;
        console.log('type',type)
        console.log('top',top)
        console.log('left',left)
        console.log('selfDom',selfDom)
        console.log('lt',lt)
        console.log('tp',tp)
        console.log('x',e.clientX-left)
        console.log('y',e.clientY-top)
        let x=e.clientX-left-lt;
        let y=e.clientY-top-tp
        data.push({
            id:type,
            x:x>0?x:0,
            y:y>0?y:0,
            name:type,
            key,
        })
        this.setState({
            data
        })
        console.log('e',e)
        console.log('getDragData',getDragData(e))
        
    };
    handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    handleDragEnd = () => {
  
    };
    startCreateArea = (key,type, e) => {
        const dragDom=document.querySelector(`.chart-${type}`)
      console.log('dragDomdragDomdragDom',dragDom)
      draftEvent(e, "dragData", {key,type,lt:Math.floor(dragDom.offsetWidth/2),tp:dragDom.offsetHeight/2});
        e.stopPropagation();
  
    };
     /*定义鼠标下落事件*/
     mouseDown = (type, e) => {
        e.stopPropagation();
        e.preventDefault();
       
    };
    render() {
        const {data}=this.state;
        return (
              <div className="free-box"
                  onDragEnd={this.handleDragEnd}
                  onDragOver={this.handleDragOver}
                  onDrop={this.handleDrop}
                  onDragEnter={(e) =>{}}
                  onDragLeave={this.handleDragLeave}
                  ref={(paneBox) => (this.paneBox = paneBox)}
              >            <Form>

                  {
                      data.map(area=>{
                        return <div draggable={true} onDragStart={(e)=>this.startCreateArea(area.key,area.id,e)} className={`chart-${area.id}`} key={area.id} style={{position: 'absolute',left:area.x,top:area.y,background:'#e6f7ff'}}>
                             <div
                    className={`chart-${area.id}-bottom`} 
                    onMouseDown={e => this.mouseDown("resize", e)}
                    >
                </div>
                {getView(area.key,area.id)}
</div>
                      })
                  }
            </Form>
              </div>
          
        )
    }
    
}
 

