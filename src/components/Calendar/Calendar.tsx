import React, { useState, useEffect } from "react";
import "./Calendar.css";
import SelectHeader from "../SelectHeader";
import BellSchedule from "../../@types/bellschedule";
import find from "lodash.find";
import { DateTime } from "luxon";


export interface ICalendarProps {
    schedules?: BellSchedule[];
    selectedScheduleId: string;
}

const Calendar = (props: ICalendarProps) => {
    // const initialOptions: { [key: string]: number[] } = {};
    const getSelectedMonth = () => {
        const persisted = sessionStorage.getItem('selectedMonth');
        return persisted ? DateTime.fromMillis(parseInt(persisted, 10)) : DateTime.local();
    };

    
    const [selectedMonth, setSelectedMonth] = useState(getSelectedMonth);

   useEffect(function persistForm() {
        sessionStorage.setItem('selectedMonth', selectedMonth.toMillis().toString());
    });

    const startDate = selectedMonth.startOf('month').startOf('week')
    const endDate = selectedMonth.endOf('month').endOf('week')

    // https://felixgerschau.com/react-rerender-components/#force-an-update-in-react-hooks
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const onDateClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const dateValue: DateTime = DateTime.fromMillis(parseInt(event.currentTarget.dataset.date!, 10));
        if (dateValue.isValid) {
            const currentSchedule = getScheduleForDate(dateValue);
            const selectedSchedule = getScheduleById(props.selectedScheduleId);
            let value = selectedSchedule;

            if (!selectedSchedule) {
                alert("Please select a schedule to assign a date")
            } else if (currentSchedule && (selectedSchedule.getIdentifier() === currentSchedule.getIdentifier())) {
                //if the date belongs to this schedule, remove it
                value = undefined;
            }
            setScheduleForDate(dateValue, value);
        } else {
            console.log("invalid date");
        }
    };


    const getScheduleById = (id: string) => {
        //kinda duplicated from school defenition
        if (!props.schedules || props.schedules === []) {
            return
        } else {
            return find(props.schedules, schedule => { return schedule.getIdentifier() === id; });
        }
    }

    const setScheduleForDate = (date: DateTime, schedule?: BellSchedule) => {
        const currentSchedule = getScheduleForDate(date);

        if (currentSchedule && schedule) {
            //the date is in a different schedule than the one provided. move it
            //remove from the old schedule
            currentSchedule.removeDate(date);
            
            //add to the new schedule
            schedule.addDate(date);
            
        } else if (!currentSchedule && schedule) {
            //date was not in a schedule previously
            schedule.addDate(date)
            
        } else if (currentSchedule && !schedule) {
            //date is in a schedule and is being removed
            currentSchedule.removeDate(date)
        }
        forceUpdate();
    };

    const getScheduleForDate = (date: DateTime): BellSchedule | undefined => {
        if (props.schedules) {        
            for (const schedule of props.schedules) {
                if (schedule.getDate(date)){
                    return schedule;
                }
            }
        }
        return;
    };

    const getWeekdayNameHeaders = () => {
        const dayNames = [];

        for (let i = 0; i < 7; i++) {
            dayNames.push(startDate.plus({ days: i }).toFormat("ddd"));
        }
        return dayNames;
    };

    const getMonthGrid = () => {
        const monthGrid = [];
        let tempRowData = [];

        for (
            let dateIndex = 0;
            dateIndex <= endDate.diff(startDate).days;
            dateIndex++
        ) {
            const date = startDate.plus({ days: dateIndex });
            const firstDayOfWeek = date.startOf('week')
            const firstDayOfWeekTomorrow = date.plus({ days: 1 }).startOf('week')

            const schedule = getScheduleForDate(date);
            //show the schedule's assigned color if it is selected
            const backupColor = schedule ? "rgba(0, 0, 0, 0.1)" : undefined;
            const color = schedule && schedule.getIdentifier() === props.selectedScheduleId ? schedule.getColor() : backupColor;
            const bgColor = { backgroundColor: color };
            const name = schedule ? schedule.getName() : undefined;

            tempRowData.push(
                <td key={"date" + dateIndex}>
                    <div
                        onClick={event => onDateClick(event)}
                        className={
                            date.get('month') !== selectedMonth.get('month')
                                ? "disabled"
                                : undefined
                        }
                        data-date={date.toMillis()}
                        style={bgColor}
                        title={name}
                    >
                        {date.get('day')}
                    </div>
                </td>
            );

            if (!firstDayOfWeek.equals(firstDayOfWeekTomorrow)) {
                monthGrid.push(<tr key={"weekBegin" + dateIndex}>{tempRowData}</tr>);
                tempRowData = [];
            }
        }
        return monthGrid;
    };

    return (
        <table className="calendarGrid">
            <thead>
                <tr>
                    <th colSpan={7}>
                        <SelectHeader
                            lastAction={() =>
                                setSelectedMonth(selectedMonth.minus({ month: 1 }))
                            }
                            nextAction={() =>
                                setSelectedMonth(selectedMonth.plus({month: 1}))
                            }
                        >
                            {selectedMonth.toFormat("MMMM YYYY")}
                        </SelectHeader>
                    </th>
                </tr>
                <tr>
                    {getWeekdayNameHeaders().map((value: string, index: number) => (
                        <td key={index}>{value}</td>
                    ))}
                </tr>
            </thead>
            <tbody>{getMonthGrid()}</tbody>
        </table>
    );
};

export default Calendar;
