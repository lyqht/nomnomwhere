const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type DayWithOpeningHours = {
    day: string;
    openingTime: string | null;
    closingTime: string | null;
};

const isNumber = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0);

export const mapIntervalIntoDateRangeAndTimeRange = (
    input: string,
): string[] => {
    const letters = input.split('');
    let letterIsPartOfTimeString = false;

    const dateRangeString: string[] = [];
    const timeRangeString: string[] = [];
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (!letterIsPartOfTimeString) {
            if (!isNumber(letter)) {
                dateRangeString.push(letter);
            } else {
                letterIsPartOfTimeString = true;
                timeRangeString.push(letter);
            }
        } else {
            if (letter !== ' ') {
                timeRangeString.push(letter);
            }
        }
    }

    return [dateRangeString.join('').trim(), timeRangeString.join('').trim()];
};

export const mapDayRangeAndTimeRangeToDaysWithOpeningHours = (
    input: string[],
): DayWithOpeningHours[] => {
    if (input.length !== 2) {
        throw new Error(
            'This method is expecting a date range & time range input.',
        );
    }

    const dateRange = input[0];
    const timeRange = input[1];
    const [startDay, endDay] = dateRange.split('-');
    const dates: string[] = [];
    const startDayIndex = weekdays.findIndex((day) => day === startDay);
    const endDayIndex = weekdays.findIndex((day) => day === endDay);
    let currentDayToAddIndex = startDayIndex;

    if (endDayIndex === -1) {
        dates.push(weekdays[startDayIndex]);
    } else {
        while (currentDayToAddIndex !== endDayIndex + 1) {
            dates.push(weekdays[currentDayToAddIndex]);
            if (currentDayToAddIndex + 1 > weekdays.length - 1) {
                currentDayToAddIndex = 0;
            } else {
                currentDayToAddIndex += 1;
            }
        }
    }

    const [openingTime, closingTime] = timeRange.split('-');
    return dates.map((day) => ({ day, openingTime, closingTime }));
};

export const mapAllOpeningHoursIntoDaysWithOpeningHours = (
    input: string,
): DayWithOpeningHours[] => {
    const intervals = input.split('/');
    const arrayOfDaysWithOpeningHours = intervals.map((interval) => {
        const formattedInterval = interval.trim();
        const dateRangeAndTimeRange =
            mapIntervalIntoDateRangeAndTimeRange(formattedInterval);
        return mapDayRangeAndTimeRangeToDaysWithOpeningHours(
            dateRangeAndTimeRange,
        );
    });

    return arrayOfDaysWithOpeningHours.reduce((a, b) => a.concat(b), []);
};
