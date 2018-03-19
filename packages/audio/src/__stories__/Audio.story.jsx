import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Audio from '../Audio';

storiesOf('Audio', module)
    .add('simple', () => (
        <div>
            <Audio

            />
        </div>
    ));
