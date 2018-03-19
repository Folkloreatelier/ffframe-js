import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies
import { Sprite } from 'pixi.js';

import storiesOf from '../../../../.storybook/storiesOf';
import Canvas from '../Canvas';
import PixiCanvas from '../Pixi';

import spriteImage from './sprite.png';

const onPixiReady = (app) => {
    const { stage, screen } = app;
    const sprite = Sprite.fromImage(spriteImage);
    sprite.x = screen.width / 2;
    sprite.y = screen.height / 2;
    stage.addChild(sprite);
    action('ready')(app);
};

storiesOf('Canvas', module)
    .add('simple', () => (
        <div>
            <Canvas
                width={300}
                height={200}
            />
        </div>
    ))
    .add('pixi', () => (
        <div>
            <PixiCanvas
                width={300}
                height={200}
                ticker
                background="#FFCC00"
                onReady={onPixiReady}
            />
        </div>
    ));
