import React from 'react';
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Video from '../Video';

import styles from './styles.scss';

import video from './test.mp4';

storiesOf('Video', module).add('simple', () => (
    <div className={styles.container}>
        <div className={styles.video}>
            <Video
                src={video}
                autoPlay
                loop
                onReady={action('ready')}
                onEnded={action('ended')}
            />
        </div>
    </div>
));
