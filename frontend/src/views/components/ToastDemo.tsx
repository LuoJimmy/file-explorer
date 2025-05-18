import { Card, Button, Demo } from '@/components/ui'
import { useToast } from '@/composables/useToast'
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
  const { toast } = useToast()

  const handleBasicToast = () => {
    toast('这是一条提示消息')
  }

  const handleSuccessToast = () => {
    toast.success('操作成功')
  }

  const handleErrorToast = () => {
    toast.error('操作失败')
  }

  const handleWarningToast = () => {
    toast.warning('请注意')
  }

  const handleLoadingToast = () => {
    toast.loading('加载中...')
  }

  return (
    <div class="space-y-4">
      <div class="flex gap-4">
        <Button onClick={handleBasicToast}>基础提示</Button>
        <Button onClick={handleSuccessToast}>成功提示</Button>
        <Button onClick={handleErrorToast}>错误提示</Button>
        <Button onClick={handleWarningToast}>警告提示</Button>
        <Button onClick={handleLoadingToast}>加载提示</Button>
      </div>
    </div>
  )
}

// 自定义配置示例
const CustomDemo = () => {
  const { toast } = useToast()

  const handleCustomToast = () => {
    toast('自定义提示', {
      duration: 5000,
      position: 'top',
      icon: 'ri-information-line',
      class: 'bg-primary text-white'
    })
  }

  return (
    <div class="space-y-4">
      <div class="flex gap-4">
        <Button onClick={handleCustomToast}>自定义提示</Button>
      </div>
    </div>
  )
}

// 主组件
const ToastDemo = () => {
  return (
    <div class="toast-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Toast 提示</h1>
        <p class="text-muted-foreground">用于显示全局的提示信息，支持多种类型和自定义配置。</p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 自定义配置 */}
        <Demo title="自定义配置" code={CustomDemo}>
          <CustomDemo />
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
                      <td class="py-2">message</td>
                      <td class="py-2">提示内容</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">duration</td>
                      <td class="py-2">显示时长（毫秒）</td>
                      <td class="py-2">number</td>
                      <td class="py-2">3000</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">position</td>
                      <td class="py-2">显示位置</td>
                      <td class="py-2">'top' | 'bottom'</td>
                      <td class="py-2">'bottom'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">icon</td>
                      <td class="py-2">自定义图标</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr>
                      <td class="py-2">class</td>
                      <td class="py-2">自定义类名</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </section>

        {/* 方法说明 */}
        <section>
          <h2 class="text-xl font-semibold mb-4">方法说明</h2>
          <Card class="p-4">
            <div class="space-y-4">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2">方法名</th>
                      <th class="text-left py-2">说明</th>
                      <th class="text-left py-2">参数</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2">toast</td>
                      <td class="py-2">显示基础提示</td>
                      <td class="py-2">(message: string, options?: ToastOptions) =&gt; void</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">toast.success</td>
                      <td class="py-2">显示成功提示</td>
                      <td class="py-2">(message: string, options?: ToastOptions) =&gt; void</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">toast.error</td>
                      <td class="py-2">显示错误提示</td>
                      <td class="py-2">(message: string, options?: ToastOptions) =&gt; void</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">toast.warning</td>
                      <td class="py-2">显示警告提示</td>
                      <td class="py-2">(message: string, options?: ToastOptions) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">toast.loading</td>
                      <td class="py-2">显示加载提示</td>
                      <td class="py-2">(message: string, options?: ToastOptions) =&gt; void</td>
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
                  <li>操作成功/失败的反馈</li>
                  <li>系统通知</li>
                  <li>加载状态提示</li>
                  <li>警告信息展示</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>提示信息要简洁明了</li>
                  <li>不同类型使用不同样式</li>
                  <li>合理控制显示时长</li>
                  <li>避免频繁弹出提示</li>
                </ul>

                <h3>性能优化</h3>
                <ul>
                  <li>控制同时显示的提示数量</li>
                  <li>及时清理已关闭的提示</li>
                  <li>避免重复显示相同提示</li>
                  <li>优化动画性能</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default ToastDemo
