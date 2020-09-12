import React, { useState } from "react";
import "./Calendar.css";
import dateFns from "date-fns";
import SelectHeader from "../SelectHeader";

export interface IScheduleDates {
    [key: string]: { name: string; color: string; dates?: number[] };
}
import BellSchedule from "../../@types/bellschedule";
import find from "lodash.find";

export interface ICalendarProps {
    schedules: BellSchedule[];
    colors: string[];
    onDateChange: (schedule: BellSchedule) => void;
    selectedSchedule: string;
}

const Calendar = (props: ICalendarProps) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    // const initialOptions: { [key: string]: number[] } = {};

    // Object.entries(props.options).forEach(value => {
    //     const [id, options] = value;
    //     if (options.dates) {
    //         initialOptions[id] = options.dates;
    //     }
    // });

    // //this probably needs to be moved up a level so that it can be sent to the API
    // const [selectedDates, setSelectedDates] = useState(initialOptions);

    const config = { weekStartsOn: 1 };
    const startDate = dateFns.startOfWeek(dateFns.startOfMonth(selectedMonth), config);
    const endDate = dateFns.endOfWeek(dateFns.endOfMonth(selectedMonth), config);

    const onDateClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const dateValue: Date = new Date(parseInt(event.currentTarget.dataset.date!, 10));
        if (isValidDate(dateValue)) {
            // const next = getNextOptionForDate(dateValue);
            if (props.selectedSchedule === "") {
                alert("Please select a schedule to assign a date")
            } else{
                setScheduleForDate(dateValue, props.selectedSchedule);

            }
        } else {
            console.log("invalid date");
        }

        // event.currentTarget.value = props.options[(key + 1) % props.options.length];
    };


    const getScheduleById = (schedules: BellSchedule[], id: string) => {
        //kinda duplicated from bellschedule defenition
        if (!schedules) {
            return
        } else {
            return find(schedules, schedule => { return schedule.getIdentifier() === id; });
        }
    }
    // const getNextOptionForDate = (date: Date) => {
    //     const location = getGroupAndPositionForDate(date);
    //     const currentOptionKey = location ? location[0] : undefined;
    //     const optionKeys = Object.keys(props.options);

    //     if (!location) {
    //         return optionKeys[0];
    //     } else if (
    //         currentOptionKey &&
    //         currentOptionKey === optionKeys[optionKeys.length - 1]
    //     ) {
    //         return;
    //     } else if (currentOptionKey) {
    //         return optionKeys[optionKeys.indexOf(currentOptionKey) + 1];
    //     }
    // };

    const setScheduleForDate = (date: Date, option?: string) => {
        const location = getGroupAndPositionForDate(date);

        if (location && option) {
            const [optionKey, posInOption] = location;
            //the date is in a different schedule than the one provided. move it
            if (optionKey !== option) {
                let updatedSelections = props.options;
                //remove from the old schedule
                updatedSelections = removeDateFromSelectionList(
                    updatedSelections,
                    optionKey,
                    posInOption
                );
                //add to the new schedule
                updatedSelections = addDateToSelectionList(
                    updatedSelections,
                    option,
                    date
                );
                props.onDateChange(updatedSelections);
            
            } else {
                props.onDateChange(
                    removeDateFromSelectionList(props.options, optionKey, posInOption)
                );
            }
        } else if (!location && option) {
            props.onDateChange(addDateToSelectionList(props.options, option, date));
        } else if (location && !option) {
            const [optionKey, posInOption] = location;
            props.onDateChange(
                removeDateFromSelectionList(props.options, optionKey, posInOption)
            );
        }
    };

    //https://stackoverflow.com/a/1353711
    const isValidDate = (d: Date) => {
        return d instanceof Date && !isNaN(d.getTime());
    };

    const addDateToSelectionList = (
        datesSelected: IScheduleDates,
        option: string,
        date: Date
    ) => {
        const selectedDates = datesSelected[option].dates;
        const updatedOption: IScheduleDates = Object.assign({}, datesSelected);

        if (selectedDates) {
            updatedOption[option].dates = [...selectedDates, date.getTime()];
        }

        return updatedOption;
    };


    const removeDateFromSelectionList = (
        datesSelected: IScheduleDates,
        option: string,
        index: number
    ) => {
        const selectedDates = datesSelected[option].dates;
        const updatedOption: IScheduleDates = Object.assign({}, datesSelected);

        if (selectedDates) {
            updatedOption[option].dates = [
                ...selectedDates.slice(0, index),
                ...selectedDates.slice(index + 1)
            ];
        }

        return updatedOption;
    };

    const getGroupAndPositionForDate = (date: Date): [string, number] | undefined => {
        for (const key in props.options) {
            if (props.options.hasOwnProperty(key)) {
                // const possibleDates = dates.filter((value: number) => {
                //     const selDate = new Date(value);
                //     return (
                //         selDate.getFullYear() === date.getFullYear() &&
                //         selDate.getMonth() === date.getMonth() &&
                //         selDate.getDate() === date.getDate()
                //     );
                // });
                // console.log("poss: ", date.getTime(), possibleDates);

                const dates = props.options[key].dates;

                if (!dates) { return; }
                
                const indexInGroup = dates.indexOf(date.getTime());
                if (indexInGroup !== -1) {
                    return [key, indexInGroup];
                }
            }
        }
        return;
    };

    const getWeekdayNameHeaders = () => {
        const dayNames = [];

        for (let i = 0; i < 7; i++) {
            dayNames.push(dateFns.format(dateFns.addDays(startDate, i), "ddd"));
        }
        return dayNames;
    };

    const getMonthGrid = () => {
        const monthGrid = [];
        let tempRowData = [];

        for (
            let dateIndex = 0;
            dateIndex <= dateFns.differenceInDays(endDate, startDate);
            dateIndex++
        ) {
            const date = dateFns.addDays(startDate, dateIndex);
            const firstDayOfWeek = dateFns.startOfWeek(date, config);
            const firstDayOfWeekTomorrow = dateFns.startOfWeek(
                dateFns.addDays(date, 1),
                config
            );

            const location = getGroupAndPositionForDate(date);
            const currentOptionKey = location ? location[0] : undefined;

            const bgColor = currentOptionKey
                ? { backgroundColor: props.options[currentOptionKey].color }
                : undefined;

            const name = currentOptionKey
                ? props.options[currentOptionKey].name
                : undefined;

            tempRowData.push(
                <td key={"date" + dateIndex}>
                    <div
                        onClick={event => onDateClick(event)}
                        className={
                            dateFns.getMonth(date) !== dateFns.getMonth(selectedMonth)
                                ? "disabled"
                                : undefined
                        }
                        data-date={date.getTime()}
                        style={bgColor}
                        title={name}
                    >
                        {date.getDate()}
                    </div>
                </td>
            );

            if (!dateFns.isEqual(firstDayOfWeek, firstDayOfWeekTomorrow)) {
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
                                setSelectedMonth(dateFns.subMonths(selectedMonth, 1))
                            }
                            content={dateFns.format(selectedMonth, "MMMM YYYY")}
                            nextAction={() =>
                                setSelectedMonth(dateFns.addMonths(selectedMonth, 1))
                            }
                        />
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
