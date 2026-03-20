import fs from "node:fs/promises";
import path from "node:path";
import { compile } from "json-schema-to-typescript";
import prettier from "prettier";

const ROOT_DIR = process.cwd();
const DEFAULT_OUTPUT_DIR = path.join(ROOT_DIR, "generated");
const AJAX_DOC_PATH = path.join(ROOT_DIR, "docs/ajax.md");

function parseEnv(envText) {
  const map = {};
  for (const line of envText.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    map[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return map;
}

function parseTokenMap(rawToken) {
  const tokenMap = new Map();
  if (!rawToken) return tokenMap;
  for (const pair of rawToken.split(",")) {
    const [projectId, ...tokenRest] = pair.trim().split(":");
    if (!projectId || tokenRest.length === 0) continue;
    tokenMap.set(projectId, tokenRest.join(":"));
  }
  return tokenMap;
}

function parseCliArgs(argv) {
  const result = {};
  for (const item of argv) {
    if (!item.startsWith("--")) continue;
    const [rawKey, ...rest] = item.slice(2).split("=");
    const value = rest.join("=");
    if (!rawKey || !value) continue;
    result[rawKey] = value;
  }
  return result;
}

function resolveOutputPaths(cliArgs) {
  const outputDirRaw = cliArgs["output-dir"] || "generated";
  const outputDir = path.isAbsolute(outputDirRaw) ? outputDirRaw : path.resolve(ROOT_DIR, outputDirRaw);

  const apiOutputPathRaw = cliArgs["api-output-path"];
  const typeOutputPathRaw = cliArgs["type-output-path"];

  const apiOutputPath = apiOutputPathRaw
    ? path.isAbsolute(apiOutputPathRaw)
      ? apiOutputPathRaw
      : path.resolve(ROOT_DIR, apiOutputPathRaw)
    : path.join(outputDir, "api.ts");

  const typeOutputPath = typeOutputPathRaw
    ? path.isAbsolute(typeOutputPathRaw)
      ? typeOutputPathRaw
      : path.resolve(ROOT_DIR, typeOutputPathRaw)
    : path.join(outputDir, "type.ts");

  return { outputDir, apiOutputPath, typeOutputPath };
}

function toPascalCase(input) {
  return input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(input) {
  const pascal = toPascalCase(input);
  if (!pascal) return "apiFn";
  return pascal[0].toLowerCase() + pascal.slice(1);
}

function normalizeMethodName(method) {
  const upper = String(method || "POST").toUpperCase();
  if (upper === "GET") return "Get";
  if (upper === "POST") return "Post";
  if (upper === "PUT") return "Put";
  if (upper === "DELETE") return "Delete";
  if (upper === "PATCH") return "Patch";
  return toPascalCase(upper);
}

function buildReadableBaseName(api) {
  const methodPart = normalizeMethodName(api.method);
  const rawPath = String(api.path || "/")
    .replace(/[:{}]/g, " ")
    .replace(/\//g, " ");
  const pathPart = toPascalCase(rawPath) || "Api";
  return `${methodPart}${pathPart}`;
}

function ensureUniqueName(baseName, usedNames, fallbackSuffix) {
  if (!usedNames.has(baseName)) {
    usedNames.add(baseName);
    return baseName;
  }

  const withFallback = `${baseName}${fallbackSuffix}`;
  if (!usedNames.has(withFallback)) {
    usedNames.add(withFallback);
    return withFallback;
  }

  let index = 2;
  while (usedNames.has(`${withFallback}${index}`)) {
    index += 1;
  }
  const finalName = `${withFallback}${index}`;
  usedNames.add(finalName);
  return finalName;
}

function normalizeGatewayPrefix(prefix) {
  if (!prefix || prefix === "/") return "";
  const withLeading = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return withLeading.replace(/\/+$/, "");
}

function buildGatewayPath(basepath, apiPath) {
  const normalizedApiPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const gatewayPrefix = normalizeGatewayPrefix(basepath);
  if (!gatewayPrefix) return normalizedApiPath;
  if (normalizedApiPath === gatewayPrefix || normalizedApiPath.startsWith(`${gatewayPrefix}/`)) {
    return normalizedApiPath;
  }
  return `${gatewayPrefix}${normalizedApiPath}`;
}

function strToJson(str) {
  const desc = / \* (.*)\n/.exec(str);
  const name = / ([a-zA-Z0-9_$]*)\??:/.exec(str);
  let type = str.split(":").pop()?.trim() ?? "undefined";
  if (type.includes("(")) {
    const reg = /\("(.*?)"\)/g;
    const typeArray = [];
    while (true) {
      const res = reg.exec(type);
      if (res) typeArray.push(res[1]);
      else break;
    }
    type = typeArray.join("|");
  }
  return {
    desc: desc ? desc[1] : "",
    name: name ? name[1] : "",
    type,
    required: !str.includes("?"),
  };
}

function getChildList(text) {
  const children = [];
  if (!text) return children;
  let context = { parent: null, list: children };
  const array = text.split(";");
  array.pop();
  array.forEach((item) => {
    if (item.includes("{")) {
      const child = {
        ...strToJson(item.split("{")[0]),
        children: [strToJson(item.split("{")[1])],
      };
      context.list.push(child);
      context = { parent: context, list: child.children };
    } else if (item.includes("}")) {
      if (context.parent) {
        const lastItem = context.parent.list[context.parent.list.length - 1];
        lastItem.type = item.includes("[]") ? "array" : "object";
        context = context.parent;
      }
    } else {
      context.list.push(strToJson(item));
    }
  });
  return children;
}

function getInterfaceStr(attrList) {
  return attrList.reduce((result, attr) => {
    if (!attr.name) return result;
    result += `\n  // ${attr.desc}\n  ${attr.name}`;
    if (!attr.required) result += "?";
    if (attr.children) {
      if (attr.type === "array") {
        result += `: Array<{` + "\n" + getInterfaceStr(attr.children) + "\n  }>";
      } else if (attr.type === "object") {
        result += `: {` + "\n" + getInterfaceStr(attr.children) + "\n  }";
      }
    } else {
      result += ":" + (attr.type || "undefined");
    }
    return result;
  }, "");
}

function exportInterface(tableData, name) {
  const dataList = tableData.filter((item) => item.name === "data" && item.type !== "unknow");
  if (dataList.length && dataList[0].children) {
    return `export interface ${name} {${getInterfaceStr(dataList[0].children)}\n}\n`;
  }
  if (tableData.length > 0) {
    return `export interface ${name} {${getInterfaceStr(tableData)}\n}\n`;
  }
  return "";
}

function exportParamsInterface(tableData, name) {
  if (tableData.length > 0) {
    return `export interface ${name} {${getInterfaceStr(tableData)}\n}\n`;
  }
  return "";
}

function pickSchemaForCompile(schemaText, responseMode = "data") {
  const json = parseJsonSafe(schemaText);
  if (!json || typeof json !== "object") return null;

  // 统一从 data 节点向下取业务结构
  const dataSchema = json?.properties?.data && typeof json.properties.data === "object" ? json.properties.data : json;

  // 对 list/page 场景，类型只取 list 项结构
  if (responseMode === "list" || responseMode === "page") {
    const listItemsSchema = dataSchema?.properties?.list?.items;
    if (listItemsSchema && typeof listItemsSchema === "object") {
      return listItemsSchema;
    }
  }

  return dataSchema;
}

async function transformTs(schemaText, className, responseMode = "data") {
  if (!schemaText) return [];
  const schemaForCompile = pickSchemaForCompile(schemaText, responseMode);
  if (!schemaForCompile) return [];

  const normalizedSchema =
    schemaForCompile && typeof schemaForCompile === "object"
      ? {
          type: schemaForCompile.type || "object",
          ...schemaForCompile,
        }
      : { type: "object" };
  const ts = await compile(normalizedSchema, className, {
    bannerComment: "",
    declareExternallyReferenced: false,
    enableConstEnums: true,
    unreachableDefinitions: false,
    strictIndexSignatures: false,
    style: {
      bracketSpacing: false,
      printWidth: 120,
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "none",
      useTabs: false,
    },
  });
  const cleaned = ts.replace(/\n\s*\[k: string\]: unknown;/g, "");
  const match = cleaned.match(/export interface .*? {([\s\S]*)}\n?/);
  const content = match?.[1] ?? null;
  return getChildList(content);
}

async function yapiRequest({ baseUrl, token, endpoint, method = "GET", params = {}, body = {} }) {
  if (method === "GET") {
    const url = new URL(`${baseUrl}${endpoint}`);
    Object.entries({ ...params, token }).forEach(([k, v]) => {
      url.searchParams.set(k, String(v));
    });
    const response = await fetch(url);
    return response.json();
  }
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, token }),
  });
  return response.json();
}

