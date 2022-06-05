
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './help.scss';

const Help: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/main'></IonBackButton>
                    </IonButtons>
                    <IonTitle>帮助</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className='help'>
                这只是另一个帮助页
            </IonContent>
        </IonPage>
    )
};

export default Help;