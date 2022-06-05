import { Redirect, Route } from 'react-router-dom';
import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	setupIonicReact
} from '@ionic/react';
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
import ProjectPage from './pages/projectPage';

setupIonicReact();

const App: React.FC = () => {

	return (
		<IonApp>
			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						<Route exact path="/main">
							<Main />
						</Route>
						<Route exact path="/main/help">
							<Help />
						</Route>
						<Route exact path="/publish">
							<Publish />
						</Route>
						<Route exact path="/publish/confirm">
							<Confirm />
						</Route>
						<Route exact path="/explore">
							<Explore />
						</Route>
						<Route exact path="/explore/:prjId">
							<ProjectPage />
						</Route>
						<Route exact path="/visualize">
							<Visualize />
						</Route>
						<Route exact path="/">
							<Redirect to="/main" />
						</Route>
					</IonRouterOutlet>
					<IonTabBar slot="bottom">
						<IonTabButton tab="main" href="/main">
							<IonIcon icon={home} />
							<IonLabel>首页</IonLabel>
						</IonTabButton>
						<IonTabButton tab="publish" href="/publish">
							<IonIcon icon={cloudUpload} />
							<IonLabel>需求发布</IonLabel>
						</IonTabButton>
						<IonTabButton tab="explore" href="/explore">
							<IonIcon icon={search} />
							<IonLabel>浏览需求</IonLabel>
						</IonTabButton>
						<IonTabButton tab="visualize" href="/visualize">
							<IonIcon icon={map} />
							<IonLabel>地图展示</IonLabel>
						</IonTabButton>
					</IonTabBar>
				</IonTabs>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
