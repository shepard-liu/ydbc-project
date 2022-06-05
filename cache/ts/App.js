import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// Import Icons
import { home, cloudUpload, search, map } from 'ionicons/icons';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import Main from './pages/main';
import Publish from './pages/publish';
import Explore from './pages/explore';
import Visualize from './pages/visualize';
import Help from './pages/help';
import Confirm from './pages/confirm';
setupIonicReact();
const App = () => {
    return (_jsx(IonApp, { children: _jsx(IonReactRouter, { children: _jsxs(IonTabs, { children: [_jsxs(IonRouterOutlet, { children: [_jsx(Route, Object.assign({ exact: true, path: "/main" }, { children: _jsx(Main, {}) })), _jsx(Route, Object.assign({ exact: true, path: "/main/help" }, { children: _jsx(Help, {}) })), _jsx(Route, Object.assign({ exact: true, path: "/publish" }, { children: _jsx(Publish, {}) })), _jsx(Route, Object.assign({ exact: true, path: "/publish/confirm" }, { children: _jsx(Confirm, {}) })), _jsx(Route, Object.assign({ exact: true, path: "/explore" }, { children: _jsx(Explore, {}) })), _jsx(Route, Object.assign({ exact: true, path: "/visualize" }, { children: _jsx(Visualize, {}) })), _jsx(Route, Object.assign({ exact: true, path: "/" }, { children: _jsx(Redirect, { to: "/main" }) }))] }), _jsxs(IonTabBar, Object.assign({ slot: "bottom" }, { children: [_jsxs(IonTabButton, Object.assign({ tab: "main", href: "/main" }, { children: [_jsx(IonIcon, { icon: home }), _jsx(IonLabel, { children: "\u9996\u9875" })] })), _jsxs(IonTabButton, Object.assign({ tab: "publish", href: "/publish" }, { children: [_jsx(IonIcon, { icon: cloudUpload }), _jsx(IonLabel, { children: "\u9700\u6C42\u53D1\u5E03" })] })), _jsxs(IonTabButton, Object.assign({ tab: "explore", href: "/explore" }, { children: [_jsx(IonIcon, { icon: search }), _jsx(IonLabel, { children: "\u6D4F\u89C8\u9700\u6C42" })] })), _jsxs(IonTabButton, Object.assign({ tab: "visualize", href: "/visualize" }, { children: [_jsx(IonIcon, { icon: map }), _jsx(IonLabel, { children: "\u5730\u56FE\u5C55\u793A" })] }))] }))] }) }) }));
};
export default App;
