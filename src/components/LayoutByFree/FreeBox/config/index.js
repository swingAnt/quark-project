import  { getChart } from './chart.js';
import  { getAntdPlug } from './antd.js';

export const getView=(key,type)=>{
    let view;
    switch (key) {
        case 'chart':
            view=getChart(type);
            break;
        case 'antd':
                view=getAntdPlug(type);
                break;
        default:
            break;
    }
return view
}