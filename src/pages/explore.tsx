import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { ProjectWithTime } from '../types';
import { ajaxGetAllProjects } from '../utils/ajaxUtils';
import { person, time } from 'ionicons/icons';

import './explore.scss';

const Explore: React.FC = () => {

	const [projectList, setProjectList] = useState<ProjectWithTime[]>([]);
	const [refreshing, setRefreshing] = useState<boolean>(false);

	const fetchInterval = useRef<any>(null);

	useEffect(() => {
		const fetchUpdate = () => {
			setRefreshing(true);
			ajaxGetAllProjects().then((data) => {
				setProjectList(data.sort((a, b) => b.publishTime - a.publishTime));
				setTimeout(() => setRefreshing(false), 1000);
			}).catch((err) => {
				console.log(err);
			})
		};

		fetchInterval.current = setInterval(fetchUpdate, 4500);
		fetchUpdate();

		return () => {
			clearInterval(fetchInterval.current);
		};
	}, []);

	return (
		<IonPage className='explore'>
			<IonHeader>
				<IonToolbar>
					<IonTitle>浏览需求</IonTitle>
					<IonItem className='refreshing-hint' slot='end' data-active={refreshing}>
						正在获取最新需求列表...
					</IonItem>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen >
				<IonList>{
					projectList.map((elem) => (
						<IonCard className='card' key={elem.id} routerLink={`/explore/${elem.id}`}>
							<IonCardHeader className='card-header'>
								<IonCardTitle className='card-title'>{elem.name}</IonCardTitle>
								<IonCardSubtitle className='card-subtitle'>{elem.locationName}</IonCardSubtitle>
								<div className='card-budget'>¥{elem.budget} 万元</div>
							</IonCardHeader>
							<IonCardContent className='card-content'>
								<IonItem className='card-item'>
									<IonIcon className='card-icon' icon={person}></IonIcon>
									<IonLabel className='card-label'>{elem.contactName}</IonLabel>
								</IonItem>
								<IonItem className='card-item'>
									<IonIcon className='card-icon' icon={time}></IonIcon>
									<IonLabel className='card-label'>{new Date(elem.publishTime).toLocaleDateString()}</IonLabel>
								</IonItem>
							</IonCardContent>
						</IonCard>
					))
				}</IonList>
			</IonContent>
		</IonPage>
	);
};

export default Explore;
