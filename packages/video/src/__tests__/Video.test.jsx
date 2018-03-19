import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Video from '../Video';

test('match snapshot', () => {
    const component = renderer.create((
        <Video />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
