import React from "react";
import renderer from "react-test-renderer";
import Icon from "./Icon";

describe("Icon", () => {
    it("renders correctly", () => {
        const component = renderer.create(
            <Icon icon="fa-vial" />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();

    });
});