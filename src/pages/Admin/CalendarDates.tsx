import {
	ListBase,
	Title,
	ListToolbar,
	Pagination,
	Datagrid,
	useListContext,
} from 'react-admin';
import { Card } from '@mui/material';
import BellSchedule from '../../@types/bellschedule';
import { DateTime, Duration } from 'luxon';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';

interface CalendarDatesProps { 
	children: JSX.Element, 
	// actions, 
	// filters, 
	title: string
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



export const Dates = () => {
	const { data, loading } = useListContext();
	let schedulesByDate: { [key: string]: string[]} = {};
	if (!loading && data != {}) {
		for (let entry of Object.entries(data)) {
			let [key, schedule] = entry
			console.log(schedule['dates'])
			console.log(typeof (schedule['dates']))
			schedulesByDate[key] = schedule['dates']//.map((value:DateTime) => (value).toFormat("yyyy-MM-dd"))
		}
	}

	let fromDate = DateTime.now().minus(Duration.fromObject({ month: 1})).startOf('month')
	let toDate = DateTime.now().plus(Duration.fromObject({ month: 2 })).endOf('month')
	let dates: DateTime[] = []
	let dateFormat = "yyyy-MM-dd";
	let theDate = fromDate;
	while (theDate <= toDate ) {
		theDate = theDate.plus(Duration.fromObject({ days: 1 }))
		dates.push(theDate)		
	}
	console.log(dates)

	const schedulesForDate = (date: string) => {
		let schedulesToday = []
		for (let entry of Object.entries(schedulesByDate)) {
			let [id, scheduledates] = entry;
			// let datesmap = scheduledates.map((value) => (value).toFormat("yyyy-MM-dd"));
			if (scheduledates.find((value, index, obj) => value == date)) {
				schedulesToday.push({ title: data[id]["name"], date: date})
			}
		}
		return schedulesToday
	}
	return (
		<FullCalendar
			plugins={[dayGridPlugin]}
			initialView="dayGridMonth"
			events={dates.map((date) => schedulesForDate(date.toFormat(dateFormat))).reduce((prev, curr) => prev.concat(curr) )}
			nowIndicator={true}
			validRange={{
				start: fromDate.toFormat(dateFormat),
				end: toDate.toFormat(dateFormat)
			}}
		/>
	);
}

// https://marmelab.com/react-admin/ListBase.html
const CalendarDates = (props:CalendarDatesProps) => (
	<ListBase {...props}>
		<Title title={props.title} />
		{/* <ListToolbar
			filters={filters}
			actions={actions}
		/> */}
		{/* <Card> */}
		{props.children}
		<Dates />
		<p>hi</p>
		{/* </Card> */}
		{/* <Pagination /> */}
	</ListBase>
);
export default CalendarDates;