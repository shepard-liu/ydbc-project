import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './help.scss';
const Help = () => {
    return (_jsxs(IonPage, { children: [_jsx(IonHeader, { children: _jsxs(IonToolbar, { children: [_jsx(IonButtons, Object.assign({ slot: 'start' }, { children: _jsx(IonBackButton, { defaultHref: '/main' }) })), _jsx(IonTitle, { children: "\u5E2E\u52A9" })] }) }), _jsx(IonContent, Object.assign({ fullscreen: true, className: 'help' }, { children: "\u8FD9\u53EA\u662F\u53E6\u4E00\u4E2A\u5E2E\u52A9\u9875" }))] }));
};
export default Help;
