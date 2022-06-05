import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonPage, IonBackButton, IonList, IonItem, useIonAlert } from "@ionic/react";

import { backspace } from 'ionicons/icons';
import { AlertOptions } from "@ionic/react";


// interfaces

// stylesheet
import './confirm.scss';
import { useGlobalState } from "../hooks/globalState";
import { ProjectForm } from "../types";
import ProjectInfo from "../components/projectInfo";

import { projectFormItemKeyToName } from '../utils/projectUtils';
import { useCallback } from "react";
import { ajaxPostProject } from "../utils/ajaxUtils";
import { useHistory } from "react-router";


const Confirm: React.FC = () => {

    const [{ errorState, formData }, _] = useGlobalState<ProjectForm>('PROJECT_FORM', {
        errorState: null,
        formData: null
    }, 'Confirm');

    const formOnError = Object.values(errorState || { err: true }).includes(true);

    const [presentAlert] = useIonAlert();

    const history = useHistory();

    const handleConfirmSubmit = useCallback(async () => {
        try {
            var res = await ajaxPostProject(formData);
        } catch (err) {
            console.log(err);
        }

        const alertButtons: AlertOptions['buttons'] = [
            { text: '确定', handler: () => { history.goBack(); } },
        ];

        presentAlert({
            cssClass: 'confirm-alert',
            buttons: alertButtons,
            header: `提交${res.success ? '成功' : '失败'}`,
            message: res.success ? '您的需求信息将立即可见' : '请联系管理员',
        })
    }, [formData, history, presentAlert]);

    return (
        <IonPage className="confirm">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>提交需求内容</IonTitle>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref="/publish">
                            <IonIcon icon={backspace}></IonIcon>
                        </IonBackButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={handleConfirmSubmit}
                            className="confirm-btn" disabled={formOnError}>
                            确认提交
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className="content Full Scroll-area" >
                <section className="error-hint" data-show={formOnError}>
                    <div className="error-message">您还未正确填写的需求项：</div>
                    <IonList className="error-list">{
                        Object.entries(errorState || {})
                            .filter((elem) => elem[1] === true && projectFormItemKeyToName[elem[0]] !== undefined)
                            .map((elem) => (
                                <IonItem key={elem[0]}>
                                    {projectFormItemKeyToName[elem[0]]}
                                </IonItem>
                            ))
                    }</IonList>
                </section>
                <section className="info">
                    <div className="info-heading">项目需求信息：</div>
                    <ProjectInfo project={formData} />
                </section>
            </div>
        </IonPage>
    );
}

export default Confirm;