import React, { Component } from "react";
import classnames from "classnames";
import _ from "lodash";
import "./index.less";
const treeNodeChange = (data, key, callback) => {
    //查找id符合的函数
    data.forEach((item, index, arr) => {
        if (item.id === key) {
            return callback(item, index, arr);
        }
        if (item.childList) {
            return treeNodeChange(item.childList, key, callback);
        }
    });
};
const resizePane = (childList, firstId, secondId, value, isVertical) => {
    let firstData, secondData, firstIndex, secondIndex, firstArr, secondArr;
    console.log("childList", childList);
    treeNodeChange(childList, firstId, (item, index, arr) => {
        firstData = item;
        firstIndex = index;
        firstArr = arr;
    });
    treeNodeChange(childList, secondId, (items, index, arr) => {
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
    return childList;
};
export default class splitLine extends Component {
    //鼠标点下的X坐标
    oldClientX = 0;
    //鼠标点下的Y坐标
    oldClientY = 0;

    oldFirstHeight = 0;
    oldFirstWidth = 0;
    oldSecondHeight = 0;
    oldSecondWidth = 0;

    value = 0;

    //

    mouseDown = (e) => {
        /*定义鼠标移动事件*/
        document.onmousemove = this.doMouseMove;

        /*定义鼠标抬起事件*/
        document.onmouseup = this.doMouseUp;

        let event = e || window.event;

        /*获取鼠标按下的地方距离元素左侧和上侧的距离*/
        this.oldClientX = event.clientX;
        this.oldClientY = event.clientY;

        const { paneBox, treeLayout } = this.props;

        const firstBox = paneBox.children[0];
        const secondBox = paneBox.children[2];

        this.oldFirstWidth = firstBox.offsetWidth;
        this.oldFirstHeight = firstBox.offsetHeight;

        this.oldSecondWidth = secondBox.offsetWidth;
        this.oldSecondHeight = secondBox.offsetHeight;

        this.target = event.target;

        this.props.updateDraggable(false);

        const isVertical = treeLayout.childList[0].height === 100;
        if (isVertical) {
            this.value = treeLayout.childList[0].width;
        } else {
            this.value = treeLayout.childList[0].height;
        }

        e.stopPropagation();
    };

    doMouseMove = (e) => {
        /*事件兼容*/
        let event = e || window.event;

        const {
            paneBox,
            treeLayout,
            treeLayout: { childList },
        } = this.props;

        //移动后对象的xy坐标
        let disX = event.clientX - this.oldClientX;
        let disY = event.clientY - this.oldClientY;

        const paneWidth = paneBox.offsetWidth;
        const paneHeight = paneBox.offsetHeight;

        const isVertical = childList[0].height === 100;

        if (isVertical) {
            if (disX > 0) {
                disX =
                    this.oldSecondWidth - disX >= 0
                        ? disX
                        : this.oldSecondWidth;
            } else {
                disX =
                    this.oldFirstWidth + disX >= 0 ? disX : -this.oldFirstWidth;
            }
            this.value = ((this.oldFirstWidth + 2 + disX) / paneWidth) * 100;
        } else {
            if (disY > 0) {
                disY =
                    this.oldSecondHeight - disY >= 0
                        ? disY
                        : this.oldSecondHeight;
            } else {
                disY =
                    this.oldFirstHeight + disY >= 0
                        ? disY
                        : -this.oldFirstHeight;
            }
            this.value = ((this.oldFirstHeight + 2 + disY) / paneHeight) * 100;
        }

        this.props.resizePane(
            childList[0].id,
            childList[1].id,
            this.value,
            isVertical
        );

        this.setState({ active: true });
        e.stopPropagation();
    };

    doMouseUp = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;

        const {
            treeLayout: { childList },
        } = this.props;
        const isVertical = childList[0].height === 100;

        this.props.resizePane(
            childList[0].id,
            childList[1].id,
            this.value,
            isVertical
        );

        this.props.updateDraggable(true);

        e.stopPropagation();
    };

    render() {
        const { props } = this;
        const { treeLayout } = props;
        const { childList } = treeLayout;
        return (
            <div
                className={classnames("split-line", {
                    isVertical: childList[0].height === 100,
                })}
                onMouseDown={this.mouseDown}
            />
        );
    }
}
