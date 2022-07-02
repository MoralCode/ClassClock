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

interface CalendarDatesProps { 
	children: JSX.Element, 
	// actions, 
	// filters, 
	title: string
}

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
		<ul>
			{dates.map((date) => {

				let strdate = date.toFormat("yyyy-MM-dd");
				return (
					<li key={strdate}>
						{strdate}: {listSchedulesForDate(strdate)}
					</li>
				)
			}
		)}
		{/* <li>hiiiii</li> */}
		</ul>
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