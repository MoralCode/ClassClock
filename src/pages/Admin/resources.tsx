import { InferProps, Requireable, ReactElementLike, ReactNodeLike, Validator } from "prop-types";
import React from "react";
import {ArrayField, ArrayInput, ChipField, Create, Datagrid, DateField, DateInput, Edit, EditProps, List, RaRecord, ReferenceField, ReferenceInput, SelectInput, SimpleForm, SimpleFormIterator, SingleFieldList, TextField, TextInput } from "react-admin";
import CalendarDates from "./CalendarDates";
import { DateTime, Duration } from 'luxon';
import { EventSourceInput, EventInput } from '@fullcalendar/react';


export const SchoolList = (props: any) => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="full_name" />
			{/* <TextField source="id" /> */}
			<DateField source="creation_date" />
			<TextField source="acronym" />
			<TextField source="alternate_freeperiod_name" />
			<DateField source="last_modified" />
			{/* <ReferenceField source="owner_id" reference="owners"><TextField source="id" /></ReferenceField> */}
		</Datagrid>
	</List>
);

const recordsToEvents = (data: RaRecord[]) => {
	if (data == null) {
		return []
	}

	let events: EventInput[]  = []

	for (let schedule of data) {
		let scheduleTemplateEvent = {
			title: schedule["name"],
			extendedProps: {
				schedule_id: schedule["id"]
			}
		}
		schedule['dates'].forEach((datestr: string) => {
			events.push(Object.assign({}, scheduleTemplateEvent, {date: datestr}))
		});
		
	}
	return events;
};

export const BellScheduleList = (props: any) => (
const DraggableNameField = (props: { source: string | undefined; }) => {
	const record = useRecordContext();
	return <TextField
		source={props.source}
		data-record-id={record.id}
		className={"draggableEvent"}
		style={{
			color: "white",
			backgroundColor: "#3788d8",
			padding: "4px",
			borderRadius: "3px"
}} />;
}


	<>
		<List {...props}>
			<>
			<CalendarDates
				recordTransformer={recordsToEvents}
				fromDate={DateTime.now().minus(Duration.fromObject({month: 1 })).startOf('month')}
				toDate={DateTime.now().plus(Duration.fromObject({month: 2 })).endOf('month')}
				{...props} />
		
			<Datagrid
				rowClick="edit"
				id={"draggable_calendar_items"}
			>
				{/* <TextField source="school" /> */}
				<DraggableNameField source="name" />
				<TextField source="display_name" />
				<ReferenceField source="school" reference="school" link={false}>
					<TextField source="full_name" />
				</ReferenceField>
				<ArrayField source="meeting_times" label="Class Periods"><SingleFieldList><ChipField source="name" /></SingleFieldList></ArrayField>


				{/* <ArrayField source="dates"></ArrayField> */}
				{/* <TextField source="dates" /> */}
				{/* <TextField source="id" /> */}
				<DateField source="creation_date" />
				{/* <DateField source="last_modified" /> */}

			</Datagrid>
			</>
		</List>
	</>
);

export const DateList = (props: any) => (
	<CalendarDates {...props}>
		<Datagrid rowClick="edit">
			{/* <TextField source="school" /> */}
			<TextField source="name" />
			<TextField source="display_name" />
			<ReferenceField source="school" reference="school" link={false}>
				<TextField source="full_name" />
			</ReferenceField>
			<ArrayField source="meeting_times" label="Class Periods"><SingleFieldList><ChipField source="name" /></SingleFieldList></ArrayField>


			{/* <ArrayField source="dates"></ArrayField> */}
			{/* <TextField source="dates" /> */}
			{/* <TextField source="id" /> */}
			<DateField source="creation_date" />
			{/* <DateField source="last_modified" /> */}

		</Datagrid>
	</CalendarDates>
);

export const BellscheduleEdit = (props: any) => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
			{/* <TextField source="id" /> */}
			<TextInput source="display_name" />
			{/* <DateField source="last_modified" /> */}
			{/* <TextInput source="dates" /> */}
			<ArrayInput source="meeting_times">
				<SimpleFormIterator disableReordering>
					{/* <ReferenceInput source="bell_schedule_id" reference="bellschedule">
						<SelectInput optionText="id" />
					</ReferenceInput> */}
					<TextInput source="name" label="Name" />
					<TextInput source="start_time"  label="Start Time" />
					<TextInput source="end_time"  label="End Time" />
				</SimpleFormIterator>
			</ArrayInput>
			{/* <TextInput source="school" /> */}
			<ReferenceInput label="School" source="school" reference="school">
				<SelectInput optionText="full_name" />
			</ReferenceInput>
			<DateField source="creation_date" label="Date Created" />
		</SimpleForm>
	</Edit>
);


export const BellScheduleCreate = (props: any) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name" />
			{/* <TextField source="id" /> */}
			<TextInput source="display_name" />
			<ReferenceInput label="School" source="school_id" reference="school">
				<SelectInput optionText="full_name" />
				{/*  create={<CreateCategory />} */}
			</ReferenceInput>
			{/* <DateField source="last_modified" /> */}
			{/* <TextInput source="dates" /> */}
			<ArrayInput source="meeting_times">
				<SimpleFormIterator>
					{/* <ReferenceInput source="bell_schedule_id" reference="bellschedule">
						<SelectInput optionText="id" />
					</ReferenceInput> */}
					<TextInput source="name" label="Name" />
					<TextInput source="start_time" label="Start Time" />
					<TextInput source="end_time" label="End Time" />
				</SimpleFormIterator>
			</ArrayInput>
			
			{/* <TextInput source="school" /> */}
			{/* <DateField source="creation_date" label="Date Created" /> */}
		</SimpleForm>
	</Create>
)