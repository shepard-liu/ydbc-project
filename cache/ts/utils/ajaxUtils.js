var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
const ajax = axios.create({
    baseURL: 'http://localhost:3001/api/v1/',
});
export function ajaxGetAllProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield ajax.get('projects');
    });
}
export function ajaxGetProjectById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new Error('ajax: must provide an id to query specific project.');
        return yield ajax.get(`projects/${id}`);
    });
}
export function ajaxPostProject(prj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!prj)
            throw new Error('ajax: must provide an project object');
        return (yield ajax.post(`projects`, prj)).success;
    });
}
