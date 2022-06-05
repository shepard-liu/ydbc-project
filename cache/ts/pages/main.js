import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonIcon, IonPage } from '@ionic/react';
import { cloudUpload, search, help } from 'ionicons/icons';
import './main.scss';
import { Link } from 'react-router-dom';
const shortcuts = [
    { path: '/publish', name: '发布', icon: cloudUpload },
    { path: '/explore', name: '浏览', icon: search },
    { path: '/main/help', name: '帮助', icon: help },
];
const Main = () => {
    return (_jsx(IonPage, { children: _jsxs("div", Object.assign({ className: 'main Full Flex-col' }, { children: [_jsx("div", Object.assign({ className: 'heading' }, { children: "\u9700\u6C42\u7BA1\u7406\u5E73\u53F0" })), _jsx("div", Object.assign({ className: 'shortcuts Flex-col-center Flex-grow' }, { children: shortcuts.map((elem) => (_jsxs(Link, Object.assign({ className: 'shortcut-item Flex-center', to: elem.path }, { children: [_jsx(IonIcon, { icon: elem.icon }), _jsx("span", { children: elem.name })] }), elem.name))) }))] })) }));
};
export default Main;
