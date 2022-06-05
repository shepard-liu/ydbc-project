var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useMemo, useRef, useState } from 'react';
// Stylesheet
import './input.scss';
export const Input = React.forwardRef((props, ref) => {
    const { className, onChange, onInput, validators, patterns, prefixElem, suffixElem, onBeforeInput } = props, otherProps = __rest(props, ["className", "onChange", "onInput", "validators", "patterns", "prefixElem", "suffixElem", "onBeforeInput"]);
    const [validatorState, setValidatorState] = useState({
        errorStates: Array(validators === null || validators === void 0 ? void 0 : validators.length).fill(false)
    });
    // Check if the length of validators has changed
    if (validators && validatorState.errorStates.length !== validators.length) {
        // Update the length
        setValidatorState({
            errorStates: Array(validators === null || validators === void 0 ? void 0 : validators.length).fill(false)
        });
    }
    // Enhance validation functionality of html input element
    const handleChange = useCallback((ev) => {
        const errStates = validatorState.errorStates.concat();
        // Do validation
        let errorStateChanged = false, onError = false;
        for (let idx = 0; idx < (validators === null || validators === void 0 ? void 0 : validators.length); ++idx) {
            let v = validators[idx];
            let vf = v.validateFunctionOrPattern;
            let vOnErr = false;
            if (vf instanceof RegExp)
                vOnErr = !vf.test(ev.currentTarget.value);
            else if (vf instanceof Function)
                vOnErr = !vf(ev.currentTarget.value);
            else
                throw new Error('The validator function or pattern cannot be null or undefined');
            if (vOnErr)
                onError = true;
            if (vOnErr !== errStates[idx]) {
                errorStateChanged = true;
                errStates[idx] = vOnErr;
            }
        }
        // Rerender if error states changed
        if (errorStateChanged)
            setValidatorState({ errorStates: errStates });
        console.log("Input:InputChange, err:", onError);
        if (onChange)
            onChange(ev, onError);
    }, [onChange, validators, validatorState]);
    const lastValRef = useRef('');
    // "Remember" the current value before input
    const handleBeforeInput = useCallback((ev) => {
        lastValRef.current = ev.currentTarget.value;
        if (onBeforeInput)
            onBeforeInput(ev);
    }, [onBeforeInput]);
    // Enhance pattern restriction of the html input.
    const handleInput = useCallback((ev) => {
        if (!patterns)
            return;
        const newValue = ev.currentTarget.value;
        for (const p of patterns) {
            if (p instanceof RegExp === false)
                throw new Error('Invalid pattern to test the input value');
            if (!p.test(newValue)) {
                ev.currentTarget.value = lastValRef.current;
                return;
            }
        }
        if (onInput)
            onInput(ev);
    }, [onInput, patterns]);
    const errorMessagePart = useMemo(() => {
        const validatorsInError = (validators === null || validators === void 0 ? void 0 : validators.filter((elem, idx) => validatorState.errorStates[idx] === true && elem.errorMessage)) || [];
        return (_jsx("div", Object.assign({ className: `error-messages`, "data-active": validatorsInError.length !== 0 }, { children: validatorsInError.map((elem) => (_jsx("div", { children: elem.errorMessage }, elem.id))) })));
    }, [validatorState.errorStates, validators]);
    return (_jsxs("div", Object.assign({ className: `input ${className || ''}`, ref: ref }, { children: [_jsxs("div", Object.assign({ className: 'input-wrapper Flex' }, { children: [_jsx("div", Object.assign({ className: 'prefix' }, { children: prefixElem })), _jsx("input", Object.assign({ className: 'the-input Flex-grow', onChange: handleChange, onBeforeInput: handleBeforeInput, onInput: handleInput }, otherProps)), _jsx("div", Object.assign({ className: 'suffix' }, { children: suffixElem }))] })), errorMessagePart] })));
});
