# 接口处理方法（与当前脚本保持一致）

本文件描述当前项目里 `scripts/generate-yapi-files.mjs` 的真实行为，作为“生成接口文件”的单一说明。

## 目标

- 从 YApi 拉取接口定义
- 将 `req_body_other` / `res_body` 转换为 TypeScript 类型
- 生成：
  - `generated/api.ts`
  - `generated/type.ts`
- 生成结果遵循 `md/ajax.md` 的调用约定（`ajax.get/post/getList/postList/getPage/postPage`）

## 运行方式

```bash
pnpm run gen:yapi-files
```

## 环境变量

必需：

- `YAPI_BASE_URL`
- `YAPI_TOKEN`，格式：`projectId:token`，多项目用逗号分隔：`p1:t1,p2:t2`

可选：

- `YAPI_GATEWAY_PREFIX`：强制网关前缀，优先级高于项目 `basepath`

## 生成流程

1. 读取并校验 `md/ajax.md`（必须包含 `ajax.get/post/getList/postList/getPage/postPage`）
2. 按项目读取：
   - `/api/project/get`
   - `/api/interface/getCatMenu`
   - `/api/interface/list_cat`
   - `/api/interface/get`
3. 对接口按 `method + path` 排序，保证生成稳定
4. 解析 JSON Schema，生成类型字段树
5. 输出 `type.ts` 和 `api.ts`

## 命名规则（可读版）

以 `GET /spielenPc/page` 为例：

- 函数名：`getSpielenPcPageApi`
- 入参类型：`GetSpielenPcPageParams`
- 返回类型：`GetSpielenPcPageResponse`

说明：

- 方法名前缀按 HTTP Method 映射：`Get / Post / Put / Delete / Patch`
- 路径转 PascalCase 后拼接方法前缀
- 若重名，自动追加稳定后缀（如 `By{id}`）避免冲突

## ajax 方法自动推断

脚本会根据响应结构自动选择方法：

- 普通对象：`get` / `post`
- `data.list`：`getList` / `postList`
- 分页结构（`pageNum/pageSize/total/pages/list`）：`getPage` / `postPage`

## 空类型处理（当前约定）

- 空入参：不生成 `Params` 类型；函数不带 `data` 参数
- 空返回：不生成 `Response` 类型；调用时不带泛型

示例：

```ts
// 空入参 + 空返回
export const getAdminSpielenBoolOpenApi = () =>
  ajax.get("/admin/spielen/boolOpen");

// 空入参 + 有返回
export const getSpielenPcPageApi = () =>
  ajax.getPage<Types.GetSpielenPcPageResponse>("/spielenPc/page");
```

## 网关拼接规则

请求路径会自动补网关：

1. 优先使用 `YAPI_GATEWAY_PREFIX`
2. 否则使用项目 `basepath`
3. 若接口路径本身已包含网关前缀，则不重复拼接

## 维护建议

- 该文档变更后，建议执行一次 `pnpm run gen:yapi-files` 验证
- 若修改了 `ajax` 约定，先同步更新 `md/ajax.md`，再调整生成脚本
- 生成文件为产物，不建议手工编辑（以脚本为准）
