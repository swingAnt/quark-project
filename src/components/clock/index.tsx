import { QuarkElement, property, customElement,state ,createRef} from "quarkc"
import style from "./index.less?inline"
import classnames from "classnames";


declare global {
  interface HTMLElementTagNameMap {
    "sw-clock": Clock;
  }
}

@customElement({ tag: "sw-clock", style })
class Clock extends QuarkElement {
  @property({ type: Number }) // 外部属性
  count = 0

  @property({ type: String })
  text = ''
  @property()
  sheetSize = null

  @state()
  draggable=true
  hRef: any = createRef()
  mRef: any = createRef()
  secRef: any = createRef()
  yuanRef: any = createRef()
  showRef: any = createRef()



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
			//获取指针
			var s = this.secRef.current;
			var m = this.mRef.current;
			var h = this.hRef.current;
			var showRef = this.showRef.current;

			function times(){
				//获取时间
				var date = new Date()
				var hours = date.getHours()
				var min = date.getMinutes()
				var sec = date.getSeconds()
				
				// console.log(hours+" "+min+" "+sec)
				//计算每一秒走的度数
				var deg_s = sec*6;
				var deg_m = (min*60+sec)/10;
				var deg_h = (hours*3600+min*60+sec)/(3600*12)*360;
				
				s.style.transform = "rotate("+deg_s+"deg)"
				m.style.transform = "rotate("+deg_m+"deg)"
				h.style.transform = "rotate("+deg_h+"deg)"
			}
			times()
			setInterval(times,1000)
			
			function time(){
				//获取时间
				var date = new Date()
				var hours = date.getHours()
				var min = date.getMinutes()
				var sec = date.getSeconds()
				
				showRef.innerHTML = hours+":"+min+":"+sec
			}
			// time()
			setInterval(time,1000)

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
     	<div className="box1">
			<span ref={this.showRef} className="show" id="show" ></span>
		</div>
		<div className="box">
			<div className="kd">
				<span><i>1</i></span>
				<span><i>2</i></span>
				<span><i>3</i></span>
				<span><i>4</i></span>
				<span><i>5</i></span>
				<span><i>6</i></span>
				<span><i>7</i></span>
				<span><i>8</i></span>
				<span><i>9</i></span>
				<span><i>10</i></span>
				<span><i>11</i></span>
				<span><i>12</i></span>
				
				<div ref={this.hRef} id="h"></div>
				<div ref={this.mRef} id="m"></div>
				<div ref={this.secRef} id="sec"></div>
				<div ref={this.yuanRef} id="yuan"></div>
			</div>
		</div>
      </div>
    );
  }
}

