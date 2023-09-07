import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { getUuid,createArea } from "root/utils/utils";
import "./index.less";
import PaneBox from "./PaneBox/index.js";
import { diffObj } from "root/utils/utils";
/**
 * 创建窗格容器
 * @param {*} containerId
 * @param {*} childList
 */
export const createEmptyPane = (
    containerId,
    width = 100,
    height = 100,
    pid,
    type,
    childList = [
        // { 
        // name: containerId,
        //  type ,
        //  id:containerId,
        // setting:{
        //     displaySet:{},
        //     tabs:[]
        // }}
        createArea({type})
    ]
) => ({
    id: containerId,
    width,
    height,
    pid,
    childList,
});

/**
 * 解释拖拽行为
 * @param {*} position
 */
const explainDragAction = (position) => {
    let isCover = false,
        isAdd = false,
        isFirst = false,
        isVertical = false;
    switch (position) {
        case "center":
            isCover = true;
            break;
        case "top":
            isVertical = true;
            isAdd = true;
            isFirst = true;
            break;
        case "left":
            isAdd = true;
            isFirst = true;
            break;
        case "right":
            isAdd = true;
            break;
        case "bottom":
            isVertical = true;
            isAdd = true;
            break;
        default:
            console.warn("请检查拖拽[position]参数");
    }
    return { isCover, isAdd, isFirst, isVertical };
};
class CanvasContainer extends Component {
    state = {
        analysisWidth: 0,
        analysisHeight: 0,
        tree: [
            {
                id: "root",
                width: 100,
                height: 100,
                childList: [],
            },
        ],
        draggable: true,
        positions: {},
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        chooseArea:""
    };
    componentWillUpdate(nextProps, nextStates) {
        const oldSize = this.props.sheetSize || {
            st: "PERCENT",
            w: 100,
            h: 100,
            percentage: 100,
        };
        const newSize = nextProps.sheetSize || {
            st: "PERCENT",
            w: 100,
            h: 100,
            percentage: 100,
        };
        const oldPercnetage = oldSize.percentage || 100;
        const newPercnetage = newSize.percentage || 100;
        if (
            !diffObj(oldSize, newSize) ||
            oldPercnetage !== newPercnetage ||
            // oldLayoutType !== newLayoutType ||
            nextStates.analysisWidth !== this.state.analysisWidth ||
            nextStates.analysisHeight !== this.state.analysisHeight
        ) {
            //以后再添加屏幕类型判断
            // this.updateContainerSize(newSize, newPercnetage, newLayoutType);
            this.updateContainerSize(newSize, newPercnetage);
        }
    }
    componentDidMount() {
        const sheetSize = this.props.sheetSize || {
            st: "PERCENT",
            w: 100,
            h: 100,
            percentage: 100,
        };

        const percentage = sheetSize.percentage || 100;
        this.updateContainerSize(sheetSize, percentage);
        this.analysisResize();
        window.addEventListener("resize", this.analysisResize.bind(this));

    }
    componentDidUpdate() {
        this.analysisResize();
    }
    analysisResize = _.debounce(() => {
        if (!this.refs.pcHomePage) {
            return;
        }
        const width = this.refs.pcHomePage.offsetWidth;
        const height = this.refs.pcHomePage.offsetHeight;
        console.log('heightheight',height)
        if (
            this.state.analysisWidth !== width ||
            this.state.analysisHeight !== height
        ) {
            this.setState({
                analysisWidth: width,
                analysisHeight: height,
            });
        }
    });
    updateDraggable = (draggable) => {
        this.setState({ draggable });
    };
    updateContainerSize = (size, percentage) => {
        let left = 0,
            top = 0;
        let screenWidth = 0;
        let screenHeight = 0;
        const boardContent = document.querySelector(".pcHomePage");
        // const filterContent = document.querySelector(
        //     ".global-filter-panel"
        // ) || { offsetHeight: 0 };
        percentage = percentage || 100;

        //根据尺寸类型获取屏幕宽高
        size = size || {
            st: "PERCENT",
            w: 100,
            h: 100,
        };
        switch (size.st) {
            case "PERCENT":
                screenWidth = boardContent.offsetWidth * (size.w / 100);
                screenHeight = boardContent.offsetHeight * (size.h / 100);
                break;
            case "PIXEL":
                screenWidth = size.w + 40;
                screenHeight = size.h + 32;
                break;
            case "RATIO":
                const { f, w, h } = size;
                switch (f) {
                    case "WIDTH":
                        screenWidth = boardContent.offsetWidth;
                        screenHeight = (screenWidth * h) / w;
                        //减去滚动条宽度
                        if (screenHeight > boardContent.offsetHeight) {
                            screenWidth -= 16;
                        }
                        break;
                    case "HEIGHT":
                        screenHeight = boardContent.offsetHeight;
                        screenWidth = (screenHeight * w) / h;
                        //减去滚动条宽度
                        if (screenWidth > boardContent.offsetWidth) {
                            screenHeight -= 16;
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        //计算真实宽高
        let width = screenWidth * (percentage / 100);
        let height = screenHeight * (percentage / 100);

        if (width < boardContent.offsetWidth) {
            left = (boardContent.offsetWidth - width) / 2;
        }
        if (height < boardContent.offsetHeight) {
            top = (boardContent.offsetHeight - height) / 2;
        } else if (height > boardContent.offsetHeight) {
            width = width - 8; //减掉8像素滚动条的宽度，但是这个值不够准确
        }
        this.setState({
            width,
            height,
            left,
            top,
        });
    };
    treeNodeChange = (data, key, callback) => {
        //查找id符合的函数
        data.forEach((item, index, arr) => {
            if (item.id === key) {
                return callback(item, index, arr);
            }
            if (item.childList) {
                return this.treeNodeChange(item.childList, key, callback);
            }
        });
    };
    onCopyArea = ({id,width,height}) => {
        const paneWidth = width===50? 50 : 100;
        const paneHeight = paneWidth===100? 50 : 100;
        console.log('paneWidth',paneWidth)
        console.log('paneHeight',paneHeight)
        let nextLayouts = this.state.tree;
        let secondData, secondIndex, secondArr;
        this.treeNodeChange(nextLayouts, id, (items, index, arr) => {
            secondData = items;
            secondIndex = index;
            secondArr = arr;
        });
        if (secondData) {
            const data2 = JSON.parse(JSON.stringify(secondData));
            if (data2.id === "root") {
                const firstPaneId = getUuid();
                const secondPaneId = getUuid();
                secondData.childList = [];
                secondData.childList.push(
                    createEmptyPane(firstPaneId, 100, 50, id, data2.childList[0].type),
                    createEmptyPane(secondPaneId, 100, 50, id, data2.childList[0].type)
                );
            } else {
                const firstPaneId = getUuid();
                const secondPaneId = getUuid();
                secondData.childList = [];
                secondData.childList.push(
                    createEmptyPane(
                        firstPaneId,
                        paneWidth,
                        paneHeight,
                        id,
                        data2.childList[0].type
                    ),
                    createEmptyPane(
                        secondPaneId,
                        paneWidth,
                        paneHeight,
                        id,
                        data2.childList[0].type
                                            )
                );
            }
        }
        this.setState({
            tree: nextLayouts,
        });
        // this.props.actions.updateTree(nextLayouts);
    };
    onDeleteArea = (id) => {
        let nextLayouts = this.state.tree;
        let secondData, secondIndex, secondArr;

        this.treeNodeChange(nextLayouts, id, (items, index, arr) => {
            secondData = items;
            secondIndex = index;
            secondArr = arr;
        });
        if (secondData) {
            if (secondData.id === "root") {
                secondData.childList = [];
            } else {
                secondArr.splice(secondIndex, 1);
                let nodes;
                console.log("secondData", secondData);
                this.treeNodeChange(
                    nextLayouts,
                    secondData.pid,
                    (items, index, arr) => {
                        nodes = items;
                        console.log("nodes", nodes);
                        if (nodes) {
                            nodes.childList = secondArr[0].childList;
                            nodes.childList.forEach(
                                (res) => (res.pid = secondData.pid)
                            );
                        }
                    }
                );
            }
        }
        this.setState({
            tree: nextLayouts,
        });
        // this.props.actions.updateTree(nextLayouts);
    };
    onMoveArea = (sourceConId, currentConId, position) => {
        let { tree } = this.state;
        console.log("onMoveArea");
        let nextLayouts = tree;
        let tess = JSON.parse(JSON.stringify(tree));
        const { isCover, isAdd, isFirst, isVertical } = explainDragAction(
            position
        );
        if (isCover) {
            let firstData,
                secondData,
                firstIndex,
                secondIndex,
                firstArr,
                secondArr;
            this.treeNodeChange(tree, currentConId, (item, index, arr) => {
                firstData = item;
                firstIndex = index;
                firstArr = arr;
            });
            this.treeNodeChange(tree, sourceConId, (items, index, arr) => {
                secondData = items;
                secondIndex = index;
                secondArr = arr;
            });
            if (firstData && secondData) {
                const data1 = JSON.parse(JSON.stringify(firstData));
                const data2 = JSON.parse(JSON.stringify(secondData));
                console.log("data1", data1);
                console.log("data2", data2);
                if (firstData.pid === secondData.pid) {
                    console.log("firstData", firstData);
                    console.log("secondData", secondData);
                    let nodes;
                    this.treeNodeChange(
                        tree,
                        data1.pid,
                        (items, index, arr) => {
                            nodes = items;
                            nodes.childList = secondData.childList;
                        }
                    );
                } else {
                    //
                    console.log("tess", tess);
                    secondArr.splice(secondIndex, 1);
                    let nodes;
                    console.log("secondData", secondData);
                    this.treeNodeChange(
                        tree,
                        secondData.pid,
                        (items, index, arr) => {
                            nodes = items;
                            console.log("nodes", nodes);
                            if (nodes) {
                                nodes.childList = secondArr[0].childList;
                                nodes.childList.forEach(
                                    (res) => (res.pid = secondData.pid)
                                );
                            }
                        }
                    );
                    console.log("secondArr", secondArr);
                    firstData.childList = secondData.childList;
                }
            }
        } else if (isAdd) {
            const paneWidth = isVertical ? 100 : 50;
            const paneHeight = isVertical ? 50 : 100;
            console.log("isVertical", isVertical);
            const firstPaneId = getUuid();
            const secondPaneId = getUuid();
            let firstData,
                secondData,
                firstIndex,
                secondIndex,
                firstArr,
                secondArr;
            this.treeNodeChange(tree, currentConId, (item, index, arr) => {
                firstData = item;
                firstIndex = index;
                firstArr = arr;
            });
            this.treeNodeChange(tree, sourceConId, (items, index, arr) => {
                secondData = items;
                secondIndex = index;
                secondArr = arr;
            });
            if (firstData && secondData) {
                const data1 = JSON.parse(JSON.stringify(firstData));
                const data2 = JSON.parse(JSON.stringify(secondData));
                console.log("data1", data1);
                console.log("data2", data2);
                if (firstData.pid === secondData.pid) {
                    console.log("paneWidth", paneWidth);
                    console.log("paneHeight", paneHeight);

                    firstData.width = paneWidth;
                    firstData.height = paneHeight;
                    secondData.width = paneWidth;
                    secondData.height = paneHeight;
                    let nodes;
                    this.treeNodeChange(
                        tree,
                        data1.pid,
                        (items, index, arr) => {
                            nodes = items;
                            nodes.childList = [];
                        }
                    );
                    if (isFirst) {
                        nodes.childList.push(secondData, firstData);
                    } else {
                        nodes.childList.push(firstData, secondData);
                    }
                    console.log("nodes", nodes);
                    // firstData.childList = data2.childList;
                    // secondData.childList = data1.childList;
                } else {
                    //
                    console.log("tess", tess);
                    secondArr.splice(secondIndex, 1);
                    let nodes;
                    console.log("secondData", secondData);
                    this.treeNodeChange(
                        tree,
                        secondData.pid,
                        (items, index, arr) => {
                            const item = JSON.parse(JSON.stringify(items));
                            nodes = items;
                            console.log("nodes", nodes);
                            if (nodes) {
                                nodes.childList = secondArr[0].childList;
                                nodes.childList.forEach(
                                    (res) => (res.pid = secondData.pid)
                                );
                            }
                        }
                    );
                    console.log("secondArr", secondArr);
                    firstData.childList = [];
                    firstData.childList[0] = createEmptyPane(
                        secondPaneId,
                        paneWidth,
                        paneHeight,
                        firstData.id,
                        data1.childList[0].type
                    );
                    if (isFirst) {
                        firstData.childList.unshift(
                            createEmptyPane(
                                firstPaneId,
                                paneWidth,
                                paneHeight,
                                firstData.id,
                                data2.childList[0].type
                            )
                        );
                    } else {
                        firstData.childList.push(
                            createEmptyPane(
                                firstPaneId,
                                paneWidth,
                                paneHeight,
                                firstData.id,
                                data2.childList[0].type
                            )
                        );
                    }
                }
            }
        } else {
            console.warn("检查移动窗格参数");
            return;
        }

        console.log("nextLayouts", nextLayouts);
        this.setState({
            tree: nextLayouts,
        });
        // this.props.actions.updateTree(nextLayouts);
    };
    onCreateArea = (type, position, containerId) => {
        console.log("onCreateArea");
        let { tree } = this.state;
        let nextLayouts = tree;
        const { isCover, isAdd, isFirst, isVertical } = explainDragAction(
            position
        );
        const paneWidth = isVertical ? 100 : 50;
        const paneHeight = isVertical ? 50 : 100;
        if (isCover) {
            const id = getUuid();
            this.treeNodeChange(tree, containerId, (item, index, arr) => {
                item.childList = [                        
                    createArea({type})
                    // {
                    //     id,
                    //     pid: containerId,
                    //     name: id,
                    //     type: type,
                    // },
                ];
            });
        } else if (isAdd) {
            const firstPaneId = getUuid();
            const secondPaneId = getUuid();
            this.treeNodeChange(tree, containerId, (item, index, arr) => {
                const oldData = JSON.parse(JSON.stringify(item.childList[0]));
                item.childList[0] = createEmptyPane(
                    secondPaneId,
                    paneWidth,
                    paneHeight,
                    containerId,
                    oldData.type
                );
                if (isFirst) {
                    item.childList.unshift(
                        createEmptyPane(
                            firstPaneId,
                            paneWidth,
                            paneHeight,
                            containerId,
                            type
                        )
                    );
                } else {
                    item.childList.push(
                        createEmptyPane(
                            firstPaneId,
                            paneWidth,
                            paneHeight,
                            containerId,
                            type
                        )
                    );
                }
            });
        } else {
            console.warn("检查创建窗格参数");
            return;
        }
        this.setState({
            tree: nextLayouts,
        });
        // this.props.actions.updateTree(nextLayouts);
    };

    resizePane = (firstId, secondId, value, isVertical) => {
        let tree = this.state.tree;
        console.log("value", value);
        let firstData, secondData, firstIndex, secondIndex, firstArr, secondArr;
        this.treeNodeChange(tree, firstId, (item, index, arr) => {
            firstData = item;
            firstIndex = index;
            firstArr = arr;
        });
        this.treeNodeChange(tree, secondId, (items, index, arr) => {
            secondData = items;
            secondIndex = index;
            secondArr = arr;
        });
        if (firstData && secondData) {
            if (isVertical) {
                firstData.width = value;
                secondData.width = 100 - value;
            } else {
                firstData.height = value;
                secondData.height = 100 - value;
            }
        }
        this.setState({ tree });
        // this.props.actions.updateTree(tree);
    };
    updateChooseArea=(id)=>{
        console.log('ID',id)
        this.setState({ chooseArea:id===this.state.chooseArea?"":id });
    }
    renderMobile = () => {
        const { actions, template,} = this.props;
        const { tree, } = this.state;
        const {
            width,
            height,
            left,
            top,
            analysisHeight,
            analysisWidth,
            draggable,
            chooseArea
        } = this.state;
        const simulatorHeight = Math.max(analysisHeight - 32, 100);
        const simulatorWidth = Math.max(analysisWidth - 32, 100);
        // let width, height;
        // if ("fixed" === undefined) {
        //     width = 375;
        //     height = 667;
        // } else {
        //     height = simulatorHeight;
        //     width = analysisWidth;
        // }
        console.log("tree=====", tree);
        console.log("width=====", width);
        console.log("height=====", height);
        console.log('chooseArea',chooseArea)

        return (
            <div
                ref="pcHomePage"
                className="pcHomePage"
                style={{
                    height: "calc(100% - 38px)",
                    width: "100%",
                    background: "#ccc",
                }}
            >
                <div
                    style={{
                        width,
                        height,
                        left,
                        top,
                        background: "rgb(255, 240, 240)",
                    }}
                >
                    <PaneBox
                        {...this.props}
                        size={{ width: "100%", height: "100%" }}
                        template={template}
                        actions={actions}
                        treeLayout={tree&&tree[0]}
                        boardId={"board_root"}
                        draggable={draggable}
                        updateDraggable={this.updateDraggable}
                        onCreateArea={this.onCreateArea}
                        isAnalysisEdit={true}
                        onMoveArea={this.onMoveArea}
                        onDeleteArea={this.onDeleteArea}
                        onCopyArea={this.onCopyArea}
                        resizePane={this.resizePane}
                        chooseArea={chooseArea}
                        updateChooseArea={this.updateChooseArea}
                    />
                </div>
            </div>
        );
    };

    render() {
        return this.renderMobile();
    }
}




export default (withRouter(CanvasContainer));
