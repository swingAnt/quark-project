import React from "react";
import { withRouter } from "react-router-dom";

import PostMsgService from "root/model/service/PostMsgService";
import { getCookie } from "root/utils/utils";

class MobileContainer extends React.Component {
    _PostMsgService = null;
    state = {
        iframeLoaded: false,
    };

    constructor(props) {
        super(props);

        this.onMessage = this.onMessage.bind(this);
        this._PostMsgService = new PostMsgService({
            onMsgCallBack: this.onMessage,
        });
        window._intellivPostMsgService = this._PostMsgService;
    }

    onMessage(data) {
        const { dynamicAction } = this.props;

        // 同步移动端actions
        if ("analysisReduxSync" === data.type) {
            data.action && dynamicAction(data.action);
        }
    }

    componentDidMount() {}

    changeItem = () => {
        const {
            actions: { changeItem },
            activeItem,
        } = this.props;
        if (activeItem.widgetsIdx < 0) {
            return;
        }
        if (changeItem) {
            changeItem({ widgetsIdx: -1 });
        }
    };

    componentWillUnmount() {
        this._PostMsgService.destory();
    }

    handleIframeLoad = () => {
        const iframe = document.getElementById("mobile-designer-frame");
        this._PostMsgService.setFrame(iframe.contentWindow);
        this._PostMsgService.isReady = true;
        this._PostMsgService.from = "pc-edit";

        this._PostMsgService.sendMsg({
            type: "syncAnalysis",
            template: this.props.template,
        });

        this.setState({ iframeLoaded: true });
    };

    render() {
        const { size, match } = this.props;
        const { width, height } = size;
        const { id } = match.params;
        const { origin, pathname } = window.location;
        const locale = getCookie("locale") || "zh_CN";
        const frameUrl = `${
            origin + pathname
        }mobile/index.html#/template/edit/${id}?in_simulator=true&id=${id}&type=edit&locale=${locale}`;
        return (
            <div className="mobile-canvas-container" onClick={this.changeItem}>
                <div className="mobile-simulator" style={{ width, height }}>
                    {/*<Spin spinning={!iframeLoaded}>*/}
                    <iframe
                        title="mobile"
                        id="mobile-designer-frame"
                        src={frameUrl}
                        frameborder="0"
                        width="100%"
                        height="100%"
                        onLoad={this.handleIframeLoad}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                    {/*</Spin>*/}
                </div>
            </div>
        );
    }
}

export default withRouter(MobileContainer);
