import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Input } from "../components/input"
import './input.stories.scss';

export default {
    title: "Input",
    component: Input
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
    return (
        <Input {...args} className="__input"></Input>
    );
}

export const ValidatePhoneNumber = Template.bind({}) as ComponentStory<typeof Input>;
ValidatePhoneNumber.args = {
    patterns: [/^[0-9]*$/],
    validators: [
        {
            id: '1',
            errorMessage: 'Invalid phone number.',
            validateFunctionOrPattern: /^[0-9]{11}$/
        }
    ]
};