import React, { ReactNode, useState } from "react";
import Icon from "../Icon";
import Link from "../Link";
import './ClassPeriodEditableListItem.css';

export interface IClassPeriodEditableListItemProps {
    classPeriodName: string;
    startTime: string;
    endTime: string;
    onEditSave: (classPeriodName:string, startTime:string, endTime:string) => void;
}

const ClassPeriodEditableListItem = (props: IClassPeriodEditableListItemProps) => {

	const [isEditing, setEditing] = useState(false);
	const [hasChanged, setChanged] = useState(false);

	const [classPeriodName, setClassPeriodName] = useState(props.classPeriodName)
	const [startTime, setStartTime] = useState(props.startTime);
	const [endTime, setEndTime] = useState(props.endTime);

	const save = () => {
		props.onEditSave(classPeriodName, startTime, endTime)
		setEditing(!isEditing);
	}

	const cancel = () => {
		if (hasChanged) {
            //prompt for confirmation

			if (window.confirm("Are you sure you want to revert your changes?")) {
				setClassPeriodName(props.classPeriodName)
				setStartTime(props.startTime)
				setEndTime(props.endTime);

				setEditing(!isEditing);

            }
        } else {
            // if not editing and/or no changes made, just toggle the editing state
            setEditing(!isEditing);
        }
	};

	const onChildChanged = (event: React.FormEvent<HTMLInputElement>) => {

		switch ( event.currentTarget.defaultValue) {
			case classPeriodName:
				setClassPeriodName(event.currentTarget.value)
				break;
			case startTime:
				setStartTime(event.currentTarget.value);
				break;
			case endTime:
				setEndTime(event.currentTarget.value);
				break;
			default:
				console.log("none")
				break;
		}

		if(
			props.classPeriodName !== classPeriodName ||
			props.startTime !== startTime ||
			props.endTime !== endTime
			){
				setChanged(true)
			}
		console.log("childChanged: " + event.currentTarget.name)
	};
	

	const getChildElements = (editing: boolean): (JSX.Element | JSX.Element[]) => {

		if (editing) {

			return (
                <>
                    <input
                        type="text"
						name="name"
						
                        onChange={event => onChildChanged(event)}
                        defaultValue={classPeriodName}
                    />
                    <input
                        type="time"
                        name="startTime"
                        onChange={event => onChildChanged(event)}
                        defaultValue={startTime}
                    />
                    <span> - </span>
                    <input
                        type="time"
                        name="endTime"
                        onChange={event => onChildChanged(event)}
                        defaultValue={endTime}
                    />
                </>
            );
			
		} else {
			return (
			<>
				<span>{classPeriodName}</span>
				<span>{startTime} - {endTime}</span>
			</>
			);
		}


		// return React.Children.map(children, (childNode, index) => {
		// 	// cover case: <div>text<div></div></div>
		// 	// console.log(childNode)
		// 	if (childNode.type === "input") {
				
		// 	}
			

		// 	// if (typeof childNode === "string") {
		// 	// 	return "something";
		// 	// } 
		// 	// if (typeof childNode.props.children === "string") {
		// 	// 	return React.cloneElement(childNode, [], "something");
		// 	// }
		// 	return React.cloneElement(childNode, [], transformChildElements(childNode.props.children, editing));
		// })
	}

	
    return (
        <div className="editableListItem">
			{getChildElements(isEditing)}

			{ isEditing? (
				<Link destination={save}>
					<Icon icon="fa-check" />
				</Link>
			) : undefined }

            <Link destination={isEditing ? cancel : () => setEditing(!isEditing)}>
                <Icon icon={isEditing ? "fa-times" : "fa-edit"} />
            </Link>
        </div>
    );
};

export default ClassPeriodEditableListItem;
