import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Audio from '../Audio';

test('match snapshot', () => {
    const component = renderer.create((
        <Audio />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
