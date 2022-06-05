import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonPage, IonBackButton, IonList, IonItem } from "@ionic/react";
import { backspace } from 'ionicons/icons';
// interfaces
// stylesheet
import './confirm.scss';
import { useGlobalState } from "../hooks/globalState";
import ProjectInfo from "../components/projectInfo";
const formItemKeyToName = {
    name: '项目名称',
    budget: '设计预算',
    contactName: '联系人姓名',
    contactTel: '联系人电话',
    designItems: '设计阶段',
    locationName: '项目位置',
    mode: '竞价模式',
    type: '项目类型'
};
const Confirm = () => {
    const [{ errorState, formData }, _] = useGlobalState('PROJECT_FORM', {
        errorState: null,
        formData: null
    }, 'Confirm');
    const formOnError = Object.values(errorState || { err: true }).includes(true);
    return (_jsxs(IonPage, Object.assign({ className: "confirm" }, { children: [_jsx(IonHeader, { children: _jsxs(IonToolbar, { children: [_jsx(IonTitle, { children: "\u63D0\u4EA4\u9700\u6C42\u5185\u5BB9" }), _jsx(IonButtons, Object.assign({ slot: 'start' }, { children: _jsx(IonBackButton, Object.assign({ defaultHref: "/publish" }, { children: _jsx(IonIcon, { icon: backspace }) })) })), _jsx(IonButtons, Object.assign({ slot: "end" }, { children: _jsx(IonButton, Object.assign({ className: "confirm-btn", disabled: formOnError }, { children: "\u786E\u8BA4\u63D0\u4EA4" })) }))] }) }), _jsxs("div", Object.assign({ className: "content Full Scroll-area" }, { children: [_jsxs("div", Object.assign({ className: "error-hint", "data-show": formOnError }, { children: [_jsx("span", Object.assign({ className: "error-message" }, { children: "\u60A8\u8FD8\u672A\u6B63\u786E\u586B\u5199\u7684\u9700\u6C42\u9879\uFF1A" })), _jsx(IonList, Object.assign({ className: "error-list" }, { children: Object.entries(errorState || {})
                                    .filter((elem) => elem[1] === true && formItemKeyToName[elem[0]] !== undefined)
                                    .map((elem) => (_jsx(IonItem, { children: formItemKeyToName[elem[0]] }, elem[0]))) }))] })), _jsx(ProjectInfo, { project: formData })] }))] })));
};
export default Confirm;
