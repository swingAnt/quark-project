import { pictureTabs } from "../../utils/TemplateByPc/picture/pictureTabs.js";
export const getTabs = (type) => {
    let tabs;
    switch (type) {
        case 'picture':
            tabs = pictureTabs.tabs;
            break;
        default:
            break;
    }
    console.log('typesss',type)
    console.log('tabstabs',tabs)
    return tabs;
}


