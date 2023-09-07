/**
 * 右侧属性栏
 * wangkg
 */
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
    initTab,
    initPage,
} from "root/containers/TemplateMNG/utils/Template/createTem";
import { Popover, Collapse } from "antd";
import update from "immutability-helper";
import ObjectTreeSelect from "root/containers/TemplateMNG/components/ObjectTreeSelect";
import style from "./index.module.less";
import * as actions from "../../redux/actionCommon";
import Template from "root/containers/TemplateMNG/components/Template";
import { connect } from "react-redux";
import {
    conditionTypeList,
    iconGroupOperatorList,
    iconGroupValueTypes,
    iconList,
    icons,
    customIcons
} from 'root/utils/iconSetting';
import {getTabs} from './getTabs';
import ImageCropperModal from "root/containers/TemplateMNG/components/ImageCropperModal";
import DynamicComponent from 'seer-dynamic-component';

const { Panel } = Collapse;
const iconResource = [{
    tabName: "常用图标",
    icons: icons.map(icon => ({
        id: icon.id,
        key: "ap " + icon.style.iconKey,
        color: icon.style.iconColor,
    }))
}, {
    tabName: "自定义图标",
    icons: customIcons.map(icon => ({
        id: icon.id,
        key: "icon iconfont " + icon.key,
    }))
}];

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showObjectTreeSelect: false,
            showIconSelect: false,
            showAlert: "",
        };
    }

    handleAdd = () => {
        const {
            actions: { addTabs, updatePages, updateTabs},
            widget,
            manifest,
            pages,
        } = this.props;
        if (manifest && manifest.name === "navs") {
            const page = initPage({ pages });
            const newPages = update(pages, {
                $push: [page],
            });
            updatePages && updatePages({ pages: newPages, type: "" });
        } else {
            const tab = initTab({
                tabs: widget.setting.tabs,
                type: widget.type,
            });
            addTabs({ tab });
        }
    };


    getAddIcon = () => {
        const { isPickup, allSets, manifest } = this.props;
        const { showObjectTreeSelect } = this.state;
        if (
            manifest &&
            (manifest.name === "tabs" || manifest.name === "navs")
        ) {
            return (
                <i
                    className={`ap ap-plus ${isPickup ? "icon-disabled" : ""}`}
                    onClick={(e) => {
                        if (isPickup) return;
                        e.stopPropagation();
                        this.handleAdd();
                    }}
                />
            );
        }
        const multiple =  !!!(manifest && manifest.name === "page");
        const content = showObjectTreeSelect && (
            <ObjectTreeSelect
                allSets={allSets}
                multiple={multiple}
                onOk={this.handleObject}
                onCancel={() =>
                    this.changeState({
                        key: "showObjectTreeSelect",
                        value: false,
                    })
                }
            />
        );
        return (
            <Popover
                placement="bottomRight"
                content={content}
                trigger="click"
                visible={showObjectTreeSelect}
            >
                <i
                    className={`ap ap-plus ${isPickup ? "icon-disabled" : ""}`}
                    onClick={(e) => {
                        this.changeState({
                            key: "showObjectTreeSelect",
                            value: true,
                        });
                        e.stopPropagation();
                    }}
                />
            </Popover>
        );
    };

    changeState = ({ key, value }) => {
        this.setState({
            [key]: value,
        });
    };

    handleObject = (item) => {
        const { selectedData } = item;
        const {
            widget: {
                setting: { tabs },
                type,
            },
            actions: { updateTabs },
            manifest: { name }
        } = this.props;
        let newTabs = name === "page" ? []: tabs;
        if (Array.isArray(selectedData)) {
            selectedData.forEach((item) => {
                const tab = initTab({ tabs: newTabs, type, props: item });
                newTabs.push(tab);
            });
        }
        if (updateTabs) {
            updateTabs({ tabs: newTabs });
        }
        this.changeState({ key: "showObjectTreeSelect", value: false });
    };

    /**
     * @param {{color: string, icon: string, currentTab: map}} item
     * */
    saveStyle = (item) => {
        const {
            color,
            icon,
            currentTab: { index, tab },
        } = item;
        const {
            widget,
            actions: { updateTabs, updatePages },
            activeItem: { widgetsIdx },
            pages,
        } = this.props;
        // 处理pages
        if (widgetsIdx < 0) {
            let newPages = update(pages, {
                [index]: {
                    props: {
                        $set: {
                            iconClass: icon,
                            iconColor: color,
                        },
                    },
                },
            });
            if (updatePages) {
                updatePages({ pages: newPages, type: "update" });
            }
            this.setState({ showAlert: "" });
            return;
        }
        const {
            setting: { tabs },
        } = widget;
        let newTabs = update(tabs, {
            [index]: {
                props: {
                    $set: {
                        ...tab.props,
                        iconClass: icon,
                        iconColor: color,
                    },
                },
            },
        });
        if (updateTabs) {
            updateTabs({ tabs: newTabs });
        }
        this.setState({ showAlert: "" });
    };

    changeIcon = (item) => {
        let iconColor = "",
            iconClass = "";
        const { tab: {props}, currentItem } = item;
        // 当前来自常用
        if(currentItem){
            const {key: icon, color} = currentItem;
            this.saveStyle({ icon, color, currentTab: item });
            return
        }
        if (props && props.iconClass) {
            iconColor = props.iconColor;
            iconClass = props.iconClass;
        }
        let settingData = {
            key: iconClass,
            color: iconColor,
        };
        const showAlert = (
            <DynamicComponent
                id="intelliv.analysis.iconSet"
                iconResource={iconResource}
                visible={true}
                handleOk={(itemIcon) => {
                    const {key: icon, color} = itemIcon;
                    this.saveStyle({ icon, color, currentTab: item });
                }}
                isShowSize={false}
                onCancel={() => {
                    this.setState({showAlert: ""})
                }}
                iconInfo={settingData}
            />
        )
        // const showAlert = (
        //     <IconSettingModal
        //         settingData={settingData}
        //         saveStyle={(color, icon) => {
        //             this.saveStyle({ icon, color, currentTab: item });
        //         }}
        //         iconFlag={true}
        //         iconSetting={() => {
        //             this.setState({ showAlert: "" });
        //         }}
        //     />
        // );
        this.setState({ showAlert });
    };

    // 处理页签变化
    updateTabs = (item) => {
        const {
            actions: { updateTabs, updatePages, changeItem },
            manifest,
        } = this.props;
        const { tabs,  type} = item;
        if (manifest.name === "navs") {
            if(type === "hidePage"){
                changeItem && changeItem({
                    pagesIdx: 0,
                    widgetsIdx: -1
                })
            }
            updatePages &&
                updatePages({
                    ...item,
                    pages: tabs,
                });
        } else {
            updateTabs && updateTabs(item);
        }
    };

    /**
     *修改图片
     * @param {{index: number, cardData: Object}} item
     * */
    updateImage = (item) => {
        const {
            cardData: { props },
        } = item;
        const imageUrl = props && props.imageUrl;
        const showAlert = (
            <ImageCropperModal
                onCancel={() => {
                    this.setState({ showAlert: "" });
                }}
                defaultUrl={imageUrl}
                onOk={(imageData) =>
                    this.changeImage({ initData: item, imageData })
                }
                title={imageUrl ? "修改图片" : "添加图片"}
            />
        );
        this.setState({ showAlert });
    };

    /**
     * 图片数据回调
     * @param {{initData: {}, imageData: {url}}} item
     * */
    changeImage = (item) => {
        const {
            initData: { index, cardData },
            imageData: { url },
        } = item;
        const {
            actions,
            widget: {
                setting: { tabs },
            },
        } = this.props;
        if (actions && actions.updateTabs) {
            actions.updateTabs({
                tabs: update(tabs, {
                    [index]: {
                        props: {
                            $set: {
                                ...cardData.props,
                                imageUrl: url,
                            },
                        },
                    },
                }),
            });
        }
    };

    render() {
        const {
            activeItem,
        } = this.props;
        const {type}=activeItem||{};
        const { showAlert } = this.state;
        const tabs = getTabs(type);
        return (
            <div className={style.container}>
                {/* <div className={style.title}>{title}</div> */}
                {Array.isArray(tabs) &&
                    tabs.length > 0 &&
                    tabs.map((tab) => (
                        <Collapse
                            bordered={false}
                            // onChange={this.onChange}
                        >
                            {tab.panels.map((panel, index) => {
                                const { showBorderTop = true } = panel;
                                return panel.noPanel ? (
                                    <div
                                        className={style.panel}
                                        style={{
                                            borderTop: showBorderTop
                                                ? "1px solid #d9d9d9"
                                                : null,
                                        }}
                                    >
                                        <div
                                            className={style.panelTitle}
                                            style={{
                                                borderBottom:
                                                    index === 0
                                                        ? "1px solid #d9d9d9"
                                                        : null,
                                            }}
                                        >
                                            <span>{panel.name}</span>
                                            <span>
                                                {" "}
                                                {panel.add && this.getAddIcon()}
                                            </span>
                                        </div>
                                        {panel.getComponent &&
                                            panel.getComponent({
                                                ...this.props,
                                                componentType:type
                                            })}
                                    </div>
                                ) : (
                                    <Panel
                                        header={
                                            <div className="panel-header-content">
                                                <span title={panel.name}>
                                                    {panel.name}
                                                </span>
                                                {panel.add && this.getAddIcon()}
                                            </div>
                                        }
                                        key={`${panel.key}-${index}`}
                                    >
                                        {panel.getComponent &&
                                            panel.getComponent({ 
                                                ...this.props,
                                            })}
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    ))}
                {showAlert}
                <DynamicComponent
                    id="intelliv.analysis.iconSet"
                    iconResource={iconResource}
                    visible={false}
                    handleOk={(itemIcon) => {
                        // const {key: icon, color} = itemIcon;
                        // this.saveStyle({ icon, color, currentTab: item });
                    }}
                    isShowSize={false}
                    onCancel={() => {
                        this.setState({showAlert: ""})
                    }}
                    iconInfo={{}}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ template }) => {
    const {
        site: {
            activeItem,
        }
    } = template;
    return {
        activeItem,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
