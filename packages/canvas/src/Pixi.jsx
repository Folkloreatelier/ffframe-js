import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Application } from 'pixi.js';
import Color from 'color';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
    resolution: PropTypes.number,
    ticker: PropTypes.bool,
    transparent: PropTypes.bool,
    antialias: PropTypes.bool,
    background: PropTypes.string,
    onReady: PropTypes.func,
};

const defaultProps = {
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    className: null,
    resolution: window.devicePixelRatio || 1,
    ticker: false,
    transparent: true,
    antialias: false,
    background: '#000000',
    onReady: null,
};

class PixiCanvas extends PureComponent {
    constructor(props) {
        super(props);

        this.app = null;
        this.refCanvas = null;
    }

    componentDidMount() {
        const {
            width,
            height,
            resolution,
            ticker,
            transparent,
            antialias,
            background,
            onReady,
        } = this.props;

        const backgroundColor = new Color(background);

        this.app = new Application({
            view: this.refCanvas,
            width,
            height,
            resolution,
            transparent,
            antialias,
            backgroundColor: backgroundColor.rgbNumber(),
            autoStart: ticker,
            sharedTicker: ticker,
        });

        if (onReady) {
            onReady(this.app);
        }
    }

    componentDidUpdate(prevProps) {
        const sizeChanged = (
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height
        );
        if (sizeChanged && this.app !== null) {
            this.app.renderer.resize(this.props.width, this.props.height);
        }
    }

    componentWillUnmount() {
        if (this.app !== null) {
            this.app.destroy();
        }
    }

    getTicker() {
        return this.app !== null ? this.app.ticker : null;
    }

    getLoader() {
        return this.app !== null ? this.app.loader : null;
    }

    getStage() {
        return this.app !== null ? this.app.stage : null;
    }

    start() {
        if (this.app !== null) {
            this.app.start();
        }
    }

    stop() {
        if (this.app !== null) {
            this.app.stop();
        }
    }

    tick() {
        if (this.app !== null) {
            this.app.render();
        }
    }

    render() {
        const {
            width,
            height,
            className,
        } = this.props;
        const style = className === null ? {
            width,
            height,
        } : null;
        return (
            <canvas
                style={style}
                className={className}
                ref={(ref) => { this.refCanvas = ref; }}
            />
        );
    }
}

PixiCanvas.propTypes = propTypes;
PixiCanvas.defaultProps = defaultProps;

export default PixiCanvas;
