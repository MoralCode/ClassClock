import React from "react";
import {ArrayField, ChipField, Datagrid, DateField, List, SingleFieldList, TextField } from "react-admin";


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

export const BellScheduleList = (props: any) => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<DateField source="last_modified" />
			<TextField source="school" />
			<ArrayField source="meeting_times"><SingleFieldList><ChipField source="bell_schedule_id" /></SingleFieldList></ArrayField>
			<DateField source="creation_date" />
			<TextField source="display_name" />
			<TextField source="name" />
			<TextField source="dates" />
			<TextField source="id" />
		</Datagrid>
	</List>
);
