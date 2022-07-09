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
	// let scheduelsByDate = { [key:string]: string};
	// console.log(data)
	// console.log(typeof(data))
	let schedulesByDate: { [key: string]: string[]} = {};
	if (!loading && data != {}) {
		for (let entry of Object.entries(data)) {
			let [key, schedule] = entry
			console.log(schedule['dates'])
			console.log(typeof (schedule['dates']))
			schedulesByDate[key] = schedule['dates']//.map((value:DateTime) => (value).toFormat("yyyy-MM-dd"))
		}

		// schedulesByDate = data();
		// {
		// 	for (let date of schedule.getDates()) {
		// 		if (schedulesByDate[date.toFormat("YYYY-MM-DD")] != undefined ) {

		// 		} else {
		// 			schedulesByDate[date.toFormat("YYYY-MM-DD")] = [schedule.getIdentifier()]
		// 		}
		// 	}
			
		// }
	}

	let iterateDate = DateTime.now().startOf('month')

	let dates: DateTime[] = []

	for (let index = 7; index < 10; index++) {
		dates.push(iterateDate.plus(Duration.fromObject({ days: index })))
		// iterateDate
		
	}
	// while (iterateDate < iterateDate.endOf('month')) {
		// dates.push(iterateDate)
		// iterateDate = iterateDate.plus(Duration.fromObject({days: 1}))
	// }
	console.log(dates)

	// const scheduleHasDate = (scheduleID: string, strdate:string) => {
	// 	scheduelsByDate[scheduleID].map((date: DateTime) => date.toFormat("yyyy-MM-dd")).contains(strdate)
	// }

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

	const listSchedulesForDate = (date:string) => {
		let scheduelsToday = ""
		for (let entry of Object.entries(schedulesByDate)) {
			let [id, scheduledates] = entry;
			// let datesmap = scheduledates.map((value) => (value).toFormat("yyyy-MM-dd"));
			if (scheduledates.find((value, index, obj) => value == date)) {
				scheduelsToday += id + " "
			}
		}
		return scheduelsToday
	}





	return (
		<FullCalendar
			plugins={[dayGridPlugin]}
			initialView="dayGridMonth"
			events={dates.map((date) => schedulesForDate(date.toFormat("yyyy-MM-dd"))).reduce((prev, curr) => prev.concat(curr) )}
			nowIndicator={true}
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