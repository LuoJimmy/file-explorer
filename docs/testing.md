# 测试文档

## 测试类型

### 1. 单元测试

使用 Vitest 进行单元测试，主要测试工具函数和业务逻辑。

#### 运行单元测试
```bash
# 运行所有测试
npm test

# 运行特定文件的测试
npm test -- src/utils/__tests__/xss.test.ts

# 生成测试覆盖率报告
npm run test:coverage
```

#### 测试文件结构
```
src/
├── utils/
│   └── __tests__/
│       ├── xss.test.ts
│       ├── csrf.test.ts
│       ├── crypto.test.ts
│       ├── validator.test.ts
│       └── permission.test.ts
└── components/
    └── __tests__/
        └── SecurityDemo.test.ts
```

### 2. 组件测试

使用 Vue Test Utils 和 Vitest 进行组件测试。

#### 运行组件测试
```bash
# 运行所有组件测试
npm test -- src/components/__tests__/

# 运行特定组件的测试
npm test -- src/components/__tests__/SecurityDemo.test.ts
```

#### 组件测试示例
```typescript
import { mount } from '@vue/test-utils'
import SecurityDemo from '../SecurityDemo.vue'

describe('SecurityDemo 组件', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(SecurityDemo)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### 3. E2E 测试

使用 Cypress 进行端到端测试。

#### 运行 E2E 测试
```bash
# 运行所有 E2E 测试
npm run test:e2e

# 在开发模式下运行 E2E 测试
npm run test:e2e:dev
```

#### E2E 测试文件结构
```
cypress/
├── e2e/
│   └── security.cy.ts
└── support/
    ├── e2e.ts
    └── component.ts
```

## 测试覆盖率

项目设置了最低测试覆盖率要求：
- 语句覆盖率：80%
- 分支覆盖率：80%
- 函数覆盖率：80%
- 行覆盖率：80%

## 测试最佳实践

1. 单元测试
   - 每个工具函数都应该有对应的测试
   - 测试应该覆盖正常和异常情况
   - 使用模拟（mock）隔离外部依赖

2. 组件测试
   - 测试组件的渲染
   - 测试用户交互
   - 测试组件状态变化
   - 测试组件生命周期

3. E2E 测试
   - 测试关键用户流程
   - 测试页面导航
   - 测试表单提交
   - 测试错误处理

## 持续集成

项目使用 GitHub Actions 进行持续集成，每次提交都会：
1. 运行单元测试
2. 运行组件测试
3. 运行 E2E 测试
4. 生成测试覆盖率报告

## 测试工具

1. Vitest
   - 测试运行器
   - 断言库
   - 模拟工具

2. Vue Test Utils
   - 组件挂载
   - 组件交互
   - 组件状态管理

3. Cypress
   - 浏览器自动化
   - 网络请求模拟
   - 快照测试

## 常见问题

1. 测试失败
   - 检查测试环境是否正确
   - 检查模拟是否正确
   - 检查异步操作是否正确处理

2. 测试覆盖率低
   - 添加更多测试用例
   - 检查是否有未覆盖的代码路径
   - 检查是否有不必要的代码

3. 测试运行慢
   - 使用测试并行化
   - 优化测试用例
   - 减少不必要的测试 
