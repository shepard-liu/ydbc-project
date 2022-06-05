import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { backspace, map } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import GeoMap from '../components/geoMap';
import ProjectInfo from '../components/projectInfo';
import { ProjectWithTime } from '../types';
import { ajaxGetProjectById } from '../utils/ajaxUtils';

// Components

// Interfaces

// Stylesheet
import './projectPage.scss';

const ProjectPage: React.FC = () => {
    const [projectData, setProjectData] = useState<ProjectWithTime>(null);

    const params = useParams<{ prjId: string }>();

    const history = useHistory();

    useEffect(() => {
        ajaxGetProjectById(Number(params.prjId))
            .then((data) => {
                setProjectData(data);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
                history.goBack();
            });
    }, [history, params.prjId]);

    const [zoomLevel, setZoomLevel] = useState<number>(15);

    const handleMapReady = useCallback(() => {
        setZoomLevel(16);
        console.log('Project Page', params.prjId, ": Map ready");
    }, []);

    return (
        <IonPage className='project'>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        <span className='title'>{projectData?.name}</span>
                        <span className='id'>#{projectData?.id}</span>
                    </IonTitle>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref="/explore">
                            <IonIcon icon={backspace}></IonIcon>
                        </IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='content Full Scroll-area'>
                <ProjectInfo project={projectData}></ProjectInfo>
                <div className='map-wrapper'>
                    <GeoMap className='map' onMapReady={handleMapReady} zoomLevel={zoomLevel}
                        markers={projectData?.lonLat ? [projectData.lonLat] : []}
                        center={projectData?.lonLat}></GeoMap>
                </div>
            </div>
        </IonPage>
    );
};

export default ProjectPage;