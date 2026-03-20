// projectId: 117
export interface GetAdminSpielenPageResponse {
  // id
  id?: number;
  // 网络号
  campNum?: number;
  // 网络名称
  campName?: string;
  // 开通状态
  boolOpen?: boolean;
  // 开通时间 yyyy-MM-dd HH:mm:ss
  HH?: string;
}

export interface GetSpielenPcCheckLogPageResponse {
  // 网络号
  campId?: number;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // mac地址
  macAddress?: string;
  // 电脑主机名
  hostName?: string;
  // 电脑ip
  ip?: string;
  // 电脑cpu
  cpu?: string;
  // 电脑内存
  mem?: string;
  // 电脑显卡
  gpu?: string;
  // 电脑主板
  boardInfo?: string;
  // 操作人
  operName?: string;
  // 操作类型 0-新增 1-人工更新
  operType?: number;
  // 检测时间 yyyy-MM-dd HH:mm:ss
  HH?: string;
}

export interface GetSpielenPcGetResponse {
  // 网络号
  campId?: number;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // mac地址
  macAddress?: string;
  // 电脑主机名
  hostName?: string;
  // 电脑ip
  ip?: string;
  // 电脑cpu
  cpu?: string;
  // 电脑内存
  mem?: string;
  // 电脑显卡
  gpu?: string;
  // 电脑主板
  boardInfo?: string;
}

export interface GetSpielenPcListRoomByRoomResponse {
  // 房型或区域名称
  relName?: string;
  // 房型或区域下房间列表
  roomList?: Array<{
    // 房间id
    roomId?: number;
    // 房间编号
    serialNum?: string;
    // 已绑定电脑数量
    bindNum?: number;
    // 异常电脑数量
    uncheckNum?: number;
  }>;
}

export interface GetSpielenPcPageResponse {
  // 网络号
  campId?: number;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // mac地址
  macAddress?: string;
  // 关联房间 = 房型+房间号
  roomRel?: string;
  // 房间id
  roomId?: number;
  // 房型id
  roomTypeId?: number;
  // 状态 0-新增，1-正常，2-异常
  status?: number;
  // 最新检测时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 电脑主机名
  hostName?: string;
  // 电脑ip
  ip?: string;
  // 电脑cpu
  cpu?: string;
  // 电脑内存
  mem?: string;
  // 电脑显卡
  gpu?: string;
  // 电脑主板
  boardInfo?: string;
}

export interface GetSpielenPcRecordPageResponse {
  // 网络号
  campId?: number;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // mac地址
  macAddress?: string;
  // 电脑主机名
  hostName?: string;
  // 电脑ip
  ip?: string;
  // 电脑cpu
  cpu?: string;
  // 电脑内存
  mem?: string;
  // 电脑显卡
  gpu?: string;
  // 电脑主板
  boardInfo?: string;
  // 操作人
  operName?: string;
  // 操作类型 0-新增 1-人工更新
  operType?: number;
  // 修改时间 yyyy-MM-dd HH:mm:ss
  HH?: string;
}

export interface GetSpielenPcViewCheckResponse {
  // 检测时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 电脑名称
  pcName?: string;
  // 电脑主机名
  hostName?: string;
  // 新电脑主机名
  hostNameNew?: string;
  // 电脑主机名是否变动
  boolHostNameChange?: boolean;
  // 电脑ip
  ip?: string;
  // 新电脑ip
  ipNew?: string;
  // 电脑ip是否变动
  boolIpChange?: boolean;
  // mac地址
  macAddress?: string;
  // 新mac地址
  macAddressNew?: string;
  // mac地址是否变动
  boolMacAddressChange?: boolean;
  // 电脑cpu
  cpu?: string;
  // 新电脑cpu
  cpuNew?: string;
  // cpu是否变动
  boolCpuChange?: boolean;
  // 电脑内存
  mem?: string;
  // 新电脑内存
  memNew?: string;
  // 内存是否变动
  boolMemChange?: boolean;
  // 电脑显卡
  gpu?: string;
  // 新电脑显卡
  gpuNew?: string;
  // gpu是否变动
  boolGpuChange?: boolean;
  // 电脑主板
  boardInfo?: string;
  // 电脑主板
  boardInfoNew?: string;
  // 电脑主板是否变动
  boolBoardInfoChange?: boolean;
}

export interface GetSpielenPcImagePromotePageImagePromoteResponse {
  // 网络号
  campId?: number;
  // 图片推广id
  imagePromoteId?: number;
  // 图片地址
  imageUrl?: string;
  // 跳转地址
  linkUrl?: string;
  // 是否启用
  boolShow?: boolean;
  // 创建时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 操作人名称
  operName?: string;
}

export interface GetSpielenPcMessageCyclePageMessageCycleResponse {
  // 网络号
  campId?: number;
  // 轮播消息id
  messageCycleId?: number;
  // 消息标题
  title?: string;
  // 消息内容
  content?: string;
  // 发布时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 操作人名称
  operName?: string;
  // 是否启用
  boolShow?: boolean;
}

export interface GetSpielenPcMessagePushPageMessagePushResponse {
  // 网络号
  campId?: number;
  // 推送消息id
  messagePushId?: number;
  // 手机号
  phone?: string;
  // 消息标题
  title?: string;
  // 消息内容
  content?: string;
  // 发布时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 操作人名称
  operName?: string;
}

export interface GetSpielenPcRecordGetChangeRecordDetailResponse {
  // 网络号
  campId?: number;
  // 房型id
  subtypeId?: number;
  // 房间id
  accommodationId?: number;
  // 房间编号
  serialNum?: string;
  // mac地址
  macAddress?: string;
  // 房间名称
  roomName?: string;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // 变动时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 变动记录id
  changeId?: number;
  // 操作人名称
  operName?: string;
  // 变动列表
  changeList?: Array<{
    // 变动项名称
    changeName?: string;
    // 变动前的值
    before?: string;
    // 变动后的值
    after?: string;
    // 是否有变动
    boolChange?: boolean;
  }>;
}

export interface GetSpielenPcRecordPageBootRecordResponse {
  // 网络号
  campId?: number;
  // 房型id
  subtypeId?: number;
  // 房间id
  accommodationId?: number;
  // 房间编号
  serialNum?: string;
  // mac地址
  macAddress?: string;
  // 房间名称
  roomName?: string;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // 启动时间yyyy-MM-dd hh:mm:ss
  hh?: string;
}

export interface GetSpielenPcRecordPageChangeRecordResponse {
  // 网络号
  campId?: number;
  // 房型id
  subtypeId?: number;
  // 房间id
  accommodationId?: number;
  // 房间编号
  serialNum?: string;
  // mac地址
  macAddress?: string;
  // 房间名称
  roomName?: string;
  // 电脑id
  pcId?: number;
  // 电脑名称
  pcName?: string;
  // 变动时间yyyy-MM-dd hh:mm:ss
  hh?: string;
  // 变动记录id
  changeId?: number;
  // 操作人名称
  operName?: string;
}

export interface PostSpielenAnfangWerbenPageResponse {
  // id
  id?: number;
  // 创建时间 yyyy-MM-dd HH:mm:ss
  HH?: string;
  // 是否删除
  deleted?: boolean;
  // pms酒店id
  ntwId?: number;
  // 标题
  titel?: string;
  // 展示开始时间 yyyy-MM-dd HH:mm:ss
  HH?: string;
  // 展示结束时间 yyyy-MM-dd HH:mm:ss
  HH?: string;
  // 广告展示内容
  content?: string;
  // 状态 16-停用， 32-启用
  status?: number;
  //
  createByName?: NoName;
}
