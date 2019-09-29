import React from "react";

export interface IScheduleEntryProps {
    name: string;
    startTime: string;
    endTime: string;
}

const ScheduleEntry = (props: IScheduleEntryProps) => {
    return (
        <div>
            {props.name}: {props.startTime} - {props.endTime}
        </div>
    );
};

export default ScheduleEntry;
