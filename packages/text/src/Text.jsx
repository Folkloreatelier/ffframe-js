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
    disableHtml: PropTypes.bool,
};

const defaultProps = {
    children: null,
    inline: false,
    disableHtml: false,
};

const Text = ({
    children,
    inline,
    disableHtml,
    ...props
}) => (
    <ReactMarkdown
        {...(inline ? {
            containerTagName: 'span',
        } : null)}
        escapeHtml={disableHtml}
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
