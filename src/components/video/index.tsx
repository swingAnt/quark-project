// import { QuarkElement, property, customElement, state, createRef } from "quarkc"
// import style from "./index.less?inline"

// import Flv from 'flv.js';
// import Hls from 'hls.js';

// declare global {
//   interface HTMLElementTagNameMap {
//     "sw-video": Video;
//   }
// }

// @customElement({ tag: "sw-video", style })
// class Video extends QuarkElement {
// 	@property({ type: Number }) // 外部属性
// 	width = 800
// 	@property({ type: Number }) // 外部属性
// 	height = 600
// 	@property({ type: String }) // 外部属性
// 	url = ''
// 	@state()
// 	player=null
// 	videoRef: any = createRef()



//   shouldComponentUpdate(propName, oldValue, newValue) {
//     console.log('shouldComponentUpdate-propName', propName)
//     console.log('oldValue', oldValue)
//     console.log('newValue', newValue)

//     if (propName === "xxx") {
//       // 阻止更新
//       return false
//     }
//     return true
//   }
//   componentDidMount() {
// 	document.addEventListener('DOMContentLoaded', () => {
// 		const videoElement = this.videoRef.current;
// 		if (videoElement) {
// 		  if (Flv.isSupported() && this.url.indexOf('.flv') > -1){
// 			const flvPlayer = flvjs.createPlayer({
// 			  type: 'flv',
// 			  url: src
// 			});
// 			flvPlayer.attachMediaElement(videoElement);
// 			flvPlayer.load();
// 		  } else if (Hls.isSupported() && this.url.indexOf('.m3u8') > -1) {
// 			const hls = new Hls();
// 			hls.loadSource(src);
// 			hls.attachMedia(videoElement);
// 		  } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
// 			videoElement.src = src;
// 		  }
// 		}
	
// 	});
// 	}




//   componentDidUpdate() {
//     console.log('componentDidUpdate')
	
	

	

//   }

//   componentWillUnmount() {
//     // 清除副作用
// 	if (this.player) {
// 		this.player.destroy();
// 	}
//   }

//   render() {
//     return (
// 		<div className="video-board" style={{ width: this.width ? this.width : '0', height: this.height }}>
// 		<video style={{ width: this.width ? this.width : '0', height: this.height ,background:"black"}} playsInline poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg" ref={this.videoRef} controls crossOrigin>
//         <source style={{ width: this.width ? this.width : '0', height: this.height }}  src={this.url} 
//         // type="application/x-mpegURL"
//          />
//       </video>
		
// 	</div>
//     );
//   }
// }

// export default Video;



// import { QuarkElement, property, customElement, state, createRef } from "quarkc"
// import style from "./index.less?inline"
// import Plyr from 'plyr';
// import 'plyr/dist/plyr.css';
// import flvjs from 'flv.js';
// import Hls from 'hls.js';
// declare global {
// 	interface HTMLElementTagNameMap {
// 		"sw-video": Video;
// 	}
// }

// @customElement({ tag: "sw-video", style })
// class Video extends QuarkElement {

// 	@property({ type: Number }) // 外部属性
// 	width = 800
// 	@property({ type: Number }) // 外部属性
// 	height = 600
// 	@property({ type: String }) // 外部属性
// 	url = ''
// 	@state()
// 	videoRef: any = createRef()




// 	shouldComponentUpdate(propName, oldValue, newValue) {
// 		console.log('shouldComponentUpdate-propName', propName)
// 		console.log('oldValue', oldValue)
// 		console.log('newValue', newValue)
// 		if (propName === "xxx") {
// 			// 阻止更新
// 			return false
// 		}
// 		return true
// 	}
// 	componentDidMount() {
// 		console.log('componentDidMount')
// 		const videoElement = this.videoRef.current;

// 		if (videoElement) {
// 			if (Hls.isSupported() && this.url.indexOf('.m3u8') > -1) {
// 				var player = new Plyr(videoElement, { captions: { active: true, update: true, language: 'en' } });
// 				const hls = new Hls();
// 				hls.loadSource(this.url);
// 				hls.attachMedia(videoElement);
// 				(window as any).hls = hls;
// 				(window as any).player = player;
// 				hls.on(Hls.Events.MANIFEST_PARSED, function () {
// 					videoElement.requestPictureInPicture().catch(error => {
// 						console.error('error', error);
// 					});
// 				});
// 				// Handle changing captions
// 				player.on('languagechange', () => {
// 					// Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
// 					setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
// 				});
// 			}

// 			if (flvjs.isSupported() && this.url.indexOf('.flv') > -1) {
// 				var flvPlayer = flvjs.createPlayer({
// 					type: 'flv',
// 					url: this.url
// 				});
// 				flvPlayer.attachMediaElement(videoElement);
// 				flvPlayer.load();
// 				flvPlayer.on(flvjs.Events.METADATA_ARRIVED, function () {
// 					videoElement.requestPictureInPicture().catch(error => {
// 						console.error('error', error);
// 					});
// 				});

// 				var player = new Plyr(videoElement);

// 			} else {
// 				var player = new Plyr(videoElement);

// 			}



// 			return () => {
// 				if (player) {
// 					player.destroy();
// 				}

// 			};
// 		}


// 	}

// 	componentDidUpdate(a, b) {



// 	}

// 	componentWillUnmount() {
// 		// 清除副作用

// 	}







