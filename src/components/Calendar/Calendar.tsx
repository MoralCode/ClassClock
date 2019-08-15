import React, { useState } from "react";
import "./Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import dateFns from "date-fns";
import Link from "../Link";

export interface IScheduleDates {
    [key: string]: { name: string; color: string; dates?: number[] };
}

export interface ICalendarProps {
    options: IScheduleDates;
}

const Calendar = (props: ICalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const initialOptions: { [key: string]: number[] } = {};

    Object.entries(props.options).forEach(value => {
        const [id, options] = value;
        if (options.dates) {
            initialOptions[id] = options.dates;
        }
    });

    const [selectedDates, setSelectedDates] = useState(initialOptions);

    const config = { weekStartsOn: 1 };
    const startDate = dateFns.startOfWeek(dateFns.startOfMonth(currentMonth), config);
    const endDate = dateFns.endOfWeek(dateFns.endOfMonth(currentMonth), config);

    const onDateClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const dateValue: Date = new Date(parseInt(event.currentTarget.dataset.date!, 10));
        if (isValidDate(dateValue)) {
            const next = getNextOptionForDate(dateValue);
            setOptionForDate(dateValue, next);
        } else {
            console.log("invalid date");
        }

        // event.currentTarget.value = props.options[(key + 1) % props.options.length];
    };

    const getNextOptionForDate = (date: Date) => {
        const location = getGroupAndPositionForDate(date);
        const currentOptionKey = location ? location[0] : undefined;
        const optionKeys = Object.keys(props.options);

        if (!location) {
            return optionKeys[0];
        } else if (
            currentOptionKey &&
            currentOptionKey === optionKeys[optionKeys.length - 1]
        ) {
            return;
        } else if (currentOptionKey) {
            return optionKeys[optionKeys.indexOf(currentOptionKey) + 1];
        }
    };

    const setOptionForDate = (date: Date, option?: string) => {
        const location = getGroupAndPositionForDate(date);

        if (location && option) {
            const [optionKey, posInOption] = location;

            if (optionKey !== option) {
                let updatedSelections = selectedDates;
                updatedSelections = removeDateFromSelectionList(
                    updatedSelections,
                    optionKey,
                    posInOption
                );
                updatedSelections = addDateToSelectionList(
                    updatedSelections,
                    option,
                    date
                );
                setSelectedDates(updatedSelections);
            }
        } else if (!location && option) {
            setSelectedDates(addDateToSelectionList(selectedDates, option, date));
        } else if (location && !option) {
            const [optionKey, posInOption] = location;
            setSelectedDates(
                removeDateFromSelectionList(selectedDates, optionKey, posInOption)
            );
        }
    };

    //https://stackoverflow.com/a/1353711
    const isValidDate = (d: Date) => {
        return d instanceof Date && !isNaN(d.getTime());
    };

    const addDateToSelectionList = (
        datesSelected: { [key: string]: number[] },
        option: string,
        date: Date
    ) => {
        const updatedGroup: { [key: string]: number[] } = {};
        updatedGroup[option] = [...datesSelected[option], date.getTime()];
        const result = Object.assign({}, datesSelected, updatedGroup);

        return result;
    };

    const removeDateFromSelectionList = (
        datesSelected: { [key: string]: number[] },
        option: string,
        index: number
    ) => {
        const updatedGroup: { [key: string]: number[] } = {};
        updatedGroup[option] = [
            ...datesSelected[option].slice(0, index),
            ...datesSelected[option].slice(index + 1)
        ];

        const result = Object.assign({}, datesSelected, updatedGroup);

        return result;
    };

    const getGroupAndPositionForDate = (date: Date): [string, number] | undefined => {
        // const groups: Array<[string, number]> = [];
        for (const key in selectedDates) {
            if (selectedDates.hasOwnProperty(key)) {
                const indexInGroup = selectedDates[key].indexOf(date.getTime());
                if (indexInGroup !== -1) {
                    return [key, indexInGroup];
                }
            }
        }

        return;
        // const dateInUnixTime = date.getTime();
        // const index = selectedDates[key].indexOf(dateInUnixTime);
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

            const color = currentOptionKey
                ? { backgroundColor: props.options[currentOptionKey].color }
                : undefined;

            tempRowData.push(
                <td key={"date" + dateIndex}>
                    <span
                        onClick={event => onDateClick(event)}
                        className={
                            dateFns.getMonth(date) !== dateFns.getMonth(currentMonth)
                                ? "disabled"
                                : undefined
                        }
                        data-date={date.getTime()}
                        style={color}
                    >
                        {date.getDate()}
                    </span>
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
                        <Link
                            destination={() =>
                                setCurrentMonth(dateFns.subMonths(currentMonth, 1))
                            }
                            className="smallIcon"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Link>
                        <span id="monthDisplay">
                            {dateFns.format(currentMonth, "MMMM YYYY")}
                        </span>
                        <Link
                            destination={() =>
                                setCurrentMonth(dateFns.addMonths(currentMonth, 1))
                            }
                            className="smallIcon"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </Link>
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
