import React from 'react';
import ReactDOM from 'react-dom';
import renderer from "react-test-renderer";
import { Schedule } from './Schedule';
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
    <Schedule selectedSchool={mockState} dispatch={mockDispatch} />



describe("Schedule", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(rawComponent, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("shows the day's schedule regardless of the time", () => {
      MockDate.set(beforeSchoolHours.toJSDate());
      let tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
 
      MockDate.set(noSchool.toJSDate());
      tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  
      MockDate.set(inClass.toJSDate());
      tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  
      MockDate.set(betweenClass.toJSDate());
      tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
 
      MockDate.set(afterSchoolHours.toJSDate());
      tree = renderer.create(rawComponent).toJSON();
      expect(tree).toMatchSnapshot();
  });

});


