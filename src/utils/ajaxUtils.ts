import axios, { AxiosResponse } from 'axios';
import { GetAllProjectsResponse, GetProjectResponse, PostProjectResponse, Project, ProjectWithTime } from '../types';

const ajax = axios.create({
    baseURL: 'http://shepsword.xyz:3001/api/v1/',
})

function rebuildProjectData(data: GetProjectResponse): ProjectWithTime {
    return {
        id: data.id,
        ...JSON.parse(data.json)
    };
}

export async function ajaxGetAllProjects() {
    const data = (await ajax.get<{}, AxiosResponse<GetAllProjectsResponse>>('projects')).data;
    return data.map((elem) => rebuildProjectData(elem));
}

export async function ajaxGetProjectById(id: number) {
    if (!id) throw new Error('ajax: must provide an id to query specific project.');
    return rebuildProjectData((await ajax.get<{}, AxiosResponse<GetProjectResponse>>(`projects/${id}`)).data);
}

export async function ajaxPostProject(prj: Project) {
    if (!prj) throw new Error('ajax: must provide an project object');
    return (await ajax.post<{}, AxiosResponse<PostProjectResponse>, Project>(`projects`, prj)).data;
}