function parseJsonSafe(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function inferResponseMode(resSchemaText) {
  const schema = parseJsonSafe(resSchemaText);
  const data = schema?.properties?.data;
  const dataProps = data?.properties || {};
  const hasList = Object.prototype.hasOwnProperty.call(dataProps, "list");
  const hasPageMeta = ["pageNum", "pageSize", "total", "pages"].every((k) =>
    Object.prototype.hasOwnProperty.call(dataProps, k),
  );
  if (hasList && hasPageMeta) return "page";
  if (hasList) return "list";
  return "data";
}

function inferAjaxMethod(httpMethod, responseMode) {
  const isGet = String(httpMethod).toUpperCase() === "GET";
  if (isGet && responseMode === "page") return "getPage";
  if (isGet && responseMode === "list") return "getList";
  if (isGet) return "get";
  if (responseMode === "page") return "postPage";
  if (responseMode === "list") return "postList";
  return "post";
}

async function readAndValidateAjaxDoc() {
  const ajaxDoc = await fs.readFile(AJAX_DOC_PATH, "utf8");
  const requiredMarkers = ["ajax.get", "ajax.post", "ajax.getList", "ajax.postList", "ajax.getPage", "ajax.postPage"];
  const missingMarkers = requiredMarkers.filter((marker) => !ajaxDoc.includes(marker));
  if (missingMarkers.length > 0) {
    throw new Error(`ajax 文档缺少关键方法说明: ${missingMarkers.join(", ")}`);
  }
}

async function generateByProject(baseUrl, projectId, token, gatewayPrefixFromEnv = "") {
  const projectInfo = await yapiRequest({
    baseUrl,
    token,
    endpoint: "/api/project/get",
    params: { id: projectId },
  });
  const projectBasePath =
    projectInfo.errcode === 0 && projectInfo.data?.basepath ? String(projectInfo.data.basepath) : "";
  const effectiveGatewayPrefix = gatewayPrefixFromEnv || projectBasePath;

  const catMenu = await yapiRequest({
    baseUrl,
    token,
    endpoint: "/api/interface/getCatMenu",
    params: { project_id: projectId },
  });
  if (catMenu.errcode !== 0) {
    throw new Error(`项目 ${projectId} 获取分类失败: ${catMenu.errmsg || "unknown"}`);
  }

  const categories = catMenu.data || [];
  const basicApis = [];
  for (const category of categories) {
    const listCat = await yapiRequest({
      baseUrl,
      token,
      endpoint: "/api/interface/list_cat",
      params: { project_id: projectId, catid: category._id, page: 1, limit: 500 },
    });
    if (listCat.errcode !== 0) continue;
    for (const api of listCat.data?.list || []) {
      basicApis.push({ ...api, categoryName: category.name });
    }
  }

  const dedupMap = new Map();
  for (const item of basicApis) dedupMap.set(String(item._id), item);
  const uniqueApis = [...dedupMap.values()].sort((a, b) => {
    const aKey = `${String(a.method || "").toUpperCase()} ${String(a.path || "")}`;
    const bKey = `${String(b.method || "").toUpperCase()} ${String(b.path || "")}`;
    return aKey.localeCompare(bKey);
  });

  const generatedTypes = [];
  const generatedApis = [];
  const usedBaseNames = new Set();

  for (const item of uniqueApis) {
    const detail = await yapiRequest({
      baseUrl,
      token,
      endpoint: "/api/interface/get",
      params: { id: item._id },
    });
    if (detail.errcode !== 0 || !detail.data) continue;

    const data = detail.data;
    const readableBaseName = buildReadableBaseName(data);
    const uniqueBaseName = ensureUniqueName(readableBaseName, usedBaseNames, `By${data._id}`);
    const reqClassName = `${uniqueBaseName}Params`;
    const resTypeName = `${uniqueBaseName}Response`;
    const apiFnName = `${toCamelCase(uniqueBaseName)}Api`;
    const requestPath = buildGatewayPath(effectiveGatewayPrefix, String(data.path || "/"));

    const responseMode = inferResponseMode(data.res_body);
    const reqList = await transformTs(data.req_body_other, reqClassName, "data");
    const resList = await transformTs(data.res_body, resTypeName, responseMode);
    const ajaxMethod = inferAjaxMethod(data.method, responseMode);
    const hasReqParams = reqList.length > 0;
    const hasResType = resList.length > 0;

    const reqTypeBlock = exportParamsInterface(reqList, reqClassName);
    const resTypeBlock = exportInterface(resList, resTypeName);
    if (reqTypeBlock) generatedTypes.push(reqTypeBlock);
    if (resTypeBlock) generatedTypes.push(resTypeBlock);

    const reqParamSignature = hasReqParams ? `data: Types.${reqClassName}` : "";
    const reqArgument = hasReqParams ? ", data" : "";
    const responseGeneric = hasResType ? `<Types.${resTypeName}>` : "";

    generatedApis.push(
      `// ${data.title} (${data.method} ${requestPath})\n` +
        `export const ${apiFnName} = (${reqParamSignature}) =>\n` +
        `  ajax.${ajaxMethod}${responseGeneric}("${requestPath}"${reqArgument});\n`,
    );
  }

  return { generatedTypes, generatedApis, count: uniqueApis.length };
}

async function main() {
  await readAndValidateAjaxDoc();

  const cliArgs = parseCliArgs(process.argv.slice(2));
  const { outputDir, apiOutputPath, typeOutputPath } = resolveOutputPaths(cliArgs);
  const envText = await fs.readFile(path.join(ROOT_DIR, ".env"), "utf8");
  const env = parseEnv(envText);
  const baseUrl = (cliArgs["yapi-base-url"] || env.YAPI_BASE_URL || "").replace(/\/$/, "");
  const gatewayPrefixFromEnv = cliArgs["yapi-gateway-prefix"] || env.YAPI_GATEWAY_PREFIX || "";

  const splitProjectId = cliArgs["yapi-project-id"] || env.YAPI_PROJECT_ID || "";
  const splitProjectToken = cliArgs["yapi-project-token"] || env.YAPI_PROJECT_TOKEN || "";
  const combinedToken = cliArgs["yapi-token"] || env.YAPI_TOKEN || "";

  const tokenMap = parseTokenMap(
    combinedToken || (splitProjectId && splitProjectToken ? `${splitProjectId}:${splitProjectToken}` : ""),
  );

  if (!baseUrl) throw new Error("未找到 YAPI_BASE_URL");
  if (tokenMap.size === 0) throw new Error("未找到 YAPI_TOKEN（格式应为 projectId:token）");

  // 默认输出目录仍是 generated，支持 agent 传入自定义路径。
  await fs.mkdir(outputDir || DEFAULT_OUTPUT_DIR, { recursive: true });

  const typeBlocks = [];
  const apiBlocks = [
    "// @ts-nocheck",
    "",
    'import { ajax } from "@/utils/ajax";',
    'import type * as Types from "./type";',
    "",
    "// 本文件由 scripts/generate-yapi-files.mjs 基于 docs/ajax.md 自动生成",
    "",
  ];

  let totalApis = 0;
  for (const [projectId, token] of tokenMap.entries()) {
    const result = await generateByProject(baseUrl, projectId, token, gatewayPrefixFromEnv);
    totalApis += result.count;
    typeBlocks.push(`// projectId: ${projectId}`);
    typeBlocks.push(...result.generatedTypes);
    apiBlocks.push(`// projectId: ${projectId}`);
    apiBlocks.push(...result.generatedApis);
  }

  const rawTypeContent = `${typeBlocks.join("\n")}\n`;
  const rawApiContent = `${apiBlocks.join("\n")}\n`;

  const prettierOptions = (await prettier.resolveConfig(ROOT_DIR)) || {};
  const formattedTypeContent = await prettier.format(rawTypeContent, {
    ...prettierOptions,
    parser: "typescript",
  });
  const formattedApiContent = await prettier.format(rawApiContent, {
    ...prettierOptions,
    parser: "typescript",
  });

  await fs.mkdir(path.dirname(typeOutputPath), { recursive: true });
  await fs.mkdir(path.dirname(apiOutputPath), { recursive: true });

  // 若文件已存在，仅覆盖写入最新内容；不存在则创建后写入。
  await fs.writeFile(typeOutputPath, formattedTypeContent, "utf8");
  await fs.writeFile(apiOutputPath, formattedApiContent, "utf8");

  console.log(`生成完成: ${totalApis} 个接口`);
  console.log(`输出文件: ${typeOutputPath}`);
  console.log(`输出文件: ${apiOutputPath}`);
}

main().catch((error) => {
  console.error(`生成失败: ${error.message}`);
  process.exit(1);
});
