import { ref } from 'vue'
import { Card, Input, Demo } from '@/components/ui'
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
  const inputValue = ref('')

  return (
    <div class="space-y-4">
      <div class="flex gap-4">
        <Input
          modelValue={inputValue.value}
          onUpdateModelValue={(val: string) => (inputValue.value = val)}
          placeholder="请输入内容"
        />
      </div>
    </div>
  )
}

// 不同尺寸示例
const SizeDemo = () => {
  return (
    <div class="space-y-4">
      <div class="flex flex-col gap-4">
        <Input size="sm" placeholder="小型输入框" />
        <Input placeholder="默认尺寸" />
        <Input size="lg" placeholder="大型输入框" />
      </div>
    </div>
  )
}

// 不同状态示例
const StateDemo = () => {
  return (
    <div class="space-y-4">
      <div class="flex flex-col gap-4">
        <Input placeholder="默认状态" />
        <Input disabled placeholder="禁用状态" />
        <Input readonly placeholder="只读状态" />
        <Input error placeholder="错误状态" />
      </div>
    </div>
  )
}

// 带图标示例
const IconDemo = () => {
  return (
    <div class="space-y-4">
      <div class="flex flex-col gap-4">
        <Input prefix="ri-search-line" placeholder="带前缀图标的输入框" />
        <Input suffix="ri-eye-line" placeholder="带后缀图标的输入框" />
        <Input
          prefix="ri-user-line"
          suffix="ri-close-circle-line"
          placeholder="带前后缀图标的输入框"
        />
      </div>
    </div>
  )
}

// 主组件
const InputDemo = () => {
  return (
    <div class="input-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Input 输入框</h1>
        <p class="text-muted-foreground">用于接收用户输入的文本内容，支持多种类型和状态。</p>
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

        {/* 不同状态 */}
        <Demo title="不同状态" code={StateDemo}>
          <StateDemo />
        </Demo>

        {/* 带图标 */}
        <Demo title="带图标" code={IconDemo}>
          <IconDemo />
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
                      <td class="py-2">输入框的值</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">type</td>
                      <td class="py-2">输入框类型</td>
                      <td class="py-2">'text' | 'password' | 'number' | 'email' | 'tel' | 'url'</td>
                      <td class="py-2">'text'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">placeholder</td>
                      <td class="py-2">输入框占位文本</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">disabled</td>
                      <td class="py-2">是否禁用</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">readonly</td>
                      <td class="py-2">是否只读</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">clearable</td>
                      <td class="py-2">是否可清空</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">showPassword</td>
                      <td class="py-2">是否显示密码切换按钮</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">prefix</td>
                      <td class="py-2">前缀图标</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">suffix</td>
                      <td class="py-2">后缀图标</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">size</td>
                      <td class="py-2">输入框尺寸</td>
                      <td class="py-2">'sm' | 'default' | 'lg'</td>
                      <td class="py-2">'default'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">block</td>
                      <td class="py-2">是否块级元素</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr>
                      <td class="py-2">error</td>
                      <td class="py-2">是否显示错误状态</td>
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
                      <td class="py-2">update:modelValue</td>
                      <td class="py-2">输入值改变时触发</td>
                      <td class="py-2">(value: string) =&gt; void</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">clear</td>
                      <td class="py-2">点击清空按钮时触发</td>
                      <td class="py-2">() =&gt; void</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">focus</td>
                      <td class="py-2">输入框获得焦点时触发</td>
                      <td class="py-2">(event: FocusEvent) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">blur</td>
                      <td class="py-2">输入框失去焦点时触发</td>
                      <td class="py-2">(event: FocusEvent) =&gt; void</td>
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
                      <td class="py-2">prefix</td>
                      <td class="py-2">输入框前缀内容</td>
                    </tr>
                    <tr>
                      <td class="py-2">suffix</td>
                      <td class="py-2">输入框后缀内容</td>
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
                <h3>输入框使用</h3>
                <ul>
                  <li>为输入框提供清晰的标签</li>
                  <li>使用合适的占位文本</li>
                  <li>根据输入内容类型选择合适的输入框类型</li>
                  <li>提供必要的输入验证和反馈</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>提供即时的输入反馈</li>
                  <li>使用图标增强可读性</li>
                  <li>合理使用禁用和只读状态</li>
                  <li>提供清空和密码切换功能</li>
                </ul>

                <h3>可访问性</h3>
                <ul>
                  <li>为输入框提供合适的标签</li>
                  <li>确保键盘可访问性</li>
                  <li>提供清晰的错误提示</li>
                  <li>支持屏幕阅读器</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default InputDemo
