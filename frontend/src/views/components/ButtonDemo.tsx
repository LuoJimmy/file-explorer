import { Button, Card, Demo } from '@/components/ui'
import type { JSX } from 'vue/jsx-runtime'

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
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4">
        <Button>默认按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="destructive">危险按钮</Button>
      </div>
    </div>
  )
}

// 不同尺寸示例
const SizeDemo = () => {
  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">小型按钮</Button>
        <Button>默认尺寸</Button>
        <Button size="lg">大型按钮</Button>
      </div>
    </div>
  )
}

// 带图标的按钮示例
const IconDemo = () => {
  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4">
        <Button>
          {{
            icon: () => <i class="i-heroicons-plus" />,
            default: () => '带图标的按钮'
          }}
        </Button>
      </div>
    </div>
  )
}

// 加载状态示例
const LoadingDemo = () => {
  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4">
        <Button loading>加载中</Button>
      </div>
    </div>
  )
}

// 主组件
const ButtonDemo = () => {
  return (
    <div class="button-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Button 按钮</h1>
        <p class="text-muted-foreground">用于触发操作或事件，支持多种样式和状态。</p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 不同尺寸 */}
        <Demo title="不同尺寸" code={SizeDemo}>
          <SizeDemo />
        </Demo>

        {/* 带图标的按钮 */}
        <Demo title="带图标的按钮" code={IconDemo}>
          <IconDemo />
        </Demo>

        {/* 加载状态 */}
        <Demo title="加载状态" code={LoadingDemo}>
          <LoadingDemo />
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
                      <td class="py-2">variant</td>
                      <td class="py-2">按钮样式</td>
                      <td class="py-2">'default' | 'secondary' | 'destructive'</td>
                      <td class="py-2">'default'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">size</td>
                      <td class="py-2">按钮尺寸</td>
                      <td class="py-2">'sm' | 'default' | 'lg'</td>
                      <td class="py-2">'default'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">loading</td>
                      <td class="py-2">是否显示加载状态</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
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
                    <tr>
                      <td class="py-2">click</td>
                      <td class="py-2">点击按钮时触发</td>
                      <td class="py-2">(event: MouseEvent) =&gt; void</td>
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
                      <td class="py-2">按钮内容</td>
                    </tr>
                    <tr>
                      <td class="py-2">icon</td>
                      <td class="py-2">按钮图标</td>
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
                <h3>按钮类型选择</h3>
                <ul>
                  <li>主要操作使用默认样式</li>
                  <li>次要操作使用次要样式</li>
                  <li>危险操作使用危险样式</li>
                  <li>禁用状态要明确提示原因</li>
                </ul>

                <h3>按钮尺寸</h3>
                <ul>
                  <li>小型按钮用于紧凑布局</li>
                  <li>默认尺寸用于常规场景</li>
                  <li>大型按钮用于重要操作</li>
                  <li>保持同一区域按钮尺寸一致</li>
                </ul>

                <h3>图标使用</h3>
                <ul>
                  <li>使用图标增强按钮可识别性</li>
                  <li>图标要与按钮文字含义一致</li>
                  <li>保持图标大小与文字协调</li>
                  <li>避免过度使用图标</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>提供清晰的点击反馈</li>
                  <li>合理使用加载状态</li>
                  <li>保持按钮状态的一致性</li>
                  <li>考虑键盘可访问性</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default ButtonDemo
