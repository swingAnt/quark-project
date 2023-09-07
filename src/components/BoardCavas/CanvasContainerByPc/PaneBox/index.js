import React, { Component } from "react";
import classnames from "classnames";
import { message, Modal } from "antd";
import dragInstance from "../dragInstance";
import SplitLine from "./SplitLine";
import { draftEvent } from "root/utils/utils";
// import { getCookie } from "root/utils/utils";
import _ from "lodash";
import Bus from "root/utils/eventBus";
import AreaInstance from '../AreaInstance'

import "./index.less";

const BORDER_WIDTH = 0;
const DOUBLE_BORDER_WIDTH = BORDER_WIDTH * 2;
const SPLIT_LINE_WIDTH = 4;
const confirm = Modal.confirm;

export default class PaneBox extends Component {
    paneBox = null;

    isSelf = false;

    state = {
        position: "",
        width: 0,
        height: 0,
        unClose: false,
        isfull: false,
        fullWidth: 0,
        fullHeight: 0,
        isDragEnter: false,
    };

    componentDidMount() {
        this.setState({
            width: this.paneBox.offsetWidth - DOUBLE_BORDER_WIDTH,
            height: this.paneBox.offsetHeight - DOUBLE_BORDER_WIDTH,
            fullWidth: document.documentElement.clientWidth,
            fullHeight: document.documentElement.clientHeight,
        });
        window.addEventListener("resize", this.resizeWidthHeight);
    }
    resizeWidthHeight = () => {
        this.setState({
            fullWidth: document.documentElement.clientWidth,
            fullHeight: document.documentElement.clientHeight,
        });
    };

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.resizeWidthHeight);
    };

    componentDidUpdate(prevProps, prevState) {
        const { width, height } = prevState;
        const {
            width: domWidth,
            height: domHeight,
        } = this.paneBox.getBoundingClientRect();
        const newWidth = domWidth - DOUBLE_BORDER_WIDTH;
        const newHeight = domHeight - DOUBLE_BORDER_WIDTH;
        if (!newWidth || !newHeight) return false;

        if (width !== newWidth || height !== newHeight) {
            this.setState({
                width: newWidth,
                height: newHeight,
            });
        }
    }

    getDragImg = () => {
        const { props } = this;
        const { treeLayout } = props;
        const { childList } = treeLayout;
        let dragImg = null;
        if (childList && childList.length) {
            const area = childList[0];
            dragImg = "";
        }
        return dragImg;
    };

    handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!this.inPositionPart) {
            this.setState({ isDragEnter: false });
        }
        this.props.updateDraggable(true);
    };

    handleDragEnter = (e, richEditorIsEdit) => {
        const { isDragEnter } = this.state;
        e.preventDefault();
        e.stopPropagation();
        if (isDragEnter) return false;
        if (this.isSelf || richEditorIsEdit) return false;
        this.setState({
            isDragEnter: true,
        });
        this.props.updateDraggable(false);
    };

    positionPartEnter = (p, e) => {
        this.inPositionPart = true;
        this.setState({ position: p });
    };

    positionPartLeave = (e) => {
        this.inPositionPart = false;
    };

    handleDragEnd = () => {
        this.isSelf = false;
        dragInstance.dragSource = {
            target: null,
            boardId: null,
        };
    };

    handleDragStart = (e) => {
        const dragImg = this.getDragImg();
        if (dragImg) {
            e.dataTransfer.setDragImage(dragImg, 40, 40);
        }
        // e.dataTransfer.setData("containerId", this.props.treeLayout.id);
        draftEvent(e, "containerId", this.props.treeLayout.id);
        dragInstance.dragSource = {
            target: e.target,
            boardId: this.props.boardId,
        };

        this.isSelf = true;

        e.stopPropagation();
    };
    handleDrop = (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        const { position } = this.state;
        const { treeLayout, onCreateArea, onMoveArea } = this.props;
        const { id: currentConId } = treeLayout;
        // 防止跨面板拖拽
        const { dragSource } = dragInstance;
        if (dragSource.boardId && dragSource.boardId !== this.props.boardId) {
            console.warn("onDrop: 检测到跨面板拖拽, dragSource:", dragSource);
            return false;
        }
        const isIE = !!window.ActiveXobject || "ActiveXObject" in window; //判断是否IE浏览器
        let data = {};
        //判断是否是IE
        if (isIE) {
            data = JSON.parse(e.dataTransfer.getData("text"));
        } else {
            data = JSON.parse(e.dataTransfer.getData("data"));
        }
        const type = data.type;
        console.log('data',data)
        if ("board_tabspane" === this.props.boardId && "TabsArea" === type) {
            message.error("不支持多页签多层嵌套");
        }
        if (
            type === "AreaField" ||
            ("board_tabspane" === this.props.boardId && "TabsArea" === type)
        ) {
            this.setState({
                position: "",
            });
            return false;
        }
        const sourceConId = data.containerId;
        const execDrop = () => {
            // onCreateArea(type, position, currentConId);
            if (sourceConId && sourceConId !== currentConId && position) {
                onMoveArea && onMoveArea(sourceConId, currentConId, position);
            } else if (type) {
                onCreateArea && onCreateArea(type, position, currentConId);
            }
            this.setState({
                position: "",
                isDragEnter: false,
            });
        };
        if (position === "center" && treeLayout.childList.length > 0) {
            Bus.emit("changeGraphWidgetsTabVisible", false);
            Bus.emit("changeFixedActionMenuVisible", false);
            confirm({
                title: `${"是否要替换当前图表"}?`,
                onOk() {
                    execDrop();
                },
                onCancel: () => {
                    this.setState({
                        position: "",
                        isDragEnter: false,
                    });
                },
            });
        } else {
            execDrop();
        }
        this.props.updateDraggable(true);
    };
    // handleDrop = async (e) => {
    //     e.target.classList.remove('drag-enter');
    //     const { layoutRows, areas, activeDsId, updateAnaModel } = this.props;

    //     // create row
    //     const newRow = CanvasLib.createRow(0.75);
    //     const nextRows = layoutRows.concat(newRow);
    //     const currentConId = newRow.childList[0].id;

    //     let data = getDragData(e);
    //     const type = data.type;
    //     const payload = data.dragItem || null;
    //     // 暂不支持filter
    //     if('TableField' === type) {
    //         return false;
    //     }

    //     if(type){
    //         const {area, param} = await ToolsAreas.buildArea(type, payload, areas, activeDsId);
    //         const {nodes, rmAreaId} = CanvasLib.treeAppend(nextRows, currentConId, 'center', area.id);

    //         // update model
    //         updateAnaModel({
    //             newArea: area,
    //             newParam: param,
    //             rmAreaId,
    //             rows: nodes
    //         });
    //     }
    // };
    getPaneBoxes = () => {
        const { props } = this;
        const { treeLayout, isAnalysisEdit } = props;
        let { childList } = treeLayout||{};
        switch (_.isArray(childList) && childList.length) {
            case 2:
                const firstBox = treeLayout.childList[0];
                const secondBox = treeLayout.childList[1];
                const firstPaneBox = (
                    <PaneBox
                        {...props}
                        parentBox={treeLayout}
                        key={firstBox.id}
                        treeLayout={firstBox}
                        size={this.getPaneSize(firstBox, secondBox)}
                    />
                );
                const secondPaneBox = (
                    <PaneBox
                        {...props}
                        parentBox={treeLayout}
                        key={secondBox.id}
                        treeLayout={secondBox}
                        size={this.getPaneSize(secondBox, firstBox)}
                    />
                );
                const splitLine = (
                    <SplitLine
                        key="split-line"
                        {...props}
                        paneBox={this.paneBox}
                    />
                );
                if (isAnalysisEdit) {
                    return [firstPaneBox, splitLine, secondPaneBox];
                } else {
                    return [firstPaneBox, secondPaneBox];
                }
            case 1:
                //容器（图、表、筛选器等）
                return [
                    this.renderArea(treeLayout),
                    // isAnalysisEdit && !active && <div style={{width:'100%', height:'100%', position:'absolute',zIndex:100,backgroundColor:'transparent', top: 0, left: 0}}></div>
                ];
            default:
                return null;
        }
    };
    renderArea = (treeLayout) => {
        const { isfull } = this.state;
        const { onCopyArea, onDeleteArea, chooseArea, updateChooseArea,actions } = this.props;
        const area = treeLayout.childList[0];
        const size = isfull
            ? {
                width: this.state.fullWidth,
                height: this.state.fullHeight,
            }
            : {
                width: this.state.width,
                height: this.state.height,
            };
        return (
            <div onClick={() => {
                updateChooseArea(area.id);
            }}
                style={chooseArea === area.id ? {
                    border: '1px solid #f5222d',
                    width: '100%',
                    height: '100%',
                    // background:'#'+Math.floor(Math.random()*16777215).toString(16)
                } :
                    {
                        width: '100%',
                        height: '100%',
                        // background:'#'+Math.floor(Math.random()*16777215).toString(16)
                    }}
                    id={`area-${area.id}`}
                    key={`area-${area.id}`}

            >
                {area.name}
                {area.type}
                <div>
                    <a onClick={() => onCopyArea(treeLayout)}>复制</a>
                    <a onClick={() => onDeleteArea(treeLayout.id)}>删除</a>
                </div>
                <div className="area-instance-show" 
                // onClick={() => actions.changeItem(area)}
                >
                <AreaInstance area={area} isEdit={true}/>
                </div>
            </div>
        );
    };

    getPaneSize = (pane, brotherPane) => {
        const direction = pane.width === 100 ? "VERTICAL" : "HORIZONTAL";
        // const { isAnalysisEdit } = this.props;
        const isAnalysisEdit = true;
        const FOLD_BUTTON_WIDTH = 15;
        if (pane.isFold) {
            if (direction === "VERTICAL") {
                return {
                    width: "100%",
                    height: FOLD_BUTTON_WIDTH,
                };
            } else {
                return {
                    width: FOLD_BUTTON_WIDTH,
                    height: "100%",
                };
            }
        } else if (brotherPane.isFold) {
            if (direction === "VERTICAL") {
                return {
                    width: "100%",
                    height: `calc(100% - ${SPLIT_LINE_WIDTH}px - ${FOLD_BUTTON_WIDTH}px)`,
                };
            } else {
                return {
                    width: `calc(100% - ${SPLIT_LINE_WIDTH}px - ${FOLD_BUTTON_WIDTH}px)`,
                    height: "100%",
                };
            }
        } else {
            if (direction === "VERTICAL") {
                return {
                    width: "100%",
                    height: isAnalysisEdit
                        ? `calc(${pane.height}% - ${SPLIT_LINE_WIDTH / 2}px)`
                        : `${pane.height}%`,
                };
            } else {
                return {
                    width: isAnalysisEdit
                        ? `calc(${pane.width}% - ${SPLIT_LINE_WIDTH / 2}px)`
                        : `${pane.width}%`,
                    height: "100%",
                };
            }
        }
    };

    setFull = (isfull) => {
        const { setTabFull, setHasFull } = this.props;
        this.setState({ isfull });
        setTabFull && setTabFull(isfull);
        setHasFull && setHasFull(isfull);
    };

    renderPositionParts = (isAreaContainer, isEmptyContainer) => {
        const { isDragEnter, position } = this.state;
        const isContainer = isAreaContainer || isEmptyContainer;
        if (!isContainer || !isDragEnter) return null;

        let positions = ["center"];
        if (isAreaContainer) {
            positions = positions.concat(["top", "right", "bottom", "left"]);
        }

        return (
            <div className="response-layer">
                {positions.map((p) => {
                    return (
                        <div
                            className={`mouse-${p}-part ${
                                isEmptyContainer ? "empty" : ""
                                }`}
                            onDragEnter={this.positionPartEnter.bind(this, p)}
                            onDragLeave={this.positionPartLeave}
                        />
                    );
                })}
                {position && (
                    <div className={`${position}-part position-part`} />
                )}
            </div>
        );
    };

    render() {
        const { props, state } = this;
        const { treeLayout, isAnalysisEdit, draggable } = props;
        const { childList } = treeLayout||{};
        const isAreaContainer = childList&&_.isArray(childList) && childList.length === 1;
        const isEmptyContainer = childList&&_.isArray(childList) && childList.length === 0;
        const area = childList?childList[0]:{};
        const { isfull } = state;
        return (
            <div
                className={classnames("pane-boxs", {
                    full: isfull,
                    edit: isAnalysisEdit,
                    "area-container": isAreaContainer,
                })}
                style={{
                    width: props.size.width,
                    height: props.size.height,
                }}
                draggable={draggable}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onDragEnter={(e) =>
                    this.handleDragEnter(e, area && area.isEdit)
                }
                onDragLeave={this.handleDragLeave}
                ref={(paneBox) => (this.paneBox = paneBox)}
            >
                {this.getPaneBoxes()}
                {this.renderPositionParts(isAreaContainer, isEmptyContainer)}
            </div>
        );
    }
}
