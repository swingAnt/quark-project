import { QuarkElement, property, customElement,state ,createRef} from "quarkc"
import style from "./index.less?inline"
import classnames from "classnames";


declare global {
  interface HTMLElementTagNameMap {
    "sw-s": Clock;
  }
}

@customElement({ tag: "sw-s", style })
class Clock extends QuarkElement {
  @property({ type: Number }) // 外部属性
  count = 0

  @property({ type: String })
  text = ''
  @property()
  sheetSize = null

  @state()
  draggable=true
  dropRef: any = createRef()




  shouldComponentUpdate(propName, oldValue, newValue) {
    console.log('shouldComponentUpdate-propName', propName)
    console.log('oldValue', oldValue)
    console.log('newValue', newValue)

    if (propName === "xxx") {
      // 阻止更新
      return false
    }
    return true
  }
  componentDidMount() {
    console.log('componentDidMount')


  }




  componentDidUpdate() {
    console.log('componentDidUpdate')


  }

  componentWillUnmount() {
    // 清除副作用

  }




  render() {
    return (
      <div >
     -
      </div>
    );
  }
}
