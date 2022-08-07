import React from 'react';
import renderer from "react-test-renderer";
import { school } from '../../utils/testconstants';
import { Settings } from './Settings';


// make a fake dispatch function, it doesnt need to do anything, because we assume that has already been tested in the redux library
const mockDispatch = jest.fn();

describe("Settings", () => {

  it("renders correctly", () => {
    const tree = renderer.create(<Settings dispatch={mockDispatch} selectedSchool={{
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1659889423,
      data: school
    }} userSettings={{use24HourTime: true}} error={''} />).toJSON();
      expect(tree).toMatchSnapshot();
  });
});


