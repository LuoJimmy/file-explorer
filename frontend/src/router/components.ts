import { RouteRecordRaw } from 'vue-router'

// 组件演示页面
import ButtonDemo from '@/views/components/ButtonDemo.tsx'
import InputDemo from '@/views/components/InputDemo.tsx'
import LabelDemo from '@/views/components/LabelDemo.tsx'
import ToastDemo from '@/views/components/ToastDemo.tsx'
import DialogDemo from '@/views/components/DialogDemo.tsx'
import TabsDemo from '@/views/components/TabsDemo.tsx'
import MenuDemo from '@/views/components/MenuDemo.tsx'
import NavigationDemo from '@/views/components/NavigationDemo.tsx'
import UploadDemo from '@/views/components/UploadDemo.tsx'
import DropdownDemo from '@/views/components/DropdownDemo.tsx'

const componentRoutes: RouteRecordRaw[] = [
  {
    path: '/components',
    component: () => import('@/views/ComponentsDemo.vue'),
    meta: {
      title: {
        en: 'Components',
        zh: '组件'
      }
    },
    children: [
      {
        path: 'button',
        component: ButtonDemo,
        meta: {
          title: {
            en: 'Button',
            zh: '按钮'
          }
        }
      },
      {
        path: 'input',
        component: InputDemo,
        meta: {
          title: {
            en: 'Input',
            zh: '输入框'
          }
        }
      },
      {
        path: 'label',
        component: LabelDemo,
        meta: {
          title: {
            en: 'Label',
            zh: '标签'
          }
        }
      },
      {
        path: 'toast',
        component: ToastDemo,
        meta: {
          title: {
            en: 'Toast',
            zh: '提示'
          }
        }
      },
      {
        path: 'dialog',
        component: DialogDemo,
        meta: {
          title: {
            en: 'Dialog',
            zh: '对话框'
          }
        }
      },
      {
        path: 'tabs',
        component: TabsDemo,
        meta: {
          title: {
            en: 'Tabs',
            zh: '标签页'
          }
        }
      },
      {
        path: 'menu',
        component: MenuDemo,
        meta: {
          title: {
            en: 'Menu',
            zh: '菜单'
          }
        }
      },
      {
        path: 'navigation',
        component: NavigationDemo,
        meta: {
          title: {
            en: 'Navigation',
            zh: '导航'
          }
        }
      },
      {
        path: 'upload',
        component: UploadDemo,
        meta: {
          title: {
            en: 'Upload',
            zh: '上传'
          }
        }
      },
      {
        path: 'dropdown',
        component: DropdownDemo,
        meta: {
          title: {
            en: 'Dropdown',
            zh: '下拉菜单'
          }
        }
      }
    ]
  }
]

export default componentRoutes
