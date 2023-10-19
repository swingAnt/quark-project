import { QuarkElement, property, customElement, state, createRef } from "quarkc"
import style from "./index.less?inline"
import classnames from "classnames";
import moment from 'moment';
import go from '@/asset/go.png'
import back from '@/asset/back.png'
import clean from '@/asset/clean.png'
import svg from '@/asset/svg.png'
import png from '@/asset/png.png'

declare global {
	interface HTMLElementTagNameMap {
		"sw-drawing": DrawingBoard;
	}
}

@customElement({ tag: "sw-drawing", style })
class DrawingBoard extends QuarkElement {

	@property({ type: Number }) // 外部属性
	width = 800
	@property({ type: Number }) // 外部属性
	height = 600
	@state()
	ctx = null;
	drawing = false;
	color = '#000000';
	lineWidth = 1;
	lineDash = [];
	history = [];
	redoHistory = [];
	@state()
	isErasing = false;
	canvasRef: any = createRef()



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

		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		this.ctx = context

	}



	startDrawing = (e) => {

		const { offsetX, offsetY } = e;


		this.ctx.beginPath();
		this.ctx.moveTo(offsetX, offsetY);
		this.drawing = true
		this.redoHistory = []
	};
	draw = (e) => {
		if (!this.drawing) return;
		const { offsetX, offsetY } = e;
		this.ctx.lineTo(offsetX, offsetY);
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.setLineDash(this.lineDash);
		this.ctx.stroke();
	};
	stopDrawing = () => {
		if (this.drawing) {
			this.ctx.closePath();
			this.drawing = false
			const canvas = this.canvasRef.current;
			this.history = [...this.history, canvas.toDataURL()];
		}

	};
	changeColor = (e) => {
		if (this.isErasing) {
			this.isErasing = false
		}
		this.color = e.target.value
	};
	changeLineWidth = (e) => {
		this.lineWidth = parseInt(e.target.value)
	};
	changeLineDash = (e) => {
		const dashValue = e.target.value.split(',').map((val) => parseInt(val));
		this.lineDash = dashValue
	};
	exportAsPNG = () => {
		const canvas = this.canvasRef.current;
		const dataURL = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'drawing.png';
		link.click();
	};

	exportAsSVG = () => {
		const canvas = this.canvasRef.current;
		const data = canvas.toDataURL('image/svg+xml');
		const link = document.createElement('a');
		link.href = data;
		link.download = 'drawing.svg';
		link.click();
	};

	componentDidUpdate(a, b) {



	}

	componentWillUnmount() {
		// 清除副作用

	}





	undo = () => {
		if (this.history.length === 0) return;
		const canvas = this.canvasRef.current;
		const showDataURL = this.history[this.history.length - 2];
		const lastDataURL = this.history[this.history.length - 1];

		const img = new Image();
		img.src = showDataURL;
		img.onload = () => {
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.ctx.drawImage(img, 0, 0);
			this.redoHistory = [...this.redoHistory, lastDataURL]
			this.history = this.history.slice(0, this.history.length - 1)

		};
	};

	redo = () => {
		if (this.redoHistory.length === 0) return;
		const canvas = this.canvasRef.current;
		const lastDataURL = this.redoHistory[this.redoHistory.length - 1];
		const img = new Image();
		img.src = lastDataURL;
		img.onload = () => {
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.ctx.drawImage(img, 0, 0);
			this.history = [...this.history, lastDataURL]
			this.redoHistory = this.redoHistory.slice(0, this.redoHistory.length - 1)

		};
	};

	erase = () => {
		this.color = '#ffffff';
		this.isErasing = true
	};


	render() {

		return (
			<div className="draw-board" style={{width: this.width ? this.width + 40 : '0',height:this.height}}>
  <canvas
					ref={this.canvasRef}
					width={this.width}
					height={this.height}
					onMouseDown={this.startDrawing}
					onMouseMove={this.draw}
					onMouseUp={this.stopDrawing}
					style={this.isErasing ? {
						// cursor:'url(${clean}) 20px 20px, auto'
						cursor: 'pointer'
					} : {
						cursor: 'crosshair',
					}}

				/>
				<div className="tools">
				<div className='font'>颜色：<input className='color' type="color" value={this.color} onChange={this.changeColor} /></div>
				<div className='font'>线宽：<input className='input' type="number" min="1" max="10" value={this.lineWidth} onChange={this.changeLineWidth} /></div>
				<div className='font'>虚线:<input className='input' width='20px' type="text" onChange={this.changeLineDash} /></div>
				<img src={svg}  onClick={this.exportAsSVG} title="导出svg" style={{cursor:"pointer"}}/>
				<img src={png}  onClick={this.exportAsPNG} title="导出png" style={{cursor:"pointer"}}/>
				<img src={go}  onClick={this.undo} title="上一步" style={{cursor:"pointer"}}/>
				<img src={back}  onClick={this.redo} title="下一步" style={{cursor:"pointer"}}/>
				<img src={clean}  onClick={this.erase} title="橡皮擦" style={{cursor:"pointer"}}/>

				</div>
			
			</div>
		);
	}
}

export default DrawingBoard;




