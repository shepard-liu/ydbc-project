import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonButton, IonHeader, IonItem, IonLabel, IonList, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import GeoMap from '../components/geoMap';
import GeoSearch from '../components/geoSearch';
import Heading from '../components/heading';
import { Input } from '../components/input';
import { useGlobalState } from '../hooks/globalState';
import { useHistory } from 'react-router';
import './publish.scss';
// *----- Input Validators -----* //
const validateEmpty = (value) => value.length !== 0;
const prjNameValidators = [
    {
        id: '1',
        validateFunctionOrPattern: validateEmpty,
        errorMessage: "项目名称不能为空",
    }
];
const prjBudgetValidators = [
    {
        id: '1',
        validateFunctionOrPattern: validateEmpty,
        errorMessage: "预算不能为空"
    }
];
const prjContactNameValidators = [
    {
        id: '1',
        validateFunctionOrPattern: validateEmpty,
        errorMessage: "联系人姓名不能为空"
    }
];
const prjContactTelValidators = [
    {
        id: '1',
        validateFunctionOrPattern: validateEmpty,
        errorMessage: "联系人电话不能为空"
    }, {
        id: '2',
        validateFunctionOrPattern: /^[0-9]{11}$/,
        errorMessage: "请输入正确的电话号码"
    }
];
const prjTypes = ['水利水电', '测绘工程', '房屋修缮', '开垦荒地', '建筑施工', '其他类型'];
const prjModes = ['固定设计费', '报价竞标'];
const prjDesignItems = [
    {
        name: "环境影响评价",
        steps: ['现场技术服务', '编制报告', '专家评审汇报']
    }, {
        name: "清洁生产审核",
        steps: ['现场技术服务', '编制报告', '专家评审汇报']
    }, {
        name: "项目建议书",
        steps: ['现场技术服务', '编制报告', '编制图纸']
    }, {
        name: "可行性研究",
        steps: ['现场技术服务', '编制报告', '编制图纸', '专家评审汇报']
    }, {
        name: "初步设计",
        steps: ['现场技术服务', '编制报告', '编制图纸', '专家评审汇报']
    }, {
        name: "施工图设计",
        steps: ['现场技术服务', '编制报告', '编制图纸', '专家评审汇报']
    },
];
const projectDataInitObject = {
    name: null,
    address: null,
    budget: null,
    contactName: null,
    contactTel: null,
    designItems: prjDesignItems.map((elem) => ({ name: elem.name, steps: [] })),
    locationName: null,
    lonLat: null,
    mode: null,
    type: null
};
const errStateInitObject = {
    name: true,
    address: true,
    budget: true,
    contactName: true,
    contactTel: true,
    designItems: true,
    locationName: true,
    lonLat: true,
    mode: true,
    type: true
};
const Publish = () => {
    const projectDataRef = useRef(projectDataInitObject);
    const [_, setProjectFormGlobalState] = useGlobalState('PROJECT_FORM', {
        formData: projectDataInitObject, errorState: errStateInitObject
    }, 'Publish');
    const errStateRef = useRef(errStateInitObject);
    // * ----- Project Type Selection ----- * //
    const prjTypeSltOptions = useMemo(() => prjTypes.map((type) => (_jsx(IonSelectOption, Object.assign({ value: type }, { children: type }), type))), []);
    // * ----- Project Mode Radio Selection ----- * //
    const prjModeRadios = useMemo(() => prjModes.map((mode) => (_jsxs(IonItem, Object.assign({ className: "Flex-grow" }, { children: [_jsx(IonLabel, { children: mode }), _jsx(IonRadio, { value: mode })] }), mode))), []);
    // * ----- Project Design Items Selection ----- * //
    const [allDesignItemsSelection, setAllDesignItemsSelection] = useState(Array(prjDesignItems.length).fill({}).map((_, idx) => ({ steps: Array(prjDesignItems[idx].steps.length).fill(false) })));
    const handleDesignItemSelectionChange = useCallback((which, event) => {
        const selections = event.detail.value;
        const newAllItemsSelectionState = allDesignItemsSelection.concat();
        newAllItemsSelectionState.forEach(elem => elem.steps = elem.steps.concat());
        newAllItemsSelectionState[which].steps.fill(false);
        selections.forEach((idx) => newAllItemsSelectionState[which].steps[idx] = true);
        setAllDesignItemsSelection(newAllItemsSelectionState);
        projectDataRef.current.designItems[which].steps = prjDesignItems[which].steps
            .filter((_, idx) => newAllItemsSelectionState[which].steps[idx]);
    }, [allDesignItemsSelection]);
    const prjDesignStepList = useMemo(() => prjDesignItems.map((item, itemIdx) => (_jsxs("div", Object.assign({ className: 'prj-design-item-wrapper' }, { children: [_jsxs(IonItem, Object.assign({ className: 'prj-design-item' }, { children: [_jsx(IonLabel, { children: item.name }), _jsx(IonSelect, Object.assign({ multiple: true, className: 'prj-design-select-steps', interface: 'popover', onIonChange: (event) => handleDesignItemSelectionChange(itemIdx, event), interfaceOptions: { cssClass: 'prj-design-select-popover' } }, { children: item.steps.map((step, stepIdx) => (_jsx(IonSelectOption, Object.assign({ className: 'prj-design-select-item-option', value: stepIdx }, { children: step }), stepIdx))) }))] })), _jsx(IonList, Object.assign({ className: 'prj-design-item-select-list' }, { children: item.steps
                    .filter((_, stepIdx) => allDesignItemsSelection[itemIdx].steps[stepIdx] === true)
                    .map((s) => (_jsx("p", Object.assign({ className: 'prj-design-selected-step' }, { children: s }), s))) }))] }), item.name))), [allDesignItemsSelection, handleDesignItemSelectionChange]);
    // * ----- Project Location Selection ----- * //
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState([105, 35]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const handleGeoSearch = useCallback((name, address, lonLat, zoomLevel) => {
        setMarkerPosition(lonLat);
        setAddress(address);
        setName(name);
        map.setZoom(zoomLevel);
        map.setCenter(lonLat);
        Object.assign(projectDataRef.current, { locationName: name, lonLat, address });
        Object.assign(errStateRef.current, { locationName: false, lonLat: false, address: false });
    }, [map]);
    // * ----- Submission ----- * //
    const handleProjectDataChange = useCallback((field, value, errState) => {
        const prjData = projectDataRef.current;
        prjData[field] = value;
        errStateRef.current[field] = errState;
    }, []);
    const history = useHistory();
    const handleSubmit = useCallback((ev) => {
        errStateRef.current.designItems =
            allDesignItemsSelection.find((item) => item.steps.includes(true)) === undefined;
        setProjectFormGlobalState({
            formData: projectDataRef.current,
            errorState: errStateRef.current
        });
        history.push('/publish/confirm');
        ev.preventDefault();
    }, [history, allDesignItemsSelection, setProjectFormGlobalState]);
    return (_jsxs(IonPage, { children: [_jsx(IonHeader, { children: _jsx(IonToolbar, { children: _jsx(IonTitle, { children: "\u9700\u6C42\u53D1\u5E03" }) }) }), _jsxs("form", Object.assign({ className: 'publish Full Scroll-area', onSubmit: handleSubmit }, { children: [_jsxs("section", Object.assign({ className: 'prj-name' }, { children: [_jsx(Heading, Object.assign({ className: 'prj-section-heading' }, { children: "\u9879\u76EE\u540D\u79F0" })), _jsx(Input, { className: 'prj-name-input', onChange: (ev, err) => { handleProjectDataChange('name', ev.currentTarget.value, err); }, placeholder: '\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0', validators: prjNameValidators })] })), _jsxs("section", Object.assign({ className: 'prj-type' }, { children: [_jsx(Heading, Object.assign({ className: 'prj-section-heading' }, { children: "\u9879\u76EE\u7C7B\u578B" })), _jsx(IonSelect, Object.assign({ className: 'prj-type-select', onIonChange: (ev) => {
                                    projectDataRef.current.type = ev.detail.value;
                                    errStateRef.current.type = false;
                                }, placeholder: '\u8BF7\u9009\u62E9\u9879\u76EE\u7C7B\u578B', interface: 'popover', okText: '\u9009\u62E9', cancelText: '\u53D6\u6D88' }, { children: prjTypeSltOptions })), _jsx(IonRadioGroup, Object.assign({ className: 'prj-mode-radio-group Flex', onIonChange: (ev) => {
                                    projectDataRef.current.mode = ev.detail.value;
                                    errStateRef.current.mode = false;
                                } }, { children: prjModeRadios }))] })), _jsxs("section", Object.assign({ className: 'prj-contact' }, { children: [_jsx(Heading, Object.assign({ className: 'prj-section-heading' }, { children: "\u9879\u76EE\u8054\u7CFB\u4EBA" })), _jsx(Input, { className: 'prj-contact-name', onChange: (ev, err) => { handleProjectDataChange('contactName', ev.currentTarget.value, err); }, validators: prjContactNameValidators, type: 'text', placeholder: '\u8BF7\u8F93\u5165\u8054\u7CFB\u4EBA\u59D3\u540D' }), _jsx(Input, { className: 'prj-contact-tel', onChange: (ev, err) => { handleProjectDataChange('contactTel', ev.currentTarget.value, err); }, validators: prjContactTelValidators, type: 'tel', placeholder: '\u7535\u8BDD\u53F7\u7801', prefixElem: _jsx("span", Object.assign({ className: 'prj-contact-tel-prefix' }, { children: "+86" })) })] })), _jsxs("section", Object.assign({ className: 'prj-budget' }, { children: [_jsx(Heading, Object.assign({ className: 'prj-section-heading' }, { children: "\u8BBE\u8BA1\u9884\u7B97" })), _jsx(Input, { className: 'prj-budget-input', type: 'number', placeholder: '\u8BF7\u8F93\u5165\u9879\u76EE\u9884\u7B97', onChange: (ev, err) => { handleProjectDataChange('budget', ev.currentTarget.value, err); }, suffixElem: _jsx("span", Object.assign({ className: 'prj-budget-input-suffix' }, { children: "\u4E07\u5143" })), validators: prjBudgetValidators })] })), _jsxs("section", Object.assign({ className: 'prj-steps' }, { children: [_jsx(Heading, Object.assign({ className: 'prj-section-heading' }, { children: "\u8BBE\u8BA1\u9636\u6BB5" })), _jsx(IonList, { children: prjDesignStepList })] })), _jsxs("section", Object.assign({ className: 'prj-location' }, { children: [_jsx(Heading, Object.assign({ className: 'prj-section-heading' }, { children: "\u9879\u76EE\u4F4D\u7F6E" })), _jsx(GeoSearch, { className: 'prj-location-search', onSearch: handleGeoSearch, map: map, placeholder: '\u8BF7\u8F93\u5165\u9879\u76EE\u5177\u4F53\u5730\u5740' }), _jsx("div", Object.assign({ className: 'prj-location-name' }, { children: name })), _jsx("div", Object.assign({ className: 'prj-location-address' }, { children: address })), _jsx(GeoMap, { className: 'prj-location-map', markerLonLat: markerPosition, onMapReady: (map) => { setMap(map); } })] })), _jsx(IonButton, Object.assign({ className: 'publish-btn', type: 'submit', expand: 'full', size: 'large', color: 'secondary' }, { children: "\u53D1\u5E03\u9879\u76EE\u9700\u6C42" }))] }))] }));
};
export default Publish;
