# ajax 使用文档

`ajax` 是对 `window.http` 的轻封装，统一返回 `data` 字段，并提供本地缓存能力（`cache`）与缓存清理能力（`clean`）。

## 1. 前置条件

项目运行时需要存在全局 `window.http`，并包含以下方法：

```typescript
window.http.get(path: string, data?: object): Promise<{ data: any }>
window.http.post(path: string, data?: object): Promise<{ data: any }>
```

## 2. 导入方式

```typescript
import { ajax } from '@/utils/ajax'
```

## 3. 方法总览

所有方法签名统一为：

```typescript
method<T = any>(path: string, data?: Record<string, any>): PromiseResult<T>
```

其中 `PromiseResult<T>` 等价于：

```typescript
type PromiseResult<T> = Promise<T> & {
  cache: Promise<T>['then']
  clean: Promise<T>['then']
}
```

### 3.1 基础数据

- `ajax.get<T>()`：GET 请求，返回 `res.data`
- `ajax.post<T>()`：POST 请求，返回 `res.data`

### 3.2 列表数据

- `ajax.getList<T>()`：GET 请求，返回 `res.data.list`（`T[]`）
- `ajax.postList<T>()`：POST 请求，返回 `res.data.list`（`T[]`）

### 3.3 分页数据

- `ajax.getPage<T>()`：GET 请求，返回分页对象
- `ajax.postPage<T>()`：POST 请求，返回分页对象

分页对象结构：

```typescript
interface PageDataResponse<T> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
  boolLastPage: boolean
}
```

## 4. cache 与 clean

### 4.1 cache

`cache` 类似 `then`，但会先尝试读取本地缓存，再继续发起真实请求并更新缓存。

- 缓存存储：`localStorage['LOCAL_AJAX_CACHE_KEY']`
- 缓存 key：`JSON.stringify([method, path, data])`
- 过期时间：默认 7 天
- 命中缓存时：会**先**执行一次回调（缓存数据）
- 网络返回后：会**再**执行一次回调（最新数据）

```typescript
ajax.get<{ count: number }>('/api/statistics')
  .cache((data) => {
    // 可能执行两次：缓存一次 + 网络一次
    console.log('count:', data.count)
    return data
  })
  .then((data) => {
    // then 接收 cache 回调返回值（通常是网络最新结果）
    console.log('done:', data.count)
  })
```

### 4.2 clean

`clean` 会先删除当前请求对应缓存，再继续正常请求。

```typescript
ajax.get('/api/statistics')
  .clean((data) => {
    console.log('cache removed, fresh data:', data)
    return data
  })
```

## 5. 使用示例

```typescript
interface User {
  id: number
  name: string
}

// 基础请求
const profile = await ajax.get<{ id: number; nickname: string }>('/api/profile')

// 列表请求
const users = await ajax.postList<User>('/api/users/list', { pageNum: 1, pageSize: 20 })

// 分页请求
const page = await ajax.getPage<User>('/api/users/page', { pageNum: 1, pageSize: 20 })
console.log(page.total, page.list)

// 带缓存
ajax.post<{ token: string }>('/api/login', { username: 'u', password: 'p' })
  .cache((res) => {
    if (res.token) localStorage.setItem('token', res.token)
    return res
  })
```

## 6. 注意事项

- `cache` 回调可能执行两次，回调中请避免产生不可重复副作用（如重复弹窗、重复埋点）。
- 缓存键依赖 `data` 的序列化结果；参数对象字段顺序变化会影响命中。
- `clean` 只清当前“方法 + 路径 + 参数”对应缓存，不会清空全部缓存。
- 若响应为空会以 `'网络请求错误'` 走 reject，调用方需按 Promise 异常处理。
