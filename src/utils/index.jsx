

/**
 * 拖拽事件获取数据
 * @param{*}ev
 */
export const getDragData = ev => {
    let jsonStr;
    const isIE = !!window.ActiveXobject || "ActiveXObject" in window;
    if (isIE) {
        jsonStr = ev.dataTransfer.getData("text");
    } else {
        jsonStr = ev.dataTransfer.getData("data");
    }


    if (!jsonStr) return {};


    try {
        const data = JSON.parse(jsonStr) || {};


        // console.log('[getDragData]', data);


        return data;
    } catch (error) {
        console.log(error);
        return {};
    }
};
/**
 * 拖拽事件赋值
 * @param{*}e 事件
 * @param{*}key 键值
 * @param{*}value 属性值
 */
export const draftEvent = (e, key, value) => {
    const isIE = !!window.ActiveXobject || "ActiveXObject"in window; //判断是否IE浏览器
    //判断是否是IE
    if (isIE) {
        const data = e.dataTransfer.getData("text");
        const arr = data ? JSON.parse(data) : {};
        arr[key] = value;
        e.dataTransfer.setData("text", JSON.stringify(arr));
    } else {
        const data = e.dataTransfer ? e.dataTransfer.getData("data") : {};
        const arr = data ? JSON.parse(data) : {};
        arr[key] = value;
        e.dataTransfer.setData("data", JSON.stringify(arr));
    }
};
//深度判断对象是否相等
// 返回值：true 相同 ；false 有差异
export const diffObj = (obj1, obj2) => {
    // return _.isEqual(obj1, obj2);
}
// 生成UUID
export const getUuid = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (leti = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";


    let uuid = s.join("");
    return uuid;
};
// 初始化PC区域数据
export const createArea = ({ type }) => {
    const newArea = { type };
    console.log('type', type)
    console.log('newArea', newArea)
    if (!newArea) return;
    return {
        ...newArea,
    }
}
export function debounce(func, delay) {
    let timerId;
  
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  