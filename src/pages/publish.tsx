import { IonButton, IonHeader, IonItem, IonLabel, IonList, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar, SelectChangeEventDetail } from '@ionic/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import GeoMap from '../components/geoMap';

import GeoSearch, { GeoSearchProps } from '../components/geoSearch';
import Heading from '../components/heading';
import { Input } from '../components/input';
import { useGlobalState } from '../hooks/globalState';
import { HTMLElemAttr, Project, ProjectForm } from '../types';
import { useHistory } from 'react-router';


import './publish.scss';

// *----- Input Validators -----* //

const validateEmpty: Input.Validator['validateFunctionOrPattern'] =
	(value) => value.length !== 0;

const prjNameValidators: Input.Validator[] = [
	{
		id: '1',
		validateFunctionOrPattern: validateEmpty,
		errorMessage: "项目名称不能为空",
	}
];

const prjBudgetValidators: Input.Validator[] = [
	{
		id: '1',
		validateFunctionOrPattern: validateEmpty,
		errorMessage: "预算不能为空"
	}
]

const prjContactNameValidators: Input.Validator[] = [
	{
		id: '1',
		validateFunctionOrPattern: validateEmpty,
		errorMessage: "联系人姓名不能为空"
	}
]

const prjContactTelValidators: Input.Validator[] = [
	{
		id: '1',
		validateFunctionOrPattern: validateEmpty,
		errorMessage: "联系人电话不能为空"
	}, {
		id: '2',
		validateFunctionOrPattern: /^[0-9]{11}$/,
		errorMessage: "请输入正确的电话号码"
	}
]

// * ----- Prerender Information ----- * //

// Project type
type ProjectType = '水利水电' | '测绘工程' | '房屋修缮' | '开垦荒地' | '建筑施工' | '其他类型';
const prjTypes: ProjectType[] = ['水利水电', '测绘工程', '房屋修缮', '开垦荒地', '建筑施工', '其他类型'];

// Project mode
type ProjectMode = '固定设计费' | '报价竞标';
const prjModes: ProjectMode[] = ['固定设计费', '报价竞标'];

