import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onReady: PropTypes.func,
};

const defaultProps = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    className: null,
    style: null,
    onReady: null,
};

class Canvas extends PureComponent {
    constructor(props) {
        super(props);

        this.app = null;
        this.refCanvas = null;
    }

    componentDidMount() {
        const { onReady } = this.props;
        if (onReady !== null) {
            onReady(this.refCanvas, this.getContext('2d'));
        }
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
                className={className}
                style={style}
                ref={(ref) => { this.refCanvas = ref; }}
            />
        );
    }
}

Canvas.propTypes = propTypes;
Canvas.defaultProps = defaultProps;

export default Canvas;
