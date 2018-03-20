import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Text from '../Text';

import styles from './styles.scss';

const markdown = `
# Markdown

- Item 1
- Item 2
- Item 3
`;

const markdownSource = `\`\`\`
${markdown}
\`\`\``;

storiesOf('Text', module)
    .add('simple', () => (
        <div className={styles.container}>
            <Text>{markdown}</Text>

            <h4>Source</h4>
            <Text>{markdownSource}</Text>
        </div>
    ));
