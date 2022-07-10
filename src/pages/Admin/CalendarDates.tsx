import {
	ListBase,
	Title,
	ListToolbar,
	Pagination,
	Datagrid,
	useListContext,
	RecordMap,
	Record
} from 'react-admin';
import { Card } from '@mui/material';
import BellSchedule from '../../@types/bellschedule';
import { DateTime, Duration } from 'luxon';

import FullCalendar, { EventSourceInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';

interface CalendarDatesProps { 
	[key: string]: any; //https://bobbyhadz.com/blog/react-typescript-pass-object-as-props, this probably allows other props to be passed down
	children?: JSX.Element, 
	// actions, 
	// filters, 
	title: string
	recordTransformer: (data:RecordMap<Record>) => EventSourceInput,
}

// ...e
// let calendar = new Calendar(calendarEl, {
// 	plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
// 	initialView: 'dayGridMonth',
// 	headerToolbar: {
// 		left: 'prev,next today',
// 		center: 'title',
// 		right: 'dayGridMonth,timeGridWeek,listWeek'
// 	}
// });


// https://marmelab.com/react-admin/ListBase.html
const CalendarDates = (props:CalendarDatesProps) => {
	const { data, loading } = useListContext();
	const {title, recordTransformer, ...rest } = props; 
	let events: EventSourceInput[] = []
	if (!loading && data != {}) {
		events = recordTransformer(data)

	}
	
	// return <ListBase {...rest}>
		// <Title title={title} />
		{/* <ListToolbar
			filters={filters}
			actions={actions}
		/> */}
		{/* <Card> */}
		{/* {props.children} */}
	return <FullCalendar
			plugins={[dayGridPlugin]}
			initialView="dayGridMonth"
			events={events}
			nowIndicator={true}
			validRange={{
				start: fromDate.toFormat(dateFormat),
				end: toDate.toFormat(dateFormat)
			}}
			{...rest}
		/>;
		{/* </Card> */}
		{/* <Pagination /> */}
	// </ListBase>;
}
export default CalendarDates;