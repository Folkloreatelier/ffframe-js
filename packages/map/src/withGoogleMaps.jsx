import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';

import loadGoogleMaps from './loadGoogleMaps';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const propTypes = {
    apiKey: PropTypes.string,
    locale: PropTypes.string,
};

const defaultProps = {
    apiKey: null,
    locale: 'en',
};

const contextTypes = {
    googleMapsApiKey: PropTypes.string,
};

const childContextTypes = {
    googleMapsApiKey: PropTypes.string,
};

export default function withGoogleMaps(opts) {
    const options = {
        withRef: false,
        ...opts,
    };
    return (WrappedComponent) => {
        class WithGoogleMaps extends Component {
            static getWrappedInstance() {
                invariant(
                    options.withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the withGoogleMaps() call.',
                );
                return this.wrappedInstance;
            }

            constructor(props) {
                super(props);

                this.state = {
                    loaded: false,
                };
            }

            getChildContext() {
                return {
                    googleMapsApiKey: this.props.apiKey || this.context.googleMapsApiKey,
                };
            }

            componentDidMount() {
                const { apiKey } = this.props;
                const { googleMapsApiKey } = this.context;
                const key = apiKey || googleMapsApiKey;
                if (key === null) {
                    // eslint-disable-next-line no-console
                    console.warning('You need to specify a Google Maps Api Key');
                    return;
                }
                this.loadGoogleMaps(key);
            }

            componentDidUpdate(prevProps) {
                const prevKey = prevProps.apiKey || this.context.googleMapsApiKey;
                const key = this.props.apiKey || this.context.googleMapsApiKey;
                const keyChanged = prevKey !== key;
                if (keyChanged && key !== null && !this.state.loaded) {
                    this.loadGoogleMaps(key);
                }
            }

            loadGoogleMaps(key) {
                const { locale } = this.props;
                return loadGoogleMaps({
                    apiKey: key,
                    locale,
                })
                    .then(() => {
                        this.setState({
                            loaded: true,
                        });
                    });
            }

            render() {
                const { loaded } = this.state;
                if (!loaded) {
                    return null;
                }

                const props = {
                    ...this.props,
                };

                if (options.withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return (
                    <WrappedComponent {...props} />
                );
            }
        }

        WithGoogleMaps.propTypes = propTypes;
        WithGoogleMaps.defaultProps = defaultProps;
        WithGoogleMaps.contextTypes = contextTypes;
        WithGoogleMaps.childContextTypes = childContextTypes;
        WithGoogleMaps.displayName = `withGoogleMaps(${getDisplayName(WrappedComponent)})`;
        WithGoogleMaps.WrappedComponent = WrappedComponent;

        const WithGoogleMapsComponent = hoistStatics(WithGoogleMaps, WrappedComponent);

        return WithGoogleMapsComponent;
    };
}
