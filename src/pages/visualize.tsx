import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import GeoMap, { GeoMapMarker } from '../components/geoMap';
import { ProjectWithTime } from '../types';
import { ajaxGetAllProjects } from '../utils/ajaxUtils';
import { refreshOutline } from 'ionicons/icons';
import './visualize.scss';

const Visualize: React.FC = () => {

    const [projectList, setProjectList] = useState<ProjectWithTime[]>([]);


    const fetchUpdate = useCallback(() => {
        ajaxGetAllProjects().then((data) => {
            setProjectList(data.sort((a, b) => b.publishTime - a.publishTime));
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        fetchUpdate();
    }, [fetchUpdate]);

    const projectMarkers: GeoMapMarker[] = useMemo(() => {
        console.log("Visualize: Fetched update and regenerating map markers.");
        return projectList.map((prj) => ({
            name: prj.name,
            position: prj.lonLat,
            label: prj.name
        }));
    }, [projectList]);

    const handleRefresh = useCallback(() => {
        fetchUpdate();
    }, [fetchUpdate]);

    return (
        <IonPage className='visualize'>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>地图展示</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton onClick={handleRefresh}>
                            <span>刷新</span>
                            <IonIcon icon={refreshOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <GeoMap className='map' zoomLevel={1} markers={projectMarkers}></GeoMap>
            </IonContent>
        </IonPage>
    );
};

export default Visualize;
