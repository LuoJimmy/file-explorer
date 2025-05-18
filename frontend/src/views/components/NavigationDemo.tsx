import { ref } from 'vue'
import { Card, Navigation, Demo } from '@/components/ui'

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
      <Navigation>
        <Navigation.Item>
          {{
            icon: () => <i class="ri-home-line" />,
            default: () => '首页'
          }}
        </Navigation.Item>
        <Navigation.Item>
          {{
            icon: () => <i class="ri-file-list-line" />,
            default: () => '文件'
          }}
        </Navigation.Item>
        <Navigation.Item>
          {{
            icon: () => <i class="ri-settings-line" />,
            default: () => '设置'
          }}
        </Navigation.Item>
      </Navigation>
    </div>
  )
}

// 激活状态示例
const ActiveDemo = () => {
  const activeItem = ref('home')

  return (
    <div class="flex gap-4">
      <Navigation
        modelValue={activeItem.value}
        onUpdateModelValue={(val: string) => (activeItem.value = val)}
      >
        <Navigation.Item value="home">
          {{
            icon: () => <i class="ri-home-line" />,
            default: () => '首页'
          }}
        </Navigation.Item>
        <Navigation.Item value="files">
          {{
            icon: () => <i class="ri-file-list-line" />,
            default: () => '文件'
          }}
        </Navigation.Item>
        <Navigation.Item value="settings">
          {{
            icon: () => <i class="ri-settings-line" />,
            default: () => '设置'
          }}
        </Navigation.Item>
      </Navigation>
    </div>
  )
}

// 禁用状态示例
const DisabledDemo = () => {
  return (
    <div class="flex gap-4">
      <Navigation>
        <Navigation.Item>
          {{
            icon: () => <i class="ri-home-line" />,
            default: () => '首页'
          }}
        </Navigation.Item>
        <Navigation.Item disabled>
          {{
            icon: () => <i class="ri-file-list-line" />,
            default: () => '文件'
          }}
        </Navigation.Item>
        <Navigation.Item>
          {{
            icon: () => <i class="ri-settings-line" />,
            default: () => '设置'
          }}
        </Navigation.Item>
      </Navigation>
    </div>
  )
}

// 主组件
const NavigationDemo = () => {
  return (
    <div class="navigation-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Navigation 导航</h1>
        <p class="text-muted-foreground">
          用于页面导航的组件，支持图标、激活状态、禁用状态等功能。
        </p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 激活状态 */}
        <Demo title="激活状态" code={ActiveDemo}>
          <ActiveDemo />
        </Demo>

        {/* 禁用状态 */}
        <Demo title="禁用状态" code={DisabledDemo}>
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
                      <td class="py-2">v-model</td>
                      <td class="py-2">当前激活的导航项</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">mode</td>
                      <td class="py-2">导航模式</td>
                      <td class="py-2">'horizontal' | 'vertical'</td>
                      <td class="py-2">'horizontal'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">theme</td>
                      <td class="py-2">主题</td>
                      <td class="py-2">'light' | 'dark'</td>
                      <td class="py-2">'light'</td>
                    </tr>
                    <tr>
                      <td class="py-2">disabled</td>
                      <td class="py-2">是否禁用</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
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
                      <td class="py-2">选择导航项时触发</td>
                      <td class="py-2">(value: string) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">change</td>
                      <td class="py-2">激活项改变时触发</td>
                      <td class="py-2">(value: string) =&gt; void</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default NavigationDemo
