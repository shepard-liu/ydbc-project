import { AxiosResponse } from "axios";
import React, { HTMLAttributes } from "react";

export type HTMLElemAttr<E> = React.DetailedHTMLProps<HTMLAttributes<E>, E>;
export type HTMLInputElemAttr<E> = React.InputHTMLAttributes<E>;
export type ForwardRefComponent<P, E> = React.ForwardRefExoticComponent<P & React.RefAttributes<E>>;
export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface Project {
    [idx: string]: any;
    id?: number;
    name: string,
    contactName: string,
    contactTel: string,
    budget: number,
    type: '水利水电' | '测绘工程' | '房屋修缮' | '开垦荒地' | '建筑施工' | '其他类型';
    mode: '固定设计费' | '报价竞标';
    designItems: { name: string, steps: string[] }[],
    lonLat: [number, number],
    locationName: string,
    address: string,
}

export interface ProjectWithTime extends Project {
    publishTime: number;
}


export interface PostResponse {
    success: boolean,
    message: string,
}

export interface PostProjectResponse extends PostResponse {
    id: string;
}

type GetProjectResponse = { id: string, json: string };
type GetAllProjectsResponse = GetProjectResponse[];

export interface ProjectForm {
    formData: Project,
    errorState: Record<keyof Project, boolean>;
}