// Project design items
type ProjectDesignItem = {
	name: string,
	steps: string[],
}
const prjDesignItems: ProjectDesignItem[] = [
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

const projectDataInitObject: Project = {
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

const errStateInitObject: Record<keyof Project, boolean> = {
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
}


const Publish: React.FC = () => {

	const projectDataRef = useRef(projectDataInitObject);
	const [_, setProjectFormGlobalState] = useGlobalState<ProjectForm>('PROJECT_FORM', {
		formData: projectDataInitObject, errorState: errStateInitObject
	}, 'Publish');

	const errStateRef = useRef(errStateInitObject);

	// * ----- Project Type Selection ----- * //

	const prjTypeSltOptions = useMemo(() => prjTypes.map((type) => (
		<IonSelectOption key={type} value={type}>{type}</IonSelectOption>
	)), []);

	// * ----- Project Mode Radio Selection ----- * //

	const prjModeRadios = useMemo(() => prjModes.map((mode) => (
		<IonItem key={mode} className="Flex-grow">
			<IonLabel>{mode}</IonLabel>
			<IonRadio value={mode}></IonRadio>
		</IonItem>
	)), []);

	// * ----- Project Design Items Selection ----- * //

	const [allDesignItemsSelection, setAllDesignItemsSelection] = useState<Array<{ steps: boolean[] }>>(
		Array(prjDesignItems.length).fill({}).map((_, idx) => ({ steps: Array(prjDesignItems[idx].steps.length).fill(false) }))
	);

	const handleDesignItemSelectionChange = useCallback((which: number, event: CustomEvent<SelectChangeEventDetail<number[]>>) => {
		const selections = event.detail.value as number[];
		const newAllItemsSelectionState = allDesignItemsSelection.concat();
		newAllItemsSelectionState.forEach(elem => elem.steps = elem.steps.concat());
		newAllItemsSelectionState[which].steps.fill(false);
		selections.forEach((idx) => newAllItemsSelectionState[which].steps[idx] = true);

		setAllDesignItemsSelection(newAllItemsSelectionState);
		projectDataRef.current.designItems[which].steps = prjDesignItems[which].steps
			.filter((_, idx) => newAllItemsSelectionState[which].steps[idx]);
	}, [allDesignItemsSelection]);

	const prjDesignStepList = useMemo(() => prjDesignItems.map((item, itemIdx) => (
		<div key={item.name} className='prj-design-item-wrapper'>
			<IonItem className='prj-design-item'>
				<IonLabel>{item.name}</IonLabel>
				<IonSelect multiple className='prj-design-select-steps' interface='popover'
					onIonChange={(event) => handleDesignItemSelectionChange(itemIdx, event)}
					interfaceOptions={{ cssClass: 'prj-design-select-popover' }}>
					{
						item.steps.map((step, stepIdx) => (
							<IonSelectOption className='prj-design-select-item-option' key={stepIdx} value={stepIdx}>{step}</IonSelectOption>
						))
					}
				</IonSelect>
			</IonItem>
			<IonList className='prj-design-item-select-list'>{
				item.steps
					.filter((_, stepIdx) => allDesignItemsSelection[itemIdx].steps[stepIdx] === true)
					.map((s) => (<p key={s} className='prj-design-selected-step'>{s}</p>))
			}</IonList>
		</div>
	)), [allDesignItemsSelection, handleDesignItemSelectionChange]);

	// * ----- Project Location Selection ----- * //

	const [map, setMap] = useState<any>(null);
	const [mapZoom, setMapZoom] = useState<number>(1);
	const [markerPosition, setMarkerPosition] = useState<[number, number]>([105, 35]);
	const [name, setName] = useState<string>('');
	const [address, setAddress] = useState<string>('');

	const handleGeoSearch = useCallback<GeoSearchProps['onSearch']>((name, address, lonLat, zoomLevel) => {
		setMarkerPosition(lonLat);
		setAddress(address);
		setName(name);
		setMapZoom(zoomLevel);
		Object.assign<Project, Partial<Project>>(projectDataRef.current, { locationName: name, lonLat, address });
		Object.assign<typeof errStateRef.current, Partial<typeof errStateRef.current>>(
			errStateRef.current,
			{ locationName: false, lonLat: false, address: false }
		);
	}, []);

	// * ----- Submission ----- * //

	const handleProjectDataChange = useCallback((field: keyof Project, value: any, errState: boolean) => {
		const prjData = projectDataRef.current;
		prjData[field] = value;
		errStateRef.current[field] = errState;
	}, []);

	const history = useHistory();

	const handleSubmit = useCallback<HTMLElemAttr<HTMLFormElement>['onSubmit']>((ev) => {
		errStateRef.current.designItems =
			allDesignItemsSelection.find((item) => item.steps.includes(true)) === undefined;

		setProjectFormGlobalState({
			formData: projectDataRef.current,
			errorState: errStateRef.current
		});
		history.push('/publish/confirm');

		ev.preventDefault();
	}, [history, allDesignItemsSelection, setProjectFormGlobalState]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>需求发布</IonTitle>
				</IonToolbar>
			</IonHeader>
			<form className='publish Full Scroll-area' onSubmit={handleSubmit}>
				<section className='prj-name'>
					<Heading className='prj-section-heading'>项目名称</Heading>
					<Input className='prj-name-input'
						onChange={(ev, err) => { handleProjectDataChange('name', ev.currentTarget.value, err); }}
						placeholder='请输入项目名称' validators={prjNameValidators}></Input>
				</section>
				<section className='prj-type'>
					<Heading className='prj-section-heading'>项目类型</Heading>
					<IonSelect className='prj-type-select' onIonChange={(ev) => {
						projectDataRef.current.type = ev.detail.value;
						errStateRef.current.type = false;
					}}
						placeholder='请选择项目类型' interface='popover' okText='选择' cancelText='取消'>
						{prjTypeSltOptions}
					</IonSelect>
					<IonRadioGroup className='prj-mode-radio-group Flex'
						onIonChange={(ev) => {
							projectDataRef.current.mode = ev.detail.value;
							errStateRef.current.mode = false;
						}}>
						{prjModeRadios}
					</IonRadioGroup>
				</section>
				<section className='prj-contact'>
					<Heading className='prj-section-heading'>项目联系人</Heading>
					<Input className='prj-contact-name'
						onChange={(ev, err) => { handleProjectDataChange('contactName', ev.currentTarget.value, err); }}
						validators={prjContactNameValidators} type='text' placeholder='请输入联系人姓名'></Input>
					<Input className='prj-contact-tel'
						onChange={(ev, err) => { handleProjectDataChange('contactTel', ev.currentTarget.value, err); }}
						validators={prjContactTelValidators} type='tel' placeholder='电话号码'
						prefixElem={<span className='prj-contact-tel-prefix'>+86</span>}>
					</Input>
				</section>
				<section className='prj-budget'>
					<Heading className='prj-section-heading'>设计预算</Heading>
					<Input className='prj-budget-input' type='number' placeholder='请输入项目预算'
						onChange={(ev, err) => { handleProjectDataChange('budget', ev.currentTarget.value, err); }}
						suffixElem={<span className='prj-budget-input-suffix'>万元</span>}
						validators={prjBudgetValidators}></Input>
				</section>
				<section className='prj-steps'>
					<Heading className='prj-section-heading'>设计阶段</Heading>
					<IonList>{prjDesignStepList}</IonList>
				</section>
				<section className='prj-location'>
					<Heading className='prj-section-heading'>项目位置</Heading>
					<GeoSearch className='prj-location-search'
						onSearch={handleGeoSearch} map={map} placeholder='请输入项目具体地址' />
					<div className='prj-location-name'>{name}</div>
					<div className='prj-location-address'>{address}</div>
					<GeoMap className='prj-location-map' markers={[markerPosition]}
						zoomLevel={mapZoom}
						center={markerPosition} onMapReady={(map) => { setMap(map); }} />
				</section>
				<IonButton className='publish-btn' type='submit' expand='full' size='large' color='secondary'>
					发布项目需求
				</IonButton>
			</form>
		</IonPage >
	);
};

export default Publish;
