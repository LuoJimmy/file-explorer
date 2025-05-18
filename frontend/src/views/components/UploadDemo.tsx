import { ref } from 'vue'
import { Upload, Card, Toast, Demo } from '@/components/ui'
import type { JSX } from 'vue/jsx-runtime'

// 声明 JSX 命名空间
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

interface FileItem {
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

// 基础用法示例
const BasicDemo = () => {
  const uploadFiles = ref<FileItem[]>([])

  const handleUploadSuccess = (file: FileItem) => {
    Toast.success(`${file.name} 上传成功`)
  }

  const handleUploadError = (file: FileItem) => {
    Toast.error(file.error || '上传失败')
  }

  return (
    <div class="space-y-4">
      <Upload
        modelValue={uploadFiles.value}
        onUpdateModelValue={(val: FileItem[]) => (uploadFiles.value = val)}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />
    </div>
  )
}

// 拖拽上传示例
const DragDemo = () => {
  const uploadFiles = ref<FileItem[]>([])

  const handleUploadSuccess = (file: FileItem) => {
    Toast.success(`${file.name} 上传成功`)
  }

  const handleUploadError = (file: FileItem) => {
    Toast.error(file.error || '上传失败')
  }

  return (
    <div class="space-y-4">
      <Upload
        modelValue={uploadFiles.value}
        onUpdateModelValue={(val: FileItem[]) => (uploadFiles.value = val)}
        drag
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />
    </div>
  )
}

// 主组件
const UploadDemo = () => {
  return (
    <div class="upload-demo max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Upload 上传</h1>
        <p class="text-muted-foreground">用于上传文件，支持单文件和多文件上传，支持拖拽上传。</p>
      </div>

      <div class="space-y-8">
        {/* 基础用法 */}
        <Demo title="基础用法" code={BasicDemo}>
          <BasicDemo />
        </Demo>

        {/* 拖拽上传 */}
        <Demo title="拖拽上传" code={DragDemo}>
          <DragDemo />
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
                      <td class="py-2">modelValue</td>
                      <td class="py-2">上传文件列表</td>
                      <td class="py-2">FileItem[]</td>
                      <td class="py-2">[]</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">drag</td>
                      <td class="py-2">是否启用拖拽上传</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">multiple</td>
                      <td class="py-2">是否支持多文件上传</td>
                      <td class="py-2">boolean</td>
                      <td class="py-2">false</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2">accept</td>
                      <td class="py-2">接受上传的文件类型</td>
                      <td class="py-2">string</td>
                      <td class="py-2">-</td>
                    </tr>
                    <tr>
                      <td class="py-2">maxSize</td>
                      <td class="py-2">文件大小限制（字节）</td>
                      <td class="py-2">number</td>
                      <td class="py-2">-</td>
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

export default UploadDemo
