import { ProjectWithTime } from "../types";

export const projectFormItemKeyToName: Record<keyof ProjectWithTime, string> = {
    name: '项目名称',
    budget: '设计预算',
    contactName: '联系人姓名',
    contactTel: '联系人电话',
    designItems: '设计阶段',
    mode: '竞价模式',
    type: '项目类型',
    address: '项目位置',
    publishTime: '发布时间'
}