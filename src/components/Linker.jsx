import React, { cloneElement, isValidElement } from 'react';
import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

const linker = new LinkifyIt();
linker.tlds(tlds);

function Linker({ children, ...props }) {
    return (<>{parse(children, props)}</>);
}

export default Linker;

function parse(children, props, key = 0) {
    if (typeof children === 'string') {
        return parseString(children, props);
    } else if (isValidElement(children) && (children.type !== 'a') && (children.type !== 'button')) {
        return cloneElement(children, { key: key }, parse(children.props.children, props));
    } else if (Array.isArray(children, props)) {
        return children.map((child, i) => parse(child, props, i));
    }
    return children;
}

function parseString(string, props) {
    if (string === '') {
        return string;
    }

    const matches = linker.match(string);
    if (!matches) {
        return string;
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match, i) => {
        if (match.index > lastIndex) {
            elements.push(string.substring(lastIndex, match.index));
        }

        elements.push(<a href={match.url} {...props} key={`${match.index}-${match.url}`}>{match.text}</a>);

        lastIndex = match.lastIndex;
    });

    if (string.length > lastIndex) {
        elements.push(string.substring(lastIndex));
    }

    return (elements.length === 1) ? elements[0] : elements;
}