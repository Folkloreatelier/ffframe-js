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
    googleMaspsApiKey: PropTypes.string,
};

const childContextTypes = {
    googleMaspsApiKey: PropTypes.string,
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
                    googleMaspsApiKey: this.props.apiKey || this.context.googleMaspsApiKey,
                };
            }

            componentDidMount() {
                const { apiKey, locale } = this.props;
                const { googleMaspsApiKey } = this.context;
                loadGoogleMaps({
                    apiKey: apiKey || googleMaspsApiKey,
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
