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
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'; // for selectable
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
							id: eventEl.getAttribute('data-record-id')
						}
					}
				});
			} else {
				// trigger a re-run maybe?
				setDraggableInitialized(false)
			}
		}
	}, [data, draggableInitialized])


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
			selectOverlap={false}
			contentHeight={600}
			eventReceive={(info) => {
				console.log("received info event: ")
				console.log(info.event)
				console.log(info.event._def.publicId)
				console.log(info.event._def.title)
				console.log(info.event._instance?.range.start)
				console.log(info.event._instance?.range.end)
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