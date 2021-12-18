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
		return (<label className="editableField">
			<span className="editableFieldLabel">{this.props.label}</span>
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