// 	render() {
// console.log('zzzzz',this)
// 		return (
// 			<div className="video-board" style={{ width: this.width ? this.width : '0', height: this.height }}>
// 				<video style={{ height: '100%' }} playsInline poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg" ref={this.videoRef} controls crossOrigin>
// 					<source src={this.url}
// 					// type="application/x-mpegURL"
// 					/>
// 				</video>
// 			</div>
// 		);
// 	}
// }

// export default Video;



import { QuarkElement, property, customElement, state, createRef } from "quarkc"
import style from "./index.less?inline"

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Flv from 'flv.js';
import Hls from 'hls.js';

declare global {
  interface HTMLElementTagNameMap {
    "sw-video": Video;
  }
}

@customElement({ tag: "sw-video", style })
class Video extends QuarkElement {
	@property({ type: Number }) // 外部属性
	width = 800
	@property({ type: Number }) // 外部属性
	height = 600
	@property({ type: String }) // 外部属性
	url = ''//播放链接
	bg:""//背景图片
	@state()
	player=null
	videoRef: any = createRef()
	domRef: any = createRef()

	
	  

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
  findElementWithMenu(element) {
	// 检查当前元素是否包含名为"menu"的子元素
	const menuElement = element.querySelector('[role="menu"]');
	if (menuElement) {
	  return menuElement;
	}
  
	// 递归查询当前元素的子元素
	const childElements = element.children;
	for (const childElement of childElements) {
	  const foundElement = this.findElementWithMenu(childElement);
	  if (foundElement) {
		return foundElement;
	  }
	}
  
	// 如果没有找到包含名为"menu"的子元素的元素，则返回null
	return null;
  }
  componentDidMount() {

	document.addEventListener('DOMContentLoaded', () => {
		const videoElement = this.videoRef.current;

		// const source = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
		// const source = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
		const source = this.url;

		const video = videoElement;
		console.log('video',video)
		console.log('videoElement',videoElement)

		const player = new Plyr(video,  {
			controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
			settings: ['captions', 'quality', 'speed', 'loop','custom-button'],
			i18n: {
		  speed: '速度',
		  normal: '正常',
		  quality: '质量',
		  download: '下载',
		  // 其他语言翻译...
		},
		//缩略图
	// previewThumbnails: {
    //     enabled: true,
    //     src: 'thumbnails.vtt',
    //   },
	//声音5
	volume: 5, // 设置默认音量为中等（范围：0-10）
	//画面质量
		quality: {
		  default: 720,
		  options: [720, 480, 360], // 根据需要设置不同分辨率的选项
		  forced: true,
		  onChange: (e) => {
			// console.log('当前视频质量：', e.target.value);
		  },
		},
	
	}
		);
		player.on('ready', () => {
			player.volume = 0.5; // 设置默认音量为中等（范围：0-1）

			//1.自定义到工具栏
			// const downloadButton = document.createElement('button');
			// downloadButton.type = 'button';
			// downloadButton.innerHTML = '下载';
			// downloadButton.addEventListener('click', () => {
			//   const source = player.source;
			//   if (source) {
			// 	const link = document.createElement('a');
			// 	link.href = source.src;
			// 	link.download = 'video.mp4';
			// 	link.click();
			//   }
			// });

			// const controls = player.elements.controls;
			// controls.appendChild(downloadButton);
			// 2.将自定义按钮添加到系统设置
			//   const customButton = document.createElement('button');
			//   customButton.type = 'button';
			//   customButton.className = 'plyr__control';
			//   customButton.innerHTML = '自定义按钮';
			//   customButton.addEventListener('click', () => {
			// 	// 自定义按钮的点击事件处理逻辑
			// 	console.log('自定义按钮被点击');
			//   });
			//   const menuContainer = this.domRef.current.querySelector('.plyr__menu__container');
			//   if (menuContainer) {
			// 	const menuItems = this.findElementWithMenu(menuContainer);
			// 	menuItems.appendChild(customButton);
			//   }
		  });
		  
		if(video){
			if (Hls.isSupported() && this.url.indexOf('.m3u8') > -1) {
				const hls = new Hls();
				hls.loadSource(source);
				hls.attachMedia(video);			
				player.on('languagechange', () => {
					setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
				});
			} 
			else if (Flv.isSupported() && this.url.indexOf('.flv') > -1) {
				var flvPlayer = Flv.createPlayer({
					type: 'flv',
					url: this.url
				});
				flvPlayer.attachMediaElement(videoElement);
				flvPlayer.load();
			} 
			else {
				// For more Hls.js options, see https://github.com/dailymotion/hls.js
				// video.src = source;
				// this.player = new Plyr(video);

			}

			
			  
		}});
  }




  componentDidUpdate() {
    console.log('componentDidUpdate')
	
	

	

  }

  componentWillUnmount() {
    // 清除副作用
	if (this.player) {
		this.player.destroy();
	}
  }




  render() {
    return (
		<div ref={this.domRef} className="video-board" style={{ width: this.width ? this.width : '0', height: this.height }}>

		<video style={{ width: this.width ? this.width : '0', height: this.height }} playsInline poster={this.bg} ref={this.videoRef} controls crossOrigin>
        <source src={this.url} 
		//  src="video.mp4"
        // type="application/x-mpegURL"
         />
		         {/* <track kind="metadata" src="thumbnails.vtt" default /> */}

      </video>
		
	</div>
    );
  }
}

export default Video;

