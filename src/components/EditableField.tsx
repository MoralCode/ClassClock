import React, { Component } from "react";


interface IEditableFieldProps {
	label: React.ReactNode;
	value: string | number | string[] | undefined;
	onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
	disabled?: boolean | undefined;
	readOnly?: boolean | undefined;
	placeholder?: string | undefined;
}

export default class EditableField extends Component<IEditableFieldProps, {}> {
	render() {
		return (<label style={{
			display: "inline-flex",
			justifyContent: "space-between",
			width: "100%",
			textAlign: "left",
			margin: "2px"
		}}>
			<span>{this.props.label}</span>
			<input
				type="text"
				value={this.props.value}
				disabled={this.props.disabled}
				readOnly={this.props.readOnly}
				onChange={this.props.onChange}
				placeholder={this.props.placeholder}
			/>
		</label>
		)
	}
}