import React, { useMemo, useRef } from 'react';
import { HTMLElemAttr, ProjectWithTime } from '../types';
import { projectFormItemKeyToName } from '../utils/projectUtils';

// Components
import { gridOutline, timeOutline, pricetagOutline, settingsOutline, personCircleOutline, callOutline, cardOutline, layersOutline, locationOutline } from 'ionicons/icons';

// Interfaces

// Stylesheet
import './projectInfo.scss';
import { IonIcon, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';

export interface ProjectInfoProps extends HTMLElemAttr<HTMLDivElement> {
    project: Partial<ProjectWithTime>;
}

const defaultMapFunc = (value) => value;
const projectItemNameMapper: Record<keyof ProjectWithTime, { icon: string, mapFunc?: (value: any) => any }> = {
    name: { icon: gridOutline, mapFunc: defaultMapFunc },
    publishTime: { icon: timeOutline, mapFunc: (value) => new Date(value).toLocaleDateString() },
    type: { icon: pricetagOutline, mapFunc: defaultMapFunc },
    mode: { icon: settingsOutline, mapFunc: defaultMapFunc },
    contactName: { icon: personCircleOutline, mapFunc: defaultMapFunc },
    contactTel: { icon: callOutline, mapFunc: defaultMapFunc },
    budget: { icon: cardOutline, mapFunc: (value) => `${value} 万元` },
    designItems: { icon: layersOutline, mapFunc: defaultMapFunc },
    address: { icon: locationOutline, mapFunc: defaultMapFunc },
}

const ProjectInfo: React.FC<ProjectInfoProps> = React.forwardRef<HTMLDivElement, ProjectInfoProps>((props, ref) => {
    const { className, project, ...otherProps } = props;

    let isDesignItemsEmpty = useRef<boolean>(true);

    const designItemsRender = useMemo(() =>
        project
            ? (<IonList key='designItems' className='design-item-list'>
                <IonListHeader className='design-item-list-header'>
                    <IonIcon className='project-item-icon' icon={layersOutline}></IonIcon>
                    设计阶段
                </IonListHeader>
                {
                    project.designItems.map((item) => (
                        <IonItem key={item.name} className='design-item'>
                            <IonLabel>{item.name}</IonLabel>
                            <div className='design-item-steps'>{
                                item.steps.map((step) => {
                                    if (step) isDesignItemsEmpty.current = false;
                                    return <div className='' key={step}>{step}</div>;
                                })
                            }</div>
                        </IonItem>))
                }
            </IonList>)
            : null
        , [project]);

    return (
        <div className={`project-info  ${className || ''}`} ref={ref} {...otherProps}>
            <IonList>{
                project
                    ? Object.keys(projectItemNameMapper).map((key) => {
                        const detail = (key === 'designItems')
                            ? designItemsRender
                            : (<IonItem key={key} className='project-item'>
                                <IonIcon className='project-item-icon' icon={projectItemNameMapper[key].icon}></IonIcon>
                                <IonLabel className='project-item-label'>{projectFormItemKeyToName[key]}</IonLabel>
                                <div className='project-item-content Line-clamp-1'>{
                                    projectItemNameMapper[key].mapFunc(project[key])
                                }</div>
                            </IonItem>);
                        let isItemEmpty = (key === 'designItems'
                            ? isDesignItemsEmpty.current
                            : (project[key] === null || project[key] === undefined));
                        return (
                            isItemEmpty
                                ? null
                                : detail
                        )
                    })
                    : null
            }</IonList>
        </div>
    );
});

export default ProjectInfo;