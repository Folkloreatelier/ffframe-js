import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Canvas from '../Canvas';

test('match snapshot', () => {
    const component = renderer.create((
        <Canvas />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
