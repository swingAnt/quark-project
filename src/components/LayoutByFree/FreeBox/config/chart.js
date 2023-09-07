import Thumbnails, { Thumbnail } from '@antv/thumbnails';
//后续优化，组件分开，加载不同文件图形
export const getChart=(type)=>{
return <Thumbnail chart={type} width='150px' height="150px"/>;
}