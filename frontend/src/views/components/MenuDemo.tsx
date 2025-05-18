import { ref } from 'vue'
import { Card, Menu, MenuItem, SubMenu, Demo } from '@/components/ui'
import type { JSX } from 'vue/jsx-runtime'
import { Fragment } from 'vue'

// 声明 JSX 命名空间
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

// 基础用法示例
const BasicDemo = () => {
  const activeMenu = ref('1')

  return (
    <div class="flex gap-8">
      <Menu
        modelValue={activeMenu.value}
        onUpdateModelValue={(val: string) => (activeMenu.value = val)}
        class="w-64"
      >
        <MenuItem name="1">
          {{
            icon: () => <i class="ri-home-line" />,
            default: () => '首页'
          }}
        </MenuItem>
        <MenuItem name="2">
          {{
            icon: () => <i class="ri-user-line" />,
            default: () => '用户'
          }}
        </MenuItem>
        <MenuItem name="3">
          {{
            icon: () => <i class="ri-settings-line" />,
            default: () => '设置'
          }}
        </MenuItem>
      </Menu>
    </div>
  )
}

// 子菜单示例
const SubmenuDemo = () => {
  const activeMenu2 = ref('1')

  return (
    <div class="flex gap-8">
      <Menu
        modelValue={activeMenu2.value}
        onUpdateModelValue={(val: string) => (activeMenu2.value = val)}
        class="w-64"
      >
        <MenuItem name="1">
          {{
            icon: () => <i class="ri-home-line" />,
            default: () => '首页'
          }}
        </MenuItem>
        <SubMenu name="2" title="系统管理">
          {{
            icon: () => <i class="ri-settings-line" />,
            default: () => (
              <Fragment>
                <MenuItem name="2-1">用户管理</MenuItem>
                <MenuItem name="2-2">角色管理</MenuItem>
                <MenuItem name="2-3">权限管理</MenuItem>
              </Fragment>
            )
          }}
        </SubMenu>
        <SubMenu name="3" title="内容管理">
          {{
            icon: () => <i class="ri-file-list-line" />,
            default: () => (
              <Fragment>
                <MenuItem name="3-1">文章管理</MenuItem>
                <MenuItem name="3-2">分类管理</MenuItem>
                <MenuItem name="3-3">标签管理</MenuItem>
              </Fragment>
            )
          }}
        </SubMenu>
      </Menu>
    </div>
  )
}

// 主组件
const MenuDemo = () => {
  return (
    <div class="menu-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Menu 菜单</h1>
        <p class="text-muted-foreground">菜单组件用于导航，可以包含子菜单，支持图标和分组。</p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 子菜单 */}
        <Demo title="子菜单" code={SubmenuDemo}>
          <SubmenuDemo />
        </Demo>

        {/* 属性说明 */}
        <section>
          <h2 class="text-xl font-semibold mb-4">属性说明</h2>
          <Card class="p-4">
            <div class="space-y-4">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2">属性名</th>
                      <th class="text-left py-2">说明</th>
                      <th class="text-left py-2">类型</th>
                      <th class="text-left py-2">默认值</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2">v-model</td>
                      <td class="py-2">当前激活的菜单项</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">mode</td>
                      <td class="py-2">菜单模式</td>
                      <td class="py-2">'vertical' | 'horizontal'</td>
                      <td class="py-2">'vertical'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">collapse</td>
                      <td class="py-2">是否折叠菜单</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr>
                      <td class="py-2">theme</td>
                      <td class="py-2">菜单主题</td>
                      <td class="py-2">'light' | 'dark'</td>
                      <td class="py-2">'light'</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </section>

        {/* 事件说明 */}
        <section>
          <h2 class="text-xl font-semibold mb-4">事件说明</h2>
          <Card class="p-4">
            <div class="space-y-4">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2">事件名</th>
                      <th class="text-left py-2">说明</th>
                      <th class="text-left py-2">回调参数</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2">select</td>
                      <td class="py-2">选中菜单项时触发</td>
                      <td class="py-2">(name: string) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">open-change</td>
                      <td class="py-2">子菜单展开/收起时触发</td>
                      <td class="py-2">(name: string, opened: boolean) =&gt; void</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </section>

        {/* 插槽说明 */}
        <section>
          <h2 class="text-xl font-semibold mb-4">插槽说明</h2>
          <Card class="p-4">
            <div class="space-y-4">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2">插槽名</th>
                      <th class="text-left py-2">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2">icon</td>
                      <td class="py-2">菜单项图标</td>
                    </tr>
                    <tr>
                      <td class="py-2">title</td>
                      <td class="py-2">子菜单标题</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </section>

        {/* 最佳实践 */}
        <section>
          <h2 class="text-xl font-semibold mb-4">最佳实践</h2>
          <Card class="p-4">
            <div class="space-y-4">
              <div class="prose">
                <h3>菜单结构</h3>
                <ul>
                  <li>保持菜单层级清晰</li>
                  <li>避免过深的嵌套</li>
                  <li>合理使用图标</li>
                  <li>保持命名简洁明了</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>提供清晰的视觉反馈</li>
                  <li>保持一致的交互模式</li>
                  <li>合理使用动画效果</li>
                  <li>注意移动端适配</li>
                </ul>

                <h3>性能优化</h3>
                <ul>
                  <li>避免过多的菜单项</li>
                  <li>合理使用懒加载</li>
                  <li>注意内存管理</li>
                  <li>优化渲染性能</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default MenuDemo
