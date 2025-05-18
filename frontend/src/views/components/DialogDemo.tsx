import { ref } from 'vue'
import { Button, Card, Dialog, Demo } from '@/components/ui'
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
  const showBasicDialog = ref(false)

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <Button onClick={() => (showBasicDialog.value = true)}>基础对话框</Button>
      </div>
      <Dialog v-model={showBasicDialog.value} title="基础对话框">
        <div class="p-4">这是一个基础对话框示例，用于显示简单的提示信息。</div>
        {{
          footer: () => (
            <div class="flex justify-end gap-2">
              <Button variant="default" onClick={() => (showBasicDialog.value = false)}>
                确定
              </Button>
            </div>
          )
        }}
      </Dialog>
    </div>
  )
}

// 确认对话框示例
const ConfirmDemo = () => {
  const showConfirmDialog = ref(false)

  return (
    <div class="space-y-4">
      <p class="text-muted-foreground">
        用于需要用户确认的重要操作，通常包含"确定"和"取消"两个按钮。
      </p>
      <div class="flex flex-wrap gap-2">
        <Button onClick={() => (showConfirmDialog.value = true)}>确认对话框</Button>
      </div>
      <Dialog v-model={showConfirmDialog.value} title="确认对话框" width="400px">
        <div class="p-4">确定要执行此操作吗？此操作不可撤销。</div>
        {{
          footer: () => (
            <div class="flex justify-end gap-2">
              <Button variant="default" onClick={() => (showConfirmDialog.value = false)}>
                取消
              </Button>
              <Button variant="destructive" onClick={() => (showConfirmDialog.value = false)}>
                确定
              </Button>
            </div>
          )
        }}
      </Dialog>
    </div>
  )
}

// 自定义对话框示例
const CustomDemo = () => {
  const showCustomDialog = ref(false)

  return (
    <div class="space-y-4">
      <p class="text-muted-foreground">可以包含更复杂的内容，如表单、列表等。</p>
      <div class="flex flex-wrap gap-2">
        <Button onClick={() => (showCustomDialog.value = true)}>自定义对话框</Button>
      </div>
      <Dialog v-model={showCustomDialog.value} title="自定义对话框" width="600px">
        <div class="p-4">
          <div class="space-y-4">
            <p>这是一个自定义对话框示例，可以包含更复杂的内容。</p>
            <div class="bg-muted p-4 rounded-md">
              <p class="text-sm">这里可以放置表单、列表或其他自定义内容。</p>
            </div>
          </div>
        </div>
        {{
          footer: () => (
            <div class="flex justify-end gap-2">
              <Button variant="outline" onClick={() => (showCustomDialog.value = false)}>
                取消
              </Button>
              <Button variant="default" onClick={() => (showCustomDialog.value = false)}>
                确定
              </Button>
            </div>
          )
        }}
      </Dialog>
    </div>
  )
}

// 动画效果示例
const AnimatedDemo = () => {
  const showAnimatedDialog = ref(false)

  return (
    <div class="space-y-4">
      <p class="text-muted-foreground">通过 animated 属性可以启用对话框的动画效果。</p>
      <div class="flex flex-wrap gap-2">
        <Button onClick={() => (showAnimatedDialog.value = true)}>带动画的对话框</Button>
      </div>
      <Dialog v-model={showAnimatedDialog.value} title="带动画的对话框" animated={true}>
        <div class="p-4">这是一个带动画效果的对话框示例。</div>
        {{
          footer: () => (
            <div class="flex justify-end gap-2">
              <Button variant="default" onClick={() => (showAnimatedDialog.value = false)}>
                确定
              </Button>
            </div>
          )
        }}
      </Dialog>
    </div>
  )
}

// 主组件
const DialogDemo = () => {
  return (
    <div class="dialog-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Dialog 对话框</h1>
        <p class="text-muted-foreground">用于显示重要的提示信息或需要用户确认的操作。</p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 确认对话框 */}
        <Demo title="确认对话框" code={ConfirmDemo}>
          <ConfirmDemo />
        </Demo>

        {/* 自定义对话框 */}
        <Demo title="自定义对话框" code={CustomDemo}>
          <CustomDemo />
        </Demo>

        {/* 动画效果 */}
        <Demo title="动画效果" code={AnimatedDemo}>
          <AnimatedDemo />
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
                      <td class="py-2">是否显示对话框</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">title</td>
                      <td class="py-2">对话框标题</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">width</td>
                      <td class="py-2">对话框宽度</td>
                      <td class="py-2">string</td>
                      <td class="py-2">'500px'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">animated</td>
                      <td class="py-2">是否启用动画</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">true</td>
                    </tr>
                    <tr>
                      <td class="py-2">closeOnClickOutside</td>
                      <td class="py-2">点击遮罩层是否关闭</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">true</td>
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
                      <td class="py-2">update:modelValue</td>
                      <td class="py-2">对话框显示状态改变时触发</td>
                      <td class="py-2">(value: boolean) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">close</td>
                      <td class="py-2">对话框关闭时触发</td>
                      <td class="py-2">() =&gt; void</td>
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
                      <td class="py-2">对话框内容</td>
                    </tr>
                    <tr>
                      <td class="py-2">footer</td>
                      <td class="py-2">对话框底部内容</td>
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
                  <li>需要用户确认的重要操作</li>
                  <li>显示重要的提示信息</li>
                  <li>需要用户输入或选择的场景</li>
                  <li>展示复杂的内容或表单</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>提供清晰的标题和内容</li>
                  <li>按钮文字要明确表达操作含义</li>
                  <li>合理使用动画效果</li>
                  <li>支持键盘操作和关闭</li>
                </ul>

                <h3>内容组织</h3>
                <ul>
                  <li>内容要简洁明了</li>
                  <li>避免在对话框中嵌套对话框</li>
                  <li>合理使用滚动条</li>
                  <li>保持对话框大小适中</li>
                </ul>

                <h3>可访问性</h3>
                <ul>
                  <li>提供合适的标题和描述</li>
                  <li>支持键盘导航</li>
                  <li>确保焦点管理正确</li>
                  <li>提供适当的 ARIA 属性</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default DialogDemo
