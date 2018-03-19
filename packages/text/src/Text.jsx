import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Link = ({ children, ...props }) => (
    <a {...props} target="_blank">{ children }</a>
);

Link.propTypes = {
    children: PropTypes.node,
};

Link.defaultProps = {
    children: null,
};

const propTypes = {
    children: PropTypes.string,
    inline: PropTypes.bool,
};

const defaultProps = {
    children: null,
    inline: false,
};

const Text = ({
    children,
    inline,
    ...props
}) => (
    <ReactMarkdown
        {...(inline ? {
            containerTagName: 'span',
        } : null)}
        renderers={{
            paragraph: inline ? 'span' : 'p',
            link: Link,
        }}
        {...props}
        source={children}
    />
);

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;

export default Text;
