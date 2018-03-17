import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import VideoComponent from '../VideoComponent';

test('match snapshot', () => {
    const component = renderer.create((
        <VideoComponent />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
