import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Text from '../Text';

test('match snapshot', () => {
    const component = renderer.create((
        <Text />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
