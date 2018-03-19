/* globals google: true */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

import withGoogleMaps from './withGoogleMaps';

import componentStyles from './styles.scss';

const propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    })),
    zoom: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    styles: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
    mapClassName: PropTypes.string,
    onReady: PropTypes.func,
    onComplete: PropTypes.func,
};

const defaultProps = {
    markers: [],
    zoom: 4,
    latitude: 45.5,
    longitude: -73.3,
    styles: null,
    width: null,
    height: null,
    className: null,
    mapClassName: null,
    onReady: null,
    onComplete: null,
};

class Map extends Component {
    constructor(props) {
        super(props);

        this.createMap = this.createMap.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.refMap = null;
        this.map = null;
        this.markers = [];
    }

    componentDidMount() {
        const { onReady } = this.props;
        this.createMap().then((map) => {
            if (onReady !== null) {
                onReady(map);
            }
        });
    }

    componentDidUpdate(prevProps) {
        const zoomChanged = prevProps.zoom !== this.props.zoom;
        if (this.map && zoomChanged) {
            this.map.setZoom(this.props.zoom);
        }

        const centerChanged =
            prevProps.latitude !== this.props.latitude ||
            prevProps.longitude !== this.props.longitude;
        if (this.map && centerChanged) {
            this.map.setCenter(new google.maps.LatLng(this.props.latitude, this.props.longitude));
        }
    }

    componentWillUnmount() {
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
    }

    onComplete() {
        if (this.props.onComplete) {
            this.props.onComplete();
        }
    }

    createMap() {
        const {
            latitude, longitude, zoom, styles,
        } = this.props;

        const center = new google.maps.LatLng(latitude, longitude);
        // Create map
        const options = {
            center,
            zoom,
            styles,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            draggable: false,
            gestureHandling: 'none',
            scrollwheel: false,
            clickableIcons: false,
        };
        this.map = new google.maps.Map(this.refMap, options);

        this.updateMarkers();

        const promises = [];
        promises.push(new Promise((resolve) => {
            const listener = this.map.addListener('tilesloaded', () => {
                google.maps.event.removeListener(listener);
                resolve();
            });
        }));
        promises.push(new Promise((resolve) => {
            const listener = this.map.addListener('projection_changed', () => {
                google.maps.event.removeListener(listener);
                resolve();
            });
        }));
        return Promise.all(promises).then(() => this.map);
    }

    updateMarkers() {
        const { markers } = this.props;
        markers.forEach(({ latitude, longitude, icon }, index) => {
            const currentMarker = get(this.markers, index, null);
            const position = new google.maps.LatLng(latitude, longitude);
            const marker =
                currentMarker ||
                new google.maps.Marker({
                    map: this.map,
                });
            marker.setPosition(position);
            marker.setIcon(icon || null);
            this.markers[index] = marker;
        });
    }

    render() {
        const {
            width, height, className, mapClassName,
        } = this.props;
        const style = {
            width,
            height,
        };
        return (
            <div
                className={classNames({
                    [componentStyles.container]: true,
                    [className]: className !== null,
                })}
                style={style}
            >
                <div
                    className={classNames({
                        [componentStyles.map]: true,
                        [mapClassName]: mapClassName !== null,
                    })}
                    ref={(ref) => {
                        this.refMap = ref;
                    }}
                />
            </div>
        );
    }
}

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

export default withGoogleMaps()(Map);
