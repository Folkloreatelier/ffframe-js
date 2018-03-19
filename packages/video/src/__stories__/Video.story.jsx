import React from 'react';
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Video from '../Video';

import video from './test.mp4';

storiesOf('Video', module).add('simple', () => (
    <div>
        <Video
            width={320}
            height={200}
            src={video}
            autoPlay
            loop
            onReady={action('ready')}
            onEnded={action('ended')}
        />
    </div>
));
