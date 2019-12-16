import React from "react";
import renderer from "react-test-renderer";
import Link from "./Link";

test("Link renders correctly with a static link", () => {
    const component = renderer.create(
        <Link destination="https://classclock.app" />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // // manually trigger the callback
    // tree.props.onMouseEnter();
    // re-rendering
    // tree = component.toJSON();
    // expect(tree).toMatchSnapshot();

    // manually trigger the callback
    // tree.props.onMouseLeave();
    // re-rendering
    // tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
});

it("renders correctly with a function", () => {
    let pass = false;
    const onClick = () => {pass = true}
    const component = renderer.create(<Link destination={onClick} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    if (tree != null) {
        // manually trigger the callback
        tree.props.onClick();
    }
    

    expect(pass).toBeTruthy();
    
});
