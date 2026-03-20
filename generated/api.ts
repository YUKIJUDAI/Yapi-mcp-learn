// @ts-nocheck

import { ajax } from "@/utils/ajax";
import type * as Types from "./type";

// 本文件由 scripts/generate-yapi-files.mjs 基于 docs/ajax.md 自动生成

// projectId: 117
// 查询电竞酒店是否开通 (GET /admin/spielen/boolOpen)
export const getAdminSpielenBoolOpenApi = () =>
  ajax.get("/admin/spielen/boolOpen");

// 返回电竞酒店服务开通情况列表 (GET /admin/spielen/page)
export const getAdminSpielenPageApi = () =>
  ajax.getPage<Types.GetAdminSpielenPageResponse>("/admin/spielen/page");

// 停用/启用电竞酒店开通情况 (GET /admin/spielen/switch)
export const getAdminSpielenSwitchApi = () =>
  ajax.get("/admin/spielen/switch");

// 电脑异常变更应用 (GET /spielenPc/applyChange)
export const getSpielenPcApplyChangeApi = () =>
  ajax.get("/spielenPc/applyChange");

// 电脑与房间绑定 (GET /spielenPc/bind)
export const getSpielenPcBindApi = () =>
  ajax.get("/spielenPc/bind");

// 查询电竞酒店是否开通 (GET /spielenPc/boolOpen)
export const getSpielenPcBoolOpenApi = () =>
  ajax.get("/spielenPc/boolOpen");

// 电脑检测记录分页查询 (GET /spielenPc/checkLog/page)
export const getSpielenPcCheckLogPageApi = () =>
  ajax.getPage<Types.GetSpielenPcCheckLogPageResponse>("/spielenPc/checkLog/page");

// 电脑信息编辑 (GET /spielenPc/edit)
export const getSpielenPcEditApi = () =>
  ajax.get("/spielenPc/edit");

// 电脑信息获取 (GET /spielenPc/get)
export const getSpielenPcGetApi = () =>
  ajax.get<Types.GetSpielenPcGetResponse>("/spielenPc/get");

// 查询房间已绑定及未绑定的设备列表 (GET /spielenPc/listDevice)
export const getSpielenPcListDeviceApi = () =>
  ajax.get("/spielenPc/listDevice");

// 按照房间查看房设备数据 (GET /spielenPc/listRoomByRoom)
export const getSpielenPcListRoomByRoomApi = () =>
  ajax.getList<Types.GetSpielenPcListRoomByRoomResponse>("/spielenPc/listRoomByRoom");

// 查询房间下绑定的设备详情列表 (GET /spielenPc/listRoomDeviceDetail)
export const getSpielenPcListRoomDeviceDetailApi = () =>
  ajax.get("/spielenPc/listRoomDeviceDetail");

// 分页查询电竞酒店电脑设备信息 (GET /spielenPc/page)
export const getSpielenPcPageApi = () =>
  ajax.getPage<Types.GetSpielenPcPageResponse>("/spielenPc/page");

// 电脑信息更新记录分页查询 (GET /spielenPc/record/page)
export const getSpielenPcRecordPageApi = () =>
  ajax.getPage<Types.GetSpielenPcRecordPageResponse>("/spielenPc/record/page");

// 电脑信息删除 (GET /spielenPc/remove)
export const getSpielenPcRemoveApi = () =>
  ajax.get("/spielenPc/remove");

// 重新设置房间绑定数据 (GET /spielenPc/resetRoomBind)
export const getSpielenPcResetRoomBindApi = () =>
  ajax.get("/spielenPc/resetRoomBind");

// 电脑与房间解绑 (GET /spielenPc/unbind)
export const getSpielenPcUnbindApi = () =>
  ajax.get("/spielenPc/unbind");

// 查询电竞酒店电脑异常记录及变动情况 (GET /spielenPc/viewCheck)
export const getSpielenPcViewCheckApi = () =>
  ajax.get<Types.GetSpielenPcViewCheckResponse>("/spielenPc/viewCheck");

// 新建图片推广数据 (GET /spielenPcImagePromote/create)
export const getSpielenPcImagePromoteCreateApi = () =>
  ajax.get("/spielenPcImagePromote/create");

// 编辑图片推广数据 (GET /spielenPcImagePromote/edit)
export const getSpielenPcImagePromoteEditApi = () =>
  ajax.get("/spielenPcImagePromote/edit");

// 启用/停用图片推广数据 (GET /spielenPcImagePromote/editShow)
export const getSpielenPcImagePromoteEditShowApi = () =>
  ajax.get("/spielenPcImagePromote/editShow");

