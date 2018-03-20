/* eslint-disable jsx-a11y/media-has-caption */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    src: PropTypes.string,
    controls: PropTypes.bool,
    autoPlay: PropTypes.bool,
    muted: PropTypes.bool,
    loop: PropTypes.bool,
    rewind: PropTypes.bool,
    preload: PropTypes.string,
    className: PropTypes.string,
    duration: PropTypes.number,
    onReady: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onCanPlay: PropTypes.func,
    onTimeUpdate: PropTypes.func,
    onProgress: PropTypes.func,
    onEnded: PropTypes.func,
    onMuted: PropTypes.func,
};

const defaultProps = {
    src: null,
    controls: false,
    autoPlay: false,
    muted: false,
    loop: false,
    rewind: false,
    preload: 'none',
    className: null,
    duration: null,
    onReady: null,
    onCanPlay: null,
    onPlay: null,
    onPause: null,
    onTimeUpdate: null,
    onProgress: null,
    onEnded: null,
    onMuted: null,
};

class Audio extends PureComponent {
    constructor(props) {
        super(props);

        this.onReady = this.onReady.bind(this);
        this.onCanPlay = this.onCanPlay.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);

        this.refAudio = null;

        this.state = {
            ready: false,
            playing: false,
            muted: props.muted,
            time: null,
            duration: props.duration,
        };
    }

    componentDidMount() {
        const { preload, autoPlay } = this.props;
        if (preload === 'auto' && autoPlay) {
            this.refAudio.load();
        }
    }

    componentWillReceiveProps(nextProps) {
        const srcChanged = nextProps.src !== this.props.src;
        if (srcChanged) {
            if (this.state.playing) {
                this.pause();
            }
            this.setState({
                ready: false,
                playing: false,
                time: null,
                duration: nextProps.duration,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const srcChanged = prevProps.src !== this.props.src;
        if (srcChanged) {
            const { preload, autoPlay } = this.props;
            if (preload === 'auto' && autoPlay) {
                this.refAudio.load();
            }
        }

        const mutedChanged = prevState.muted !== this.state.muted;
        if (mutedChanged) {
            const { onMuted } = this.props;
            if (onMuted !== null) {
                onMuted(this.state.muted);
            }
        }
    }

    componentWillUnmount() {
        if (this.refAudio !== null && this.state.playing) {
            this.refAudio.pause();
        }
    }

    onReady() {
        if (this.state.ready) {
            return;
        }

        this.setState({
            ready: true,
        }, () => {
            if (this.props.onReady) {
                this.props.onReady();
            }

            if (!this.state.playing && this.props.autoPlay) {
                this.play();
            }
        });
    }

    onCanPlay(e) {
        if (this.props.onCanPlay) {
            this.props.onCanPlay(e);
        }

        const metadataState = this.getMetadataState();
        if (metadataState !== null) {
            this.setState(metadataState, this.onReady);
        }
    }

    onPlay() {
        this.setState({
            playing: true,
            ...this.getMetadataState(),
        }, () => {
            const { onPlay } = this.props;
            if (onPlay !== null) {
                onPlay();
            }
        });
    }

    onPause() {
        this.setState({
            playing: false,
            time: this.refAudio.currentTime,
        }, () => {
            const { onPause } = this.props;
            if (onPause !== null) {
                onPause();
            }
        });
    }

    onEnded() {
        this.setState({
            playing: false,
        }, () => {
            const {
                rewind,
                loop,
                onEnded,
            } = this.props;

            if (onEnded !== null) {
                onEnded();
            }

            if (this.refAudio !== null && (rewind || loop)) {
                this.refAudio.currentTime = 0;
            }

            if (this.refAudio !== null && loop) {
                this.refAudio.play();
            }
        });
    }

    onLoadedMetadata() {
        const metadataState = this.getMetadataState();
        if (metadataState !== null) {
            this.setState(metadataState, this.onReady);
        }
    }

    onTimeUpdate() {
        const { currentTime, duration } = this.refAudio;
        const progress = duration > 0 ? currentTime / duration : 0;

        const newState = {
            time: currentTime,
            ...this.getMetadataState(),
        };

        this.setState(newState, () => {
            if (this.props.onTimeUpdate) {
                this.props.onTimeUpdate(currentTime);
            }

            if (this.props.onProgress) {
                this.props.onProgress(progress);
            }
        });
    }

    getMetadataState() {
        const { duration } = this.state;
        const state = {};
        if (duration === 0 || duration === null) {
            state.duration = this.refAudio.duration || 0;
        }
        return state;
    }

    getDuration() {
        return this.state.duration;
    }

    getCurrentTime() {
        return this.state.time;
    }

    play() {
        if (this.refAudio === null) {
            return Promise.reject();
        }
        return !this.state.playing ? this.refAudio.play() : Promise.resolve();
    }

    pause() {
        if (this.refAudio === null) {
            return Promise.reject();
        }
        return this.state.playing ? this.refAudio.pause() : Promise.resolve();
    }

    seek(time) {
        if (this.refAudio !== null) {
            this.refAudio.currentTime = time;
        }
    }

    isPlaying() {
        return this.state.playing;
    }

    mute() {
        this.setState({
            muted: true,
        });
    }

    unmute() {
        this.setState({
            muted: false,
        });
    }

    render() {
        const {
            src,
            controls,
            autoPlay,
            className,
        } = this.props;

        const { muted } = this.state;

        return (
            <audio
                src={src}
                className={className}
                controls={controls}
                autoPlay={autoPlay}
                muted={muted}
                onEnded={this.onEnded}
                onCanPlay={this.onCanPlay}
                onPlay={this.onPlay}
                onPause={this.onPause}
                onTimeUpdate={this.onTimeUpdate}
                onLoadedMetadata={this.onLoadedMetadata}
                ref={(ref) => { this.refAudio = ref; }}
            />
        );
    }
}

Audio.propTypes = propTypes;
Audio.defaultProps = defaultProps;

export default Audio;
