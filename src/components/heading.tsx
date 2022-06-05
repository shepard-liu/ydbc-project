import React, { FunctionComponent } from 'react';
import { HTMLElemAttr } from '../types';

// Components

// Interfaces

// Stylesheet
import './heading.scss';

export interface HeadingProps extends HTMLElemAttr<HTMLDivElement> {
    className?: string,
}

const Heading: FunctionComponent<HeadingProps> = React.forwardRef<HTMLDivElement, HeadingProps>((props, ref) => {
    const { className, ...otherProps } = props;

    return (
        <div ref={ref} className={`heading ${className || ''}`} {...otherProps} />
    );
});

export default Heading;