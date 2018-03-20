import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Map from '../Map';

import styles from './styles.scss';

const markers = [
    {
        latitude: 45.5,
        longitude: -73.3,
    },
];

storiesOf('Map', module)
    .add('with interaction', () => (
        <div className={styles.container}>
            <h4>Normal</h4>
            <Map
                apiKey="AIzaSyA5fM2vl5fHUt2XJTphUxsAq9tzdl-v0CU"
                className={styles.map}
                onReady={action('ready (normal)')}
            />

            <h4>Without UI</h4>
            <Map
                apiKey="AIzaSyA5fM2vl5fHUt2XJTphUxsAq9tzdl-v0CU"
                className={styles.map}
                withoutUI
                onReady={action('ready (without ui)')}
            />
        </div>
    ))
    .add('without interaction', () => (
        <div className={styles.container}>
            <h4>Normal</h4>
            <Map
                apiKey="AIzaSyA5fM2vl5fHUt2XJTphUxsAq9tzdl-v0CU"
                className={styles.map}
                disableInteraction
                onReady={action('ready (normal)')}
            />

            <h4>Without UI</h4>
            <Map
                apiKey="AIzaSyA5fM2vl5fHUt2XJTphUxsAq9tzdl-v0CU"
                className={styles.map}
                disableInteraction
                withoutUI
                onReady={action('ready (without ui)')}
            />
        </div>
    ))
    .add('with markers', () => (
        <div className={styles.container}>
            <h4>Normal</h4>
            <Map
                apiKey="AIzaSyA5fM2vl5fHUt2XJTphUxsAq9tzdl-v0CU"
                className={styles.map}
                markers={markers}
                onMarkerClick={(e, index, marker) => action('click_marker')(index, marker)}
            />
        </div>
    ));
