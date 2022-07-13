import {
	ListBase,
	Title,
	ListToolbar,
	Pagination,
	Datagrid,
	useListContext,
	RaRecord
} from 'react-admin';
// import { Card } from '@mui/material';
import { DateTime } from 'luxon';

import FullCalendar, { EventClickArg, EventSourceInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

interface CalendarDatesProps { 
	[key: string]: any; //https://bobbyhadz.com/blog/react-typescript-pass-object-as-props, this probably allows other props to be passed down
	children?: JSX.Element, 
	// actions, 
	// filters, 
	title: string
	recordTransformer: (data: RaRecord[]) => EventSourceInput,
	fromDate: DateTime,
	toDate: DateTime

}


// https://marmelab.com/react-admin/ListBase.html
const CalendarDates = (props:CalendarDatesProps) => {
	const { data, isLoading } = useListContext(props);
	const {title, recordTransformer, fromDate, toDate, children, ...rest } = props; 
	
	let events: EventSourceInput = {};
	if (!isLoading) {
		events = recordTransformer(data)
	} else {
		return <>Loading...</>;
	}
	
	return <FullCalendar
		plugins={[interactionPlugin, dayGridPlugin]}
			initialView="dayGridMonth"
			events={events}
			contentHeight={600}
			nowIndicator={true}
			validRange={{
				start: fromDate.toFormat("yyyy-MM-dd"),
				end: toDate.toFormat("yyyy-MM-dd")
			}}
			{...rest}
		/>;
}
export default CalendarDates;