import React from 'react';
import ReactDOM from 'react-dom';
import renderer from "react-test-renderer";
import { App } from './App';
import { school, beforeSchoolHours, noSchool, inClass, betweenClass, afterSchoolHours } from '../utils/testconstants';
import MockDate from 'mockdate';

// make a fake dispatch function, it doesnt need to do anything, because we assume that has already been tested in the redux library
const mockDispatch = jest.fn();

const mockState = {
    isFetching: false,
    didInvalidate: false,
    data: school
};

const rawComponent = 
    <App selectedSchool={mockState} dispatch={mockDispatch} />



describe("App", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("shows the correct screen before school hours", () => {
      MockDate.set(beforeSchoolHours);
      const tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  });

  it("shows the correct screen on no school days", () => {
      MockDate.set(noSchool);
      const tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  });

  it("shows the correct screen when class is in session", () => {
      MockDate.set(inClass);
      const tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  });

  it("shows the correct screen between class", () => {
      MockDate.set(betweenClass);
      const tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  });

  it("shows the correct screen after school", () => {
      MockDate.set(afterSchoolHours);
      const tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  });

});


