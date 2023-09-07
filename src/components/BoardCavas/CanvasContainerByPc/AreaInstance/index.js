import React, { Component, Fragment } from "react";
import Thumbnails, { Thumbnail } from '@antv/thumbnails';
import { CaretDownOutlined } from '@ant-design/icons';
import { Switch ,Menu,Dropdown} from 'antd';
import insertCss from 'insert-css';

// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中

import "./index.less";
// 若拷贝官方代码，别忘了 npm install insert-css
// insertCss(`
//   .demo-thumbnails-all-grid {
//     width: 190px;
//     height: 190px;
//     display: inline-block;
//     margin: 6px 6px;
//     box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 4px 0px;
//   }

//   .demo-thumbnails-all-intro {
//     text-align: center;
//     height: 40px;
//     background: rgb(246, 246, 246);
//     padding: 2px 0;
//   }

//   .demo-thumbnails-all-intro h1 {
//     font-size: 12px;
//     height: 20px;
//     line-height: 20px;
//     color: rgb(74, 74, 74);
//     margin: 0;
//   }

//   .demo-thumbnails-all-intro h2 {
//     font-size: 10px;
//     height: 16px;
//     line-height: 16px;
//     font-style: italic;
//     color: rgba(74, 74, 74, 0.4);
//     margin: 0;
//   }

//   .demo-thumbnails-all-thumbnail {
//     text-align: center;
//   }

//   .demo-thumbnails-all-dark {
//     background-color: #262626;
//   }

//   .demo-thumbnails-all-thumbnail img {
//     margin: 4px;
//     width: 140px;
//     height: 140px;
//   }

//   .demo-thumbnails-all-thumbnail img.demo-thumbnails-all-hasBorder {
//     outline: 1px solid red;
//   }
// `);

const chartTypeList = Object.keys(Thumbnails);
export default class AreaInstance extends Component {
    state = {
        showImgBorder: false,
        bgDarkMode: false,
        current: chartTypeList[0],
    
      };
    handleClick = (e) => {
        this.setState({
          current: e.key,
        });
      };
    renderArea = (area) => {
        const { isActive } = this.props;
        const { current } = this.state;
        const liItems = chartTypeList.map((item) => {
            return <Menu.Item key={item}>{item}</Menu.Item>;
          });
          const menu = (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]}>
              {liItems}
            </Menu>
          );
      
        let instance;
        if (!area) {
            return null
        }
        console.log('instance-area.type',area.type)
        // const {
        //     component: Component,
        //     manifest: { defaultValue },
        // } = Template[widget.type];
        // const displaySet =
        //     widget && widget.setting && widget.setting.displaySet
        //         ? widget.setting.displaySet
        //         : {};
        // const initProps = Object.assign(defaultValue, displaySet);
        // const newSize = { ...size, width: null };
        //    switch (area.type) {
        //         case "text":
        //                 instance = <>
                             
        //                 </>;
        //                 break;
        //                 default:
        //                         break;
        //                 }


        return    <Fragment>
      <Thumbnail chart={area.type} width={'100%'} height='80%' />
     {/* <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
       <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
         Select Chart Type <CaretDownOutlined />
       </a>
     </Dropdown> */}
     {/* <span> : {current}</span> */}
        </Fragment>
    };
    render() {
        const { area } = this.props;
        return (
            <div className="layout-setting">
                {this.renderArea(area)}
            </div>
        );
    }
}
