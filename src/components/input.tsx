import React, { useCallback, useMemo, useRef, useState } from 'react';

// Components

// Interfaces
import { HTMLInputElemAttr } from "../types";

// Stylesheet
import './input.scss';

interface __Validator {
    id: React.Key;
    validateFunctionOrPattern: RegExp | ((value: string) => boolean);
    errorMessage?: string;
}

interface __Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {

    /**
     * Change event emmited after validation.
     * 
     * An extra parameter is provided to parse the validation state.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, errState: boolean) => void;

    /**
     * Input validators. An unique id for every validator must be provided.
     * 
     * The given validate function or pattern will be used to validate the input
     * whenever a input change happens.
     * 
     * Optionally, an error message will be displayed if a validation fails.
     */
    validators?: __Validator[];

    /**
     * A list of patterns that the value should match.
     * 
     * The incoming input character will be discarded if the pattern validation fails.
     */
    patterns?: RegExp[],

    /**
     * Element to place before the input area.
     */
    prefixElem?: React.ReactElement;

    /**
     * Element to place after the input area.
     */
    suffixElem?: React.ReactElement;

}

export const Input = React.forwardRef<HTMLInputElement, Input.Props>((props, ref) => {
    const {
        className,
        onChange,
        onInput,
        validators,
        patterns,
        prefixElem,
        suffixElem,
        onBeforeInput,
        ...otherProps
    } = props;

    const [validatorState, setValidatorState] = useState<{ errorStates: boolean[] }>({
        errorStates: Array(validators?.length).fill(false)
    });

    // Check if the length of validators has changed
    if (validators && validatorState.errorStates.length !== validators.length) {
        // Update the length
        setValidatorState({
            errorStates: Array(validators?.length).fill(false)
        });
    }

    // Enhance validation functionality of html input element
    const handleChange = useCallback<HTMLInputElemAttr<HTMLInputElement>['onChange']>((ev) => {
        const errStates = validatorState.errorStates.concat();
        // Do validation
        let errorStateChanged = false, onError = false;
        for (let idx = 0; idx < validators?.length; ++idx) {
            let v = validators[idx];
            let vf = v.validateFunctionOrPattern;

            let vOnErr = false;

            if (vf instanceof RegExp) vOnErr = !vf.test(ev.currentTarget.value);
            else if (vf instanceof Function) vOnErr = !vf(ev.currentTarget.value);
            else throw new Error('The validator function or pattern cannot be null or undefined');

            if (vOnErr) onError = true;

            if (vOnErr !== errStates[idx]) {
                errorStateChanged = true;
                errStates[idx] = vOnErr;
            }
        }
        // Rerender if error states changed
        if (errorStateChanged)
            setValidatorState({ errorStates: errStates });

        console.log("Input:InputChange, err:", onError);

        if (onChange) onChange(ev, onError);
    }, [onChange, validators, validatorState]);

    const lastValRef = useRef<string>('');

    // "Remember" the current value before input
    const handleBeforeInput = useCallback<HTMLInputElemAttr<HTMLInputElement>['onInput']>((ev) => {
        lastValRef.current = ev.currentTarget.value;

        if (onBeforeInput) onBeforeInput(ev);
    }, [onBeforeInput]);

    // Enhance pattern restriction of the html input.
    const handleInput = useCallback<HTMLInputElemAttr<HTMLInputElement>['onInput']>((ev) => {
        if (!patterns) return;
        const newValue = ev.currentTarget.value;

        for (const p of patterns) {
            if (p instanceof RegExp === false) throw new Error('Invalid pattern to test the input value');
            if (!p.test(newValue)) {
                ev.currentTarget.value = lastValRef.current;
                return;
            }
        }

        if (onInput) onInput(ev);
    }, [onInput, patterns]);

    const errorMessagePart = useMemo(() => {
        const validatorsInError = validators?.filter((elem, idx) => validatorState.errorStates[idx] === true && elem.errorMessage) || [];
        return (
            <div className={`error-messages`} data-active={validatorsInError.length !== 0}>{
                validatorsInError.map((elem) => (
                    <div key={elem.id}>{elem.errorMessage}</div>
                ))
            }</div>
        )
    }, [validatorState.errorStates, validators]);

    return (
        <div className={`input ${className || ''}`} ref={ref}>
            <div className='input-wrapper Flex'>
                <div className='prefix'>{prefixElem}</div>
                <input className='the-input Flex-grow' onChange={handleChange} onBeforeInput={handleBeforeInput}
                    onInput={handleInput} {...otherProps} />
                <div className='suffix'>{suffixElem}</div>
            </div>
            {errorMessagePart}
        </div>
    );
});

// eslint-disable-next-line
export namespace Input {
    export type Props = __Props;
    export type Validator = __Validator;
}