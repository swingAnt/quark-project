import {Input,DatePicker,Rate,Tree,Switch} from 'antd'
import Table from './table'
import Panel from './panel'

const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: (
                <span
                  style={{
                    color: '#1890ff',
                  }}
                >
                  sss
                </span>
              ),
              key: '0-0-1-0',
            },
          ],
        },
      ],
    },
  ];
  

export const getAntdPlug=(type)=>{
    let view;
    switch (type) {
        case 'input':
            view=<Input placeholder="Basic usage" />
            break;
        case 'date':
            const dateFormat = 'YYYY/MM/DD';
            view=  <DatePicker  format={dateFormat} />
                break;
        case 'rate':
            view=  <Rate allowHalf defaultValue={2.5} />
            break;
            case 'table':
                view=   <Table
              />
                break;
                case 'tree':
                    view=  <Tree
                    checkable
                    defaultExpandedKeys={['0-0-0', '0-0-1']}
                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                    defaultCheckedKeys={['0-0-0', '0-0-1']}
                    treeData={treeData}
                  />
                    break;
                    case 'switch':
                        view= <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                        break;
                        case 'panel':
                            view=   <Panel
                          />
                            break;
        default: 
            break;
    }
return view
}