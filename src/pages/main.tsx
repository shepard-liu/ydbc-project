import { IonIcon, IonItem, IonPage } from '@ionic/react';
import { cloudUpload, search, help } from 'ionicons/icons';
import { useCallback } from 'react';
import { HTMLElemAttr } from '../types';
import { } from '@ionic/react-router';
import './main.scss';
import { Link } from 'react-router-dom';

const shortcuts: { path: string, name: string, icon: string }[] = [
	{ path: '/publish', name: '发布', icon: cloudUpload },
	{ path: '/explore', name: '浏览', icon: search },
	{ path: '/main/help', name: '帮助', icon: help },
];

const Main: React.FC = () => {
	return (
		<IonPage>
			<div className='main Full Flex-col'>
				<div className='heading'>需求管理平台</div>
				<div className='shortcuts Flex-col-center Flex-grow'>{
					shortcuts.map((elem) => (
						<Link className='shortcut-item Flex-center' key={elem.name} to={elem.path}>
							<IonIcon icon={elem.icon} />
							<span>{elem.name}</span>
						</Link>
					))
				}</div>
			</div>
		</IonPage>
	);
};

export default Main;
