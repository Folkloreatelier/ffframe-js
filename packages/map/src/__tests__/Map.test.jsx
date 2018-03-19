import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Map from '../Map';

test('match snapshot', () => {
    const component = renderer.create((
        <Map />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
