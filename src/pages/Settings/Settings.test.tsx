import React from 'react';
import renderer from "react-test-renderer";
import { Settings } from './Settings';


// make a fake dispatch function, it doesnt need to do anything, because we assume that has already been tested in the redux library
const mockDispatch = jest.fn();

describe("Settings", () => {

  it("renders correctly", () => {
      const tree = renderer.create(<Settings dispatch={mockDispatch} />).toJSON();
      expect(tree).toMatchSnapshot();
  });
});


