import Link, { ILinkProps } from "./Link"


const BlockLink = (props: ILinkProps) => {

	return <Link className={"blockButton" + (props.className ? " " + props.className : "")} destination={props.destination} title={props.title} style={Object.assign({}, props.style, { textDecoration: "none" })} id={props.id}>
		{props.children}
		</Link>
}

export default BlockLink;