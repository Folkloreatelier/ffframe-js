import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import VideoComponent from '../VideoComponent';

storiesOf('VideoComponent', module)
    .add('simple', () => (
        <div>
            <VideoComponent

            />
        </div>
    ));
