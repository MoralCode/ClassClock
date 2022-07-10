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
	let schedulesByDate: { [key: string]: string[] } = {};
	let events: EventSourceInput[] = []
	if (!loading && data != {}) {
		events = recordTransformer(data)
		for (let entry of Object.entries(data)) {
			let [key, schedule] = entry
			console.log(schedule['dates'])
			console.log(typeof (schedule['dates']))
			schedulesByDate[key] = schedule['dates']//.map((value:DateTime) => (value).toFormat("yyyy-MM-dd"))
		}
	}

	let fromDate = DateTime.now().minus(Duration.fromObject({ month: 1 })).startOf('month')
	let toDate = DateTime.now().plus(Duration.fromObject({ month: 2 })).endOf('month')
	let dates: DateTime[] = []
	let dateFormat = "yyyy-MM-dd";
	let theDate = fromDate;
	while (theDate <= toDate) {
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
				schedulesToday.push({ title: data[id]["name"], date: date })
			}
		}
		return schedulesToday
	}
	return <ListBase {...props}>
		<Title title={title} />
		{/* <ListToolbar
			filters={filters}
			actions={actions}
		/> */}
		{/* <Card> */}
		{/* {props.children} */}
		<FullCalendar
			plugins={[dayGridPlugin]}
			initialView="dayGridMonth"
			events={dates.map((date) => schedulesForDate(date.toFormat(dateFormat))).reduce((prev, curr) => prev.concat(curr))}
			nowIndicator={true}
			validRange={{
				start: fromDate.toFormat(dateFormat),
				end: toDate.toFormat(dateFormat)
			}}
			{...rest}
		/>
		{/* </Card> */}
		{/* <Pagination /> */}
	</ListBase>;
}
export default CalendarDates;