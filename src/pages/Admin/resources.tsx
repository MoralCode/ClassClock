import React from "react";
import {Datagrid, DateField, List, TextField } from "react-admin";


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
