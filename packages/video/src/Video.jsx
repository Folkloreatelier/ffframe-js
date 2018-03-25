import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    getSizeFromString,
    getPositionFromString,
    addResizeListener,
    removeResizeListener,
} from '@folklore/size';

// Prop Types
const propTypes = {
    src: PropTypes.string.isRequired,
    poster: PropTypes.string,
    subtitles: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
    duration: PropTypes.number,
    autoPlay: PropTypes.bool,
    nativeAutoPlay: PropTypes.bool,
    playsInline: PropTypes.bool,
    muted: PropTypes.bool,
    volume: PropTypes.number,
    crossOrigin: PropTypes.string,
    preload: PropTypes.string,
    loop: PropTypes.bool,
    rewind: PropTypes.bool,
    size: PropTypes.string,
    position: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    videoStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    videoClassName: PropTypes.string,
    onReady: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onCanPlay: PropTypes.func,
    onTimeUpdate: PropTypes.func,
    onProgress: PropTypes.func,
    onEnded: PropTypes.func,
    onMuted: PropTypes.func,
};

// Default props
const defaultProps = {
    width: null,
    height: null,
    videoWidth: null,
    videoHeight: null,
    duration: null,
    poster: null,
    subtitles: null,
    autoPlay: false,
    nativeAutoPlay: false,
    playsInline: true,
    muted: false,
    volume: 1,
    loop: false,
    rewind: false,
    crossOrigin: 'anonymous',
    preload: 'auto',
    size: 'cover',
    position: 'center',
    style: null,
    className: null,
    containerClassName: null,
    videoClassName: null,
    videoStyle: null,
    onReady: null,
    onCanPlay: null,
    onPlay: null,
    onPause: null,
    onTimeUpdate: null,
    onProgress: null,
    onEnded: null,
    onMuted: null,
};

class Video extends PureComponent {
    constructor(props) {
        super(props);

        this.onParentResize = this.onParentResize.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onCanPlay = this.onCanPlay.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);

        this.refParent = null;
        this.refElement = null;
        this.refVideo = null;

