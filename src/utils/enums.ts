export enum TimeStates {
    DAY_OFF = "day off",
    OUTSIDE_SCHOOL_HOURS = "outside school hours",
    SCHOOL_IN_CLASS_OUT = "school is in session, but class is not",
    CLASS_IN_SESSION = "class is in session"
}

export enum TimeComparisons {
    IS_BEFORE = -1, //"before",
    IS_DURING_OR_EXACTLY = 0, //"during/exactly",
    IS_AFTER = 1 //"after"
}
