---
description: "mock数据创建规范"
alwaysApply: true
---

# Mock 数据创建规范

本文档定义了项目中 mock 数据的标准结构和最佳实践。

## 概述

项目中使用 `ajax.post`、`ajax.postList`、`ajax.postPage` 三种方法调用 API，每种方法对应不同的响应数据结构。创建 mock 数据时，必须遵循对应的标准结构。

## API 响应结构

### 1. ajax.post - 单个对象响应

用于返回单个数据对象的接口。

**标准结构：**

```typescript
export const mockData: HttpResponse<T> = {
    "code": "1",
    "msg": "成功",
    "errorDetail": null,
    "data": {
        // 具体的业务数据对象
        "id": 1,
        "name": "示例名称",
        // ... 其他字段
    }
}
```

**使用场景：**
- 获取详情接口
- 创建/更新接口
- 单个配置信息接口

**示例：**

```typescript
// api.ts
export function getDetail(id: number) {
    return ajax.post<DetailItem>('/api/detail', { id })
}

// mock.ts
export const mockDetail: DetailItem = {
    "id": 1,
    "name": "示例详情",
    "description": "这是详情描述"
}
```

---

### 2. ajax.postList - 列表响应

用于返回数据列表的接口（无分页信息）。

**标准结构：**

```typescript
export const mockData: HttpResponseList<T> = {
    "code": "1",
    "msg": "成功",
    "errorDetail": null,
    "data": {
        "list": [
            { /* 数据项1 */ },
            { /* 数据项2 */ },
            // ...
        ]
    }
}
```

**使用场景：**
- 下拉选项列表
- 分类列表
- 无需分页的数据列表

**示例：**

```typescript
// api.ts
export function getCategoryList() {
    return ajax.postList<CategoryItem>('/api/category/list')
}

// mock.ts
export const mockCategoryList: CategoryItem[] = [
    { "id": 1, "name": "分类1" },
    { "id": 2, "name": "分类2" },
    { "id": 3, "name": "分类3" }
]
```

---

### 3. ajax.postPage - 分页响应

用于返回分页数据的接口。

**标准结构：**

```typescript
export const mockData: HttpResponseListPage<T> = {
    "code": "1",
    "msg": "成功",
    "errorDetail": null,
    "data": {
        "list": [
            { /* 数据项1 */ },
            { /* 数据项2 */ },
            // ...
        ],
        "pageNum": 1,      // 当前页码
        "pageSize": 25,    // 每页数量
        "pages": 1,        // 总页数
        "total": 1         // 总记录数
    }
}
```

**使用场景：**
- 表格列表数据
- 需要分页的数据查询

**示例：**

```typescript
// api.ts
export function getPageList(params: SearchParams) {
    return ajax.postPage<ListItem>('/api/list', params)
}

// mock.ts
export const mockPageList: ListItem[] = [
    { "id": 1, "name": "项目1", "status": 1 },
    { "id": 2, "name": "项目2", "status": 2 },
    // ... 更多数据
]
```

---

## 最佳实践

### 1. 类型定义

- ✅ **推荐**：使用 TypeScript 类型定义，确保类型安全
- ✅ **推荐**：mock 数据应覆盖接口定义的所有字段
- ❌ **避免**：使用 `any` 类型

```typescript
// ✅ 好的做法
export const mockData: RegisterStoreItem[] = [
    {
        "id": 1,
        "name": "示例",
        // 所有必需字段都有值
    }
]

// ❌ 避免
export const mockData: any[] = [...]
```

### 2. 数据完整性

- ✅ **推荐**：mock 数据应包含多种场景（正常、边界、异常）
- ✅ **推荐**：为可选字段提供 `undefined` 或空值的示例
- ✅ **推荐**：数组类型字段至少包含 2-3 个元素示例

```typescript
// ✅ 好的做法
export const mockData: RegisterPhoneItem[] = [
    {
        "phone": "13800138000",
        "name": "张三",
        "sellResponsible": "李四"  // 有销售
    },
    {
        "phone": "13900139000",
        "name": "王五",
        "sellResponsible": undefined  // 无销售
    }
]
```

### 3. 命名规范

- ✅ **推荐**：使用 `mock` 前缀，如 `mockUserList`、`mockDetailData`
- ✅ **推荐**：命名应清晰表达数据用途
- ❌ **避免**：使用模糊的命名，如 `data`、`list`

### 4. 文件组织

- ✅ **推荐**：在对应的功能模块目录下创建 `mock.ts` 文件
- ✅ **推荐**：mock 数据与 API 定义在同一目录层级
- ✅ **推荐**：导出多个 mock 数据时，使用具名导出

```typescript
// ✅ 好的文件结构
src/views/business/registerClue/
  ├── api.ts          // API 定义
  ├── types.ts        // 类型定义
  ├── mock.ts         // Mock 数据
  └── index.vue       // 组件
```

---

## 注意事项

1. **字段类型匹配**：确保 mock 数据的字段类型与接口定义完全一致
2. **必需字段**：所有必需字段（非可选字段）都必须提供值
3. **可选字段**：可选字段可以设置为 `undefined`，但应提供有值的示例
4. **数组字段**：数组类型字段应提供至少一个元素的示例
5. **日期时间**：使用标准的日期时间格式（如 `YYYY-MM-DD HH:mm:ss` 或 ISO 8601）
6. **ID 唯一性**：确保 mock 数据中的 ID 字段唯一

---

## 常见错误

### ❌ 错误示例 1：缺少必需字段

```typescript
// ❌ 错误：缺少必需字段
export const mockData: UserItem[] = [
    {
        "name": "张三"
        // 缺少必需的 id 字段
    }
]
```

### ❌ 错误示例 2：类型不匹配

```typescript
// ❌ 错误：类型不匹配
export const mockData: UserItem[] = [
    {
        "id": "1",  // 应该是 number，不是 string
        "name": "张三"
    }
]
```

### ❌ 错误示例 3：结构不符合规范

```typescript
// ❌ 错误：postPage 返回的数据结构不正确
export const mockData = {
    "list": [...],  // 缺少 code、msg、errorDetail 等字段
}
```

---

## 检查清单

创建 mock 数据时，请确认：

- [ ] 数据结构符合对应的 API 响应格式（post/postList/postPage）
- [ ] 所有字段类型与接口定义一致
- [ ] 必需字段都有值
- [ ] 提供了多种场景的示例数据
- [ ] 命名清晰且符合规范
- [ ] 数据具有代表性，能覆盖常见使用场景