// 分页查询图片推广数据 (GET /spielenPcImagePromote/pageImagePromote)
export const getSpielenPcImagePromotePageImagePromoteApi = () =>
  ajax.getPage<Types.GetSpielenPcImagePromotePageImagePromoteResponse>("/spielenPcImagePromote/pageImagePromote");

// 删除图片推广数据 (GET /spielenPcImagePromote/remove)
export const getSpielenPcImagePromoteRemoveApi = () =>
  ajax.get("/spielenPcImagePromote/remove");

// 新建轮播消息 (GET /spielenPcMessageCycle/create)
export const getSpielenPcMessageCycleCreateApi = () =>
  ajax.get("/spielenPcMessageCycle/create");

// 编辑轮播消息 (GET /spielenPcMessageCycle/edit)
export const getSpielenPcMessageCycleEditApi = () =>
  ajax.get("/spielenPcMessageCycle/edit");

// 启用/停用轮播消息 (GET /spielenPcMessageCycle/editShow)
export const getSpielenPcMessageCycleEditShowApi = () =>
  ajax.get("/spielenPcMessageCycle/editShow");

// 分页查询轮播消息记录 (GET /spielenPcMessageCycle/pageMessageCycle)
export const getSpielenPcMessageCyclePageMessageCycleApi = () =>
  ajax.getPage<Types.GetSpielenPcMessageCyclePageMessageCycleResponse>("/spielenPcMessageCycle/pageMessageCycle");

// 删除轮播消息 (GET /spielenPcMessageCycle/remove)
export const getSpielenPcMessageCycleRemoveApi = () =>
  ajax.get("/spielenPcMessageCycle/remove");

// 分页查询推送消息记录 (GET /spielenPcMessagePush/pageMessagePush)
export const getSpielenPcMessagePushPageMessagePushApi = () =>
  ajax.getPage<Types.GetSpielenPcMessagePushPageMessagePushResponse>("/spielenPcMessagePush/pageMessagePush");

// 新增并发送推送消息 (GET /spielenPcMessagePush/push)
export const getSpielenPcMessagePushPushApi = () =>
  ajax.get("/spielenPcMessagePush/push");

// 导出电竞酒店电脑设备开机记录 (GET /spielenPcRecord/exportBootRecord)
export const getSpielenPcRecordExportBootRecordApi = () =>
  ajax.get("/spielenPcRecord/exportBootRecord");

// 查询电竞酒店电脑设备变动记录详情 (GET /spielenPcRecord/getChangeRecordDetail)
export const getSpielenPcRecordGetChangeRecordDetailApi = () =>
  ajax.get<Types.GetSpielenPcRecordGetChangeRecordDetailResponse>("/spielenPcRecord/getChangeRecordDetail");

// 分页查询电竞酒店电脑设备开机记录 (GET /spielenPcRecord/pageBootRecord)
export const getSpielenPcRecordPageBootRecordApi = () =>
  ajax.getPage<Types.GetSpielenPcRecordPageBootRecordResponse>("/spielenPcRecord/pageBootRecord");

// 分页查询电竞酒店电脑设备变动记录 (GET /spielenPcRecord/pageChangeRecord)
export const getSpielenPcRecordPageChangeRecordApi = () =>
  ajax.getPage<Types.GetSpielenPcRecordPageChangeRecordResponse>("/spielenPcRecord/pageChangeRecord");

// 新增启动广告 (POST /spielen/anfang/werben/add)
export const postSpielenAnfangWerbenAddApi = () =>
  ajax.post("/spielen/anfang/werben/add");

// 删除广告 (POST /spielen/anfang/werben/deleted)
export const postSpielenAnfangWerbenDeletedApi = () =>
  ajax.post("/spielen/anfang/werben/deleted");

// 分页查询启动广告 (POST /spielen/anfang/werben/page)
export const postSpielenAnfangWerbenPageApi = () =>
  ajax.postPage<Types.PostSpielenAnfangWerbenPageResponse>("/spielen/anfang/werben/page");

// 更新启动广告 (POST /spielen/anfang/werben/update)
export const postSpielenAnfangWerbenUpdateApi = () =>
  ajax.post("/spielen/anfang/werben/update");

// 根据id更新启动广告状态 (POST /spielen/anfang/werben/updateStatus)
export const postSpielenAnfangWerbenUpdateStatusApi = () =>
  ajax.post("/spielen/anfang/werben/updateStatus");

