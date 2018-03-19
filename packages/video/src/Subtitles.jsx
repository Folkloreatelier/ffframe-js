/* eslint-disable react/no-danger */
/**
 * Subtitles component used by the Content component
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineMax } from 'gsap';
import classNames from 'classnames';
import parseSRT from 'parse-srt';
import 'whatwg-fetch';

// Styles
import styles from './styles.scss';

// Prop Types
const propTypes = {
    subtitles: PropTypes.string,
    time: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    lineStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

// Default props
const defaultProps = {
    subtitles: null,
    time: 0,
    className: null,
    style: null,
    lineStyle: null,
};

class Subtitles extends PureComponent {
    constructor(props) {
        super(props);

        this.element = null;
        this.currentLine = null;
        this.lastLine = null;
        this.transitionTimeline = null;

        this.state = {
            lines: [],
            lineIndex: -1,
            lastLineIndex: -1,
        };
    }

    componentDidMount() {
        if (this.props.subtitles) {
            this.loadSubtitles(this.props.subtitles);
        }
    }

    componentWillReceiveProps(nextProps) {
        const subtitlesChanged = nextProps.subtitles !== this.props.subtitles;
        if (subtitlesChanged) {
            this.setState({
                lines: [],
                lineIndex: 0,
            });
        }

        const timeChanged = nextProps.time !== this.props.time;
        if (!subtitlesChanged && timeChanged && this.state.lines.length > 0) {
            const nextLineIndex = this.getLineIndexFromTime(nextProps.time);
            if (nextLineIndex !== this.state.lineIndex) {
                if (this.transitionTimeline) {
                    this.transitionTimeline.kill();
                    this.transitionTimeline = null;
                }
                this.setState({
                    lastLineIndex: this.state.lineIndex,
                    lineIndex: nextLineIndex,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const subtitlesChanged = prevProps.subtitles !== this.props.subtitles;
        if (subtitlesChanged) {
            this.loadSubtitles(this.props.subtitles);
        }

        const lineIndexChanged = prevState.lineIndex !== this.state.lineIndex;
        if (!subtitlesChanged && lineIndexChanged) {
            this.transitionTimeline = this.transitionLine();
        }
    }

    getLineIndexFromTime(time) {
        const { lines } = this.state;
        const lineIndex = lines.findIndex(line => time >= line.start && time <= line.end);
        return lineIndex;
    }

    loadSubtitles(src) {
        return fetch(src)
            .then(response => response.text())
            .then(response => parseSRT(response))
            .then((response) => {
                this.setState({
                    lines: response,
                });
            });
    }

    transitionLine() {
        const timeline = new TimelineMax({});

        if (this.lastLine) {
            timeline.fromTo(
                this.lastLine,
                0.2,
                {
                    autoAlpha: 1,
                },
                {
                    autoAlpha: 0,
                },
                0,
            );
        }
        if (this.currentLine) {
            timeline.fromTo(
                this.currentLine,
                0.2,
                {
                    autoAlpha: 0,
                },
                {
                    autoAlpha: 1,
                },
                0,
            );
        }

        return timeline;
    }

    renderSubtitles() {
        const { lineStyle } = this.props;

        const { lines, lineIndex, lastLineIndex } = this.state;

        if (lines.length === 0) {
            return null;
        }

        const lastLine = lastLineIndex !== -1 ? lines[lastLineIndex] : null;
        const line = lineIndex !== -1 ? lines[lineIndex] : null;

        return (
            <div className={styles.lines}>
                {lastLine !== null ? (
                    <div
                        ref={(ref) => {
                            this.lastLine = ref;
                        }}
                        className={`${styles.line} ${styles.lastLine}`}
                    >
                        <div
                            className={styles.text}
                            style={lineStyle}
                            dangerouslySetInnerHTML={{ __html: lastLine.text }}
                        />
                    </div>
                ) : null}
                {line !== null ? (
                    <div
                        ref={(ref) => {
                            this.currentLine = ref;
                        }}
                        className={styles.line}
                    >
                        <div
                            className={styles.text}
                            style={lineStyle}
                            dangerouslySetInnerHTML={{ __html: line.text }}
                        />
                    </div>
                ) : null}
            </div>
        );
    }

    render() {
        const { className, style } = this.props;

        const subtitleClassNames = classNames({
            [styles.subtitles]: true,
            [className]: className !== null,
        });

        return (
            <div
                className={subtitleClassNames}
                style={style}
                ref={(ref) => {
                    this.element = ref;
                }}
            >
                {this.renderSubtitles()}
            </div>
        );
    }
}

Subtitles.propTypes = propTypes;
Subtitles.defaultProps = defaultProps;

export default Subtitles;
