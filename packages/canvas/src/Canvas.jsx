import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

const defaultProps = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    className: null,
    style: null,
};

class Canvas extends PureComponent {
    constructor(props) {
        super(props);

        this.app = null;
        this.refCanvas = null;
    }

    getContext(context) {
        return this.refCanvas.getContext(context);
    }

    render() {
        const {
            width,
            height,
            className,
            style,
        } = this.props;
        return (
            <canvas
                width={width}
                height={height}
                style={style}
                className={className}
                ref={(ref) => { this.refCanvas = ref; }}
            />
        );
    }
}

Canvas.propTypes = propTypes;
Canvas.defaultProps = defaultProps;

export default Canvas;
