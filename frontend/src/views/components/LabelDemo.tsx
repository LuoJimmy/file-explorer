import { Label, Card, Demo } from '@/components/ui'
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
    <div class="flex flex-col gap-4">
      <div>
        <Label>默认标签</Label>
        <p class="text-sm text-muted-foreground mt-1">这是一个默认样式的标签</p>
      </div>
      <div>
        <Label variant="secondary">次要标签</Label>
        <p class="text-sm text-muted-foreground mt-1">这是一个次要样式的标签</p>
      </div>
      <div>
        <Label variant="destructive">危险标签</Label>
        <p class="text-sm text-muted-foreground mt-1">这是一个危险样式的标签</p>
      </div>
    </div>
  )
}

// 不同尺寸示例
const SizeDemo = () => {
  return (
    <div class="flex flex-col gap-4">
      <div>
        <Label size="sm">小型标签</Label>
        <p class="text-xs text-muted-foreground mt-1">这是一个小型标签</p>
      </div>
      <div>
        <Label>默认尺寸</Label>
        <p class="text-sm text-muted-foreground mt-1">这是一个默认尺寸的标签</p>
      </div>
      <div>
        <Label size="lg">大型标签</Label>
        <p class="text-base text-muted-foreground mt-1">这是一个大型标签</p>
      </div>
    </div>
  )
}

// 必填标记示例
const RequiredDemo = () => {
  return (
    <div class="flex flex-col gap-4">
      <div>
        <Label required>必填项</Label>
        <p class="text-sm text-muted-foreground mt-1">这是一个带有必填标记的标签</p>
      </div>
    </div>
  )
}

// 主组件
const LabelDemo = () => {
  return (
    <div class="label-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Label 标签</h1>
        <p class="text-muted-foreground">标签用于为表单控件提供说明文本，帮助用户理解输入内容。</p>
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

        {/* 必填标记 */}
        <Demo title="必填标记" code={RequiredDemo}>
          <RequiredDemo />
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
                      <td class="py-2">标签样式</td>
                      <td class="py-2">'default' | 'secondary' | 'destructive'</td>
                      <td class="py-2">'default'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">size</td>
                      <td class="py-2">标签尺寸</td>
                      <td class="py-2">'sm' | 'default' | 'lg'</td>
                      <td class="py-2">'default'</td>
                    </tr>
                    <tr>
                      <td class="py-2">required</td>
                      <td class="py-2">是否显示必填标记</td>
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
                      <td class="py-2">点击标签时触发</td>
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
                    <tr>
                      <td class="py-2">default</td>
                      <td class="py-2">标签内容</td>
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
                <h3>标签使用</h3>
                <ul>
                  <li>为每个表单控件提供清晰的标签</li>
                  <li>必填项使用 required 属性标记</li>
                  <li>使用合适的标签样式区分重要性</li>
                  <li>标签文字要简洁明了</li>
                </ul>

                <h3>标签样式</h3>
                <ul>
                  <li>默认样式用于普通标签</li>
                  <li>次要样式用于可选标签</li>
                  <li>危险样式用于警告标签</li>
                  <li>根据内容长度选择合适的尺寸</li>
                </ul>

                <h3>可访问性</h3>
                <ul>
                  <li>使用 for 属性关联表单控件</li>
                  <li>确保标签文字清晰可读</li>
                  <li>提供足够的颜色对比度</li>
                  <li>支持键盘导航</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default LabelDemo
