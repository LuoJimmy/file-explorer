import { Button, Card, Dropdown, DropdownItem, Demo } from '@/components/ui'
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
  return (
    <div class="flex gap-4">
      <Dropdown>
        <Button>下拉菜单</Button>
        {{
          content: () => (
            <Fragment>
              <DropdownItem>选项一</DropdownItem>
              <DropdownItem>选项二</DropdownItem>
              <DropdownItem>选项三</DropdownItem>
            </Fragment>
          )
        }}
      </Dropdown>
    </div>
  )
}

// 带图标的菜单示例
const IconDemo = () => {
  return (
    <div class="flex gap-4">
      <Dropdown>
        <Button>
          {{
            icon: () => <i class="ri-more-2-fill" />,
            default: () => '更多操作'
          }}
        </Button>
        {{
          content: () => (
            <Fragment>
              <DropdownItem>
                {{
                  icon: () => <i class="ri-edit-line" />,
                  default: () => '编辑'
                }}
              </DropdownItem>
              <DropdownItem>
                {{
                  icon: () => <i class="ri-delete-bin-line" />,
                  default: () => '删除'
                }}
              </DropdownItem>
            </Fragment>
          )
        }}
      </Dropdown>
    </div>
  )
}

// 禁用选项示例
const DisabledDemo = () => {
  return (
    <div class="flex gap-4">
      <Dropdown>
        <Button>禁用选项</Button>
        {{
          content: () => (
            <Fragment>
              <DropdownItem>选项一</DropdownItem>
              <DropdownItem disabled>禁用选项</DropdownItem>
              <DropdownItem>选项三</DropdownItem>
            </Fragment>
          )
        }}
      </Dropdown>
    </div>
  )
}

// 主组件
const DropdownDemo = () => {
  return (
    <div class="dropdown-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Dropdown 下拉菜单</h1>
        <p class="text-muted-foreground">下拉菜单用于显示一组相关的操作，通常通过点击触发。</p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 带图标的菜单 */}
        <Demo title="带图标的菜单" code={IconDemo}>
          <IconDemo />
        </Demo>

        {/* 禁用选项 */}
        <Demo title="禁用选项" code={DisabledDemo}>
          <DisabledDemo />
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
                      <td class="py-2">trigger</td>
                      <td class="py-2">触发方式</td>
                      <td class="py-2">'click' | 'hover'</td>
                      <td class="py-2">'click'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">placement</td>
                      <td class="py-2">弹出位置</td>
                      <td class="py-2">'top' | 'bottom' | 'left' | 'right'</td>
                      <td class="py-2">'bottom'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">disabled</td>
                      <td class="py-2">是否禁用</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr>
                      <td class="py-2">delay</td>
                      <td class="py-2">hover 触发时的延迟时间</td>
                      <td class="py-2">number</td>
                      <td class="py-2">0</td>
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
                      <td class="py-2">visible-change</td>
                      <td class="py-2">下拉菜单显示状态改变时触发</td>
                      <td class="py-2">(visible: boolean) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">select</td>
                      <td class="py-2">选择菜单项时触发</td>
                      <td class="py-2">(value: string | number) =&gt; void</td>
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
                      <td class="py-2">default</td>
                      <td class="py-2">触发下拉菜单的元素</td>
                    </tr>
                    <tr>
                      <td class="py-2">content</td>
                      <td class="py-2">下拉菜单的内容</td>
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
                <h3>使用场景</h3>
                <ul>
                  <li>操作按钮过多时</li>
                  <li>需要展示更多选项时</li>
                  <li>需要分组展示操作时</li>
                  <li>需要展示二级菜单时</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>触发方式要符合用户习惯</li>
                  <li>菜单项要分类清晰</li>
                  <li>图标要直观易懂</li>
                  <li>禁用状态要明确</li>
                </ul>

                <h3>性能优化</h3>
                <ul>
                  <li>避免菜单项过多</li>
                  <li>合理使用延迟加载</li>
                  <li>注意内存管理</li>
                  <li>及时销毁不需要的菜单</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default DropdownDemo
