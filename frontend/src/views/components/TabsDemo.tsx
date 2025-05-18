import { ref } from 'vue'
import { Card, Demo, Tabs, TabPane } from '@/components/ui'

// 基础用法示例
const BasicDemo = () => {
  const activeTab = ref('1')

  return (
    <div class="space-y-4">
      <Tabs v-model={activeTab.value} type="line">
        <TabPane name="1" label="标签页 1">
          <div class="p-4">标签页 1 的内容</div>
        </TabPane>
        <TabPane name="2" label="标签页 2">
          <div class="p-4">标签页 2 的内容</div>
        </TabPane>
        <TabPane name="3" label="标签页 3">
          <div class="p-4">标签页 3 的内容</div>
        </TabPane>
      </Tabs>
    </div>
  )
}

// 卡片样式示例
const CardDemo = () => {
  const activeTab = ref('1')

  return (
    <div class="space-y-4">
      <Tabs v-model={activeTab.value} type="card">
        <TabPane name="1" label="标签页 1">
          <div class="p-4">标签页 1 的内容</div>
        </TabPane>
        <TabPane name="2" label="标签页 2">
          <div class="p-4">标签页 2 的内容</div>
        </TabPane>
        <TabPane name="3" label="标签页 3">
          <div class="p-4">标签页 3 的内容</div>
        </TabPane>
      </Tabs>
    </div>
  )
}

// 可关闭标签示例
const ClosableDemo = () => {
  const activeTab = ref('1')
  const closableTabs = ref([
    { value: '1', label: '标签页 1' },
    { value: '2', label: '标签页 2' },
    { value: '3', label: '标签页 3' }
  ])

  const handleClose = (name: string) => {
    const index = closableTabs.value.findIndex((tab) => tab.value === name)
    if (index !== -1) {
      closableTabs.value.splice(index, 1)
      if (activeTab.value === name && closableTabs.value.length > 0) {
        activeTab.value = closableTabs.value[0].value
      }
    }
  }

  return (
    <div class="space-y-4">
      <Tabs v-model={activeTab.value} closable onClose={handleClose}>
        {closableTabs.value.map((tab: { value: string; label: string }) => (
          <TabPane key={tab.value} name={tab.value} label={tab.label} closable>
            <div class="p-4">标签页 {tab.value} 的内容</div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

// 主组件
const TabsDemo = () => {
  return (
    <div class="tabs-demo">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Tabs 标签页</h1>
        <p class="text-muted-foreground">
          标签页用于将内容分组，用户可以通过点击标签切换不同的内容区域。
        </p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 不同样式 */}
        <Demo title="不同样式" code={CardDemo}>
          <CardDemo />
        </Demo>

        {/* 可关闭的标签 */}
        <Demo title="可关闭的标签" code={ClosableDemo}>
          <ClosableDemo />
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
                      <td class="py-2">当前激活的标签</td>
                      <td class="py-2">string | number</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">type</td>
                      <td class="py-2">标签页样式（line/card）</td>
                      <td class="py-2">'line' | 'card'</td>
                      <td class="py-2">'line'</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">closable</td>
                      <td class="py-2">是否显示关闭按钮</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">animated</td>
                      <td class="py-2">是否使用动画切换</td>
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
                      <td class="py-2">change</td>
                      <td class="py-2">标签切换时触发</td>
                      <td class="py-2">(name: string) =&gt; void</td>
                    </tr>
                    <tr>
                      <td class="py-2">close</td>
                      <td class="py-2">关闭标签时触发</td>
                      <td class="py-2">(name: string) =&gt; void</td>
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
                <h3>标签页使用</h3>
                <ul>
                  <li>标签数量控制在 3-5 个以内</li>
                  <li>标签文字要简洁明了</li>
                  <li>标签内容要相对独立</li>
                  <li>避免在标签内嵌套标签</li>
                </ul>

                <h3>样式选择</h3>
                <ul>
                  <li>默认样式适用于大多数场景</li>
                  <li>卡片样式适用于内容分组</li>
                  <li>保持标签样式的一致性</li>
                  <li>注意标签与内容的视觉平衡</li>
                </ul>

                <h3>交互设计</h3>
                <ul>
                  <li>提供清晰的激活状态</li>
                  <li>支持键盘导航</li>
                  <li>可关闭标签要谨慎使用</li>
                  <li>动画效果要适度</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default TabsDemo
