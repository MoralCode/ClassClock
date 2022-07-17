import {
	useListContext,
	RaRecord,
	useDataProvider,
	useResourceContext
} from 'react-admin';
import { DateTime } from 'luxon';
import FullCalendar, { EventClickArg, EventSourceInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';

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
	const dataProvider = useDataProvider();
	const resource = useResourceContext();
	const {title, recordTransformer, fromDate, toDate, children, ...rest } = props; 
	const [draggableInitialized, setDraggableInitialized] = useState(false)

	useEffect(() => {
		// const elements = document.getElementsByClassName('draggableEvents')
		const draggableContainerEl = document.getElementById('draggable_calendar_items')
		if (!draggableInitialized) {
			console.log("container")
			console.log(draggableContainerEl)
			if (draggableContainerEl != null) {
				setDraggableInitialized(true)
				new Draggable(draggableContainerEl, {
					itemSelector: '.draggableEvent',
					eventData: function (eventEl) {
						return {
							title: eventEl.innerText,
							schedule_id: eventEl.getAttribute('data-record-id')
						}
					}
				});
			} else {
				// trigger a re-run maybe?
				setDraggableInitialized(false)
			}
		}
	}, [data, draggableInitialized])



	/// This is effectively a remove followed by an add.
	/// it's combined into one for efficiency when things get moved.
	/// if both source_date_str and destination_date_str are provided, this function will remove the source and add the destination.
	/// if either is undefined, then it will simply be an add or remove depending on which one is undefined/null
	const moveDate = (schedule_id: string, source_date_str?: string, destination_date_str?: string) => {
		let schedule = data.find((value) => value.id == schedule_id)
		console.log(schedule)
		console.log(schedule.dates)
		if (source_date_str != null) {
			let sourceDatePresent = schedule.dates.find((value: string) => value == source_date_str) != undefined
			if (sourceDatePresent) {
				schedule.dates.remove(destination_date_str)
			}
		}

		if (destination_date_str != null) {
			let destinationDatePresent = schedule.dates.find((value: string) => value == destination_date_str) != undefined

			if (!destinationDatePresent) {
				schedule.dates.push(destination_date_str)
			}
		}

		if (source_date_str == null && destination_date_str == null){
			return
		}
		console.log(schedule.dates)
		dataProvider.update(resource, {
			id: schedule.id,
			data: schedule,
			previousData: undefined
		})
		
	}

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
			editable={true}
			droppable={true}
			eventOverlap={false}
			contentHeight={600}
			eventReceive={(info) => {
				// this is called when an external (i.e. new) event is dropped onto the calendar
				moveDate(info.event.extendedProps.schedule_id, undefined, info.event.startStr)
			}}
			eventClick={(arg:EventClickArg) => {console.log(arg.event.title)}}
			nowIndicator={true}
			validRange={{
				start: fromDate.toFormat("yyyy-MM-dd"),
				end: toDate.toFormat("yyyy-MM-dd")
			}}
			{...rest}
		/>;
}
export default CalendarDates;