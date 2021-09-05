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
    data: school,
    lastUpdated: 1564299400 //Sun Jul 28 2019 00:36:40 UTC-0700 (Pacific Daylight Time)
};

const rawComponent = 
    <App selectedSchool={mockState} dispatch={mockDispatch} userSettings={{ use24HourTime: true }} />


// Returns a TestInstance#find() predicate that passes
// all test instance children (including text nodes) through
// the supplied predicate, and returns true if one of the
// children passes the predicate.
// Source: https://billgranfield.com/2018/03/28/react-test-renderer.html
function findInChildren(predicate:any) {
    return (testInstance: { children: any; }) => {
        const children = testInstance.children
        return Array.isArray(children)
            ? children.some(predicate)
            : predicate(children)
    }
}

function findTextInChildren(text:string) {
    return findInChildren((node: string) =>
        typeof node === 'string' &&
        node.toLowerCase() === text.toLowerCase()
    )
}



describe("App", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(rawComponent, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("shows the correct screen before school hours", () => {
      MockDate.set(beforeSchoolHours.toJSDate());
      const root = renderer.create(rawComponent).root
      expect(root.find(findTextInChildren("Transition Time"))).toBeTruthy();
  });

  it("shows the correct screen on no school days", () => {
      MockDate.set(noSchool.toJSDate());
      const root = renderer.create(rawComponent).root
      expect(root.find(findTextInChildren("No School Today"))).toBeTruthy();

  });

  it("shows the correct screen when class is in session", () => {
      MockDate.set(inClass.toJSDate());
      const root = renderer.create(rawComponent).root
      expect(root.find(findTextInChildren("first period"))).toBeTruthy();
      
  });

  it("shows the correct screen between class", () => {
      MockDate.set(betweenClass.toJSDate());
      const root = renderer.create(rawComponent).root
      expect(root.find(findTextInChildren("Transition Time"))).toBeTruthy();
  });

  it("shows the correct screen after school", () => {
      MockDate.set(afterSchoolHours.toJSDate());
      const root = renderer.create(rawComponent).root
      expect(root.find(findTextInChildren("no class"))).toBeTruthy();
  });

});


