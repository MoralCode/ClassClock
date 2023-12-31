import React from 'react';
import renderer from "react-test-renderer";
import { mockSchoolState } from '../../utils/testconstants';
import { Settings } from './Settings';


// make a fake dispatch function, it doesnt need to do anything, because we assume that has already been tested in the redux library
const mockDispatch = jest.fn();

describe("Settings", () => {

  it("renders correctly", () => {
    const tree = renderer.create(<Settings dispatch={mockDispatch} selectedSchool={mockSchoolState} userSettings={{use24HourTime: true}} error={''} />).toJSON();
      expect(tree).toMatchSnapshot();
  });
});


