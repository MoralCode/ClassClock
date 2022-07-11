import {
	ListBase,
	Title,
	ListToolbar,
	Pagination,
	Datagrid,
	useListContext
} from 'react-admin';
// import { Card } from '@mui/material';
import { DateTime } from 'luxon';

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
	recordTransformer: (data:any[]) => EventSourceInput,
	fromDate: DateTime,
	toDate: DateTime

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
const CalendarDates = (props:any) => {
	const { data, loaded } = useListContext(props);
	const {title, recordTransformer, fromDate, toDate, children, ...rest } = props; 
	
	let events: EventSourceInput = {};
	if (loaded) {
		events = recordTransformer(data)
	} else {
		return <>Loading...</>;
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
				start: fromDate.toFormat("yyyy-MM-dd"),
				end: toDate.toFormat("yyyy-MM-dd")
			}}
			{...rest}
		/>;
		{/* </Card> */}
		{/* <Pagination /> */}
	// </ListBase>;
}
export default CalendarDates;