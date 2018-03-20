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
    disableInteraction: PropTypes.bool,
    withoutUI: PropTypes.bool,
    mapOptions: PropTypes.shape({}),
    onReady: PropTypes.func,
    onMarkerClick: PropTypes.func,
    onMarkerDrag: PropTypes.func,
    onMarkerDragStart: PropTypes.func,
    onMarkerDragEnd: PropTypes.func,
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
    disableInteraction: false,
    withoutUI: false,
    mapOptions: null,
    onReady: null,
    onMarkerClick: null,
    onMarkerDrag: null,
    onMarkerDragStart: null,
    onMarkerDragEnd: null,
};

class Map extends Component {
    constructor(props) {
        super(props);

        this.createMap = this.createMap.bind(this);
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
        if (this.map !== null) {
            this.updateMap(prevProps);
        }
    }

    componentWillUnmount() {
        this.destroyMarkers();
    }

    onMarkerClick(e, index) {
        const { onMarkerClick, markers } = this.props;
        const marker = markers[index] || null;
        const overlay = this.markers[index];
        if (onMarkerClick !== null) {
            onMarkerClick(e, index, marker, overlay);
        }
    }

    onMarkerDrag(e, index) {
        const { onMarkerDrag, markers } = this.props;
        const marker = markers[index] || null;
        const overlay = this.markers[index];
        if (onMarkerDrag !== null) {
            onMarkerDrag(e, index, marker, overlay);
        }
    }

    onMarkerDragStart(e, index) {
        const { onMarkerDragStart, markers } = this.props;
        const marker = markers[index] || null;
        const overlay = this.markers[index];
        if (onMarkerDragStart !== null) {
            onMarkerDragStart(e, index, marker, overlay);
        }
    }

    onMarkerDragEnd(e, index) {
        const { onMarkerDragEnd, markers } = this.props;
        const marker = markers[index] || null;
        const overlay = this.markers[index];
        if (onMarkerDragEnd !== null) {
            onMarkerDragEnd(e, index, marker, overlay);
        }
    }

    createMap() {
        const {
            latitude,
            longitude,
            zoom,
            styles,
            disableInteraction,
            withoutUI,
            mapOptions,
        } = this.props;

        const center = new google.maps.LatLng(latitude, longitude);
        // Create map
        const options = {
            center,
            zoom,
            styles,
            disableDefaultUI: withoutUI,
            disableDoubleClickZoom: disableInteraction,
            draggable: !disableInteraction,
            gestureHandling: disableInteraction ? 'none' : null,
            scrollwheel: !disableInteraction,
            clickableIcons: !disableInteraction,
            ...mapOptions,
        };
        this.map = new google.maps.Map(this.refMap, options);

        this.updateMarkers();

        const readyEvents = ['tilesloaded', 'projection_changed'];
        return Promise.all(readyEvents.map(ev =>
            new Promise((resolve) => {
                const listener = this.map.addListener(ev, () => {
                    google.maps.event.removeListener(listener);
                    resolve();
                });
            }))).then(() => this.map);
    }

    updateMap(prevProps) {
        const {
            zoom, markers, latitude, longitude,
        } = this.props;

        if (prevProps.zoom !== zoom) {
            this.map.setZoom(zoom);
        }

        if (prevProps.latitude !== latitude || prevProps.longitude !== longitude) {
            this.map.setCenter(new google.maps.LatLng(latitude, longitude));
        }

        if (prevProps.markers !== markers) {
            this.updateMarkers();
        }
    }

    updateMarkers() {
        const { markers } = this.props;
        this.markers = markers.map((marker, index) => {
            const { latitude, longitude } = marker;
            const currentOverlay = get(this.markers, index, null);
            const position = new google.maps.LatLng(latitude, longitude);
            const overlay =
                currentOverlay ||
                new google.maps.Marker({
                    map: this.map,
                });
            overlay.setPosition(position);
            overlay.setIcon(get(marker, 'icon', null));
            overlay.setVisible(get(marker, 'visible', true));
            overlay.setDraggable(get(marker, 'draggable', false));
            overlay.setClickable(get(marker, 'clickable', true));
            overlay.setOpacity(get(marker, 'opacity', 1));
            if (currentOverlay === null) {
                overlay.addListener('click', e => this.onMarkerClick(e, index));
                overlay.addListener('dragstart', e => this.onMarkerDragStart(e, index));
                overlay.addListener('dragend', e => this.onMarkerDragEnd(e, index));
                overlay.addListener('drag', e => this.onMarkerDrag(e, index));
            }
            return overlay;
        });
    }

    destroyMarkers() {
        this.markers.forEach((marker) => {
            marker.setMap(null);
            marker.unbindAll();
        });
        this.markers = [];
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
