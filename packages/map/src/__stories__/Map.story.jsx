import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Map from '../Map';

storiesOf('Map', module)
    .add('simple', () => (
        <div>
            <Map
                apiKey="AIzaSyA5fM2vl5fHUt2XJTphUxsAq9tzdl-v0CU"
                width={400}
                height={300}
            />
        </div>
    ));