        this.state = {
            ready: false,
            playing: false,
            muted: props.muted,
            time: null,
            duration: props.duration,
            width: props.videoWidth,
            height: props.videoHeight,
            parentWidth: null,
            parentHeight: null,
        };
    }

    componentDidMount() {
        const {
            preload, autoPlay, width, height,
        } = this.props;
        const { muted } = this.state;
        if (preload === 'auto' && autoPlay) {
            this.refVideo.load();
        }

        this.refVideo.setAttribute('muted', muted);

        if (width === null && height === null) {
            this.refParent = this.refElement.parentNode || null;
            if (this.refParent !== null) {
                addResizeListener(this.refParent, this.onParentResize);
            }
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
                width: nextProps.videoWidth,
                height: nextProps.videoHeight,
            });
        }

        const mutedChanged = nextProps.muted !== this.props.muted;
        if (mutedChanged) {
            this.setState({
                muted: nextProps.muted,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const readyChanged = prevState.ready !== this.state.ready;
        if (readyChanged && this.state.ready) {
            if (this.props.onReady) {
                this.props.onReady();
            }

            if (!this.state.playing && this.props.autoPlay) {
                this.play();
            }
        }

        const srcChanged = prevProps.src !== this.props.src;
        if (srcChanged) {
            const { preload, autoPlay } = this.props;
            if (preload === 'auto' && autoPlay) {
                this.refVideo.load();
            }
        }

        const mutedChanged = prevState.muted !== this.state.muted;
        if (mutedChanged) {
            const { onMuted } = this.props;
            this.refVideo.setAttribute('muted', this.state.muted);
            if (onMuted !== null) {
                onMuted(this.state.muted);
            }
        }
    }

    componentWillUnmount() {
        if (this.refVideo !== null && this.state.playing) {
            this.refVideo.pause();
        }

        if (this.refParent !== null) {
            removeResizeListener(this.refParent, this.onParentResize);
        }
    }

    onParentResize() {
        this.setState({
            parentWidth: this.refParent !== null ? this.refParent.offsetWidth : null,
            parentHeight: this.refParent !== null ? this.refParent.offsetHeight : null,
        });
    }

    onReady() {
        if (this.state.ready) {
            return;
        }

        this.setState({
            ready: true,
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
        this.setState(
            {
                playing: true,
                ...this.getMetadataState(),
            },
            () => {
                const { onPlay } = this.props;
                if (onPlay !== null) {
                    onPlay();
                }
            },
        );
    }

    onPause() {
        this.setState(
            {
                playing: false,
                time: this.refVideo.currentTime,
            },
            () => {
                const { onPause } = this.props;
                if (onPause !== null) {
                    onPause();
                }
            },
        );
    }

    onEnded() {
        this.setState(
            {
                playing: false,
            },
            () => {
                const { rewind, loop, onEnded } = this.props;

                if (onEnded !== null) {
                    onEnded();
                }

                if (this.refVideo !== null && (rewind || loop)) {
                    this.refVideo.currentTime = 0;
                }

                if (this.refVideo !== null && loop) {
                    this.refVideo.play();
                }
            },
        );
    }

    onLoadedMetadata() {
        const metadataState = this.getMetadataState();
        if (metadataState !== null) {
            this.setState(metadataState, this.onReady);
        }
    }

    onTimeUpdate() {
        const { currentTime, duration } = this.refVideo;
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

    getCurrentTime() {
        const { time } = this.state;
        return time;
    }

    getDuration() {
        const { duration } = this.state;
        return duration;
    }

    getSize() {
        const { width, height } = this.state;
        return {
            width,
            height,
        };
    }

    getMetadataState() {
        const { duration, width, height } = this.state;
        const state = {};
        if (duration === 0 || duration === null) {
            state.duration = this.refVideo.duration || 0;
        }
        if (width === 0 || width === null) {
            state.width = this.refVideo.videoWidth || 0;
        }
        if (height === 0 || height === null) {
            state.height = this.refVideo.videoHeight || 0;
        }
        return state;
    }

    play() {
        if (this.refVideo === null) {
            return Promise.reject();
        }
        return !this.state.playing ? this.refVideo.play() : Promise.resolve();
    }

    pause() {
        if (this.refVideo === null) {
            return Promise.reject();
        }
        return this.state.playing ? this.refVideo.pause() : Promise.resolve();
    }

    seek(time) {
        if (this.refVideo !== null) {
            this.refVideo.currentTime = time;
        }
    }

    isPlaying() {
        return this.state.playing;
    }

    renderVideo() {
        const {
            src,
            playsInline,
            crossOrigin,
            width,
            height,
            preload,
            volume,
            nativeAutoPlay,
            subtitles,
            poster,
            containerClassName,
            videoClassName,
            videoStyle,
        } = this.props;

        const {
            ready, muted, parentWidth, parentHeight,
        } = this.state;

        const containerWidth = width !== null ? width : parentWidth;
        const containerHeight = height !== null ? height : parentHeight;
        const videoWidth = this.state.width;
        const videoHeight = this.state.height;

        const size = getSizeFromString(
            this.props.size,
            videoWidth,
            videoHeight,
            containerWidth,
            containerHeight,
        );
        const videoRatio = videoWidth / videoHeight;
        const sizeWidth = size.width !== null ? size.width : Math.round(size.height * videoRatio);
        const sizeHeight = size.height !== null ? size.height : Math.round(size.width / videoRatio);
        const position = getPositionFromString(
            this.props.position,
            sizeWidth,
            sizeHeight,
            containerWidth,
            containerHeight,
        );

        const containerStyle = {
            ...position.style,
            width: sizeWidth,
            height: sizeHeight,
            opacity: ready ? 1 : 0,
        };

        /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/media-has-caption */
        return (
            <div style={containerStyle} className={containerClassName}>
                <video
                    ref={(ref) => {
                        this.refVideo = ref;
                    }}
                    src={src}
                    width={size.width}
                    height={size.height}
                    muted={muted}
                    poster={poster}
                    preload={preload}
                    style={videoStyle}
                    volume={volume}
                    className={videoClassName}
                    crossOrigin={crossOrigin}
                    playsInline={playsInline}
                    autoPlay={nativeAutoPlay}
                    onEnded={this.onEnded}
                    onCanPlay={this.onCanPlay}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    onTimeUpdate={this.onTimeUpdate}
                    onLoadedMetadata={this.onLoadedMetadata}
                >
                    {subtitles !== null && subtitles.length > 0 ? (
                        <track
                            ref={(ref) => {
                                this.subtitles = ref;
                            }}
                            label="Français"
                            kind="subtitles"
                            srcLang="fr"
                            src={subtitles}
                            mode={muted ? 'showing' : 'hidden'}
                            default
                        />
                    ) : null}
                </video>
            </div>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/media-has-caption */
    }

    render() {
        const {
            width, height, style, className,
        } = this.props;
        const { parentWidth, parentHeight } = this.state;

        return (
            <div
                style={{
                    position: 'relative',
                    width: width === null ? parentWidth : width,
                    height: height === null ? parentHeight : height,
                    overflow: 'hidden',
                    ...style,
                }}
                className={className}
                ref={(ref) => {
                    this.refElement = ref;
                }}
            >
                {this.renderVideo()}
            </div>
        );
    }
}

Video.propTypes = propTypes;
Video.defaultProps = defaultProps;

export default Video;
