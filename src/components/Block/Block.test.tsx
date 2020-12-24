import React from "react";
import renderer from "react-test-renderer";
import Block from "./Block";


describe("Block Component", () => {
    it("renders correctly", () => {
        const component = renderer.create(<Block />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
