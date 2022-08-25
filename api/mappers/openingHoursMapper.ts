import { DayWithOpeningHours } from '../types/OpeningHours';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const isNumber = (n: string) => !isNaN(parseFloat(n)) && !isNaN((n as any) - 0);

export const mapIntervalIntoDateRangeAndTimeRange = (
    input: string,
): string[] => {
    const letters = input.split('');
    let letterIsPartOfTimeString = false;

    const dateRangeString: string[] = [];
    const timeRangeString: string[] = [];
    for (const letter of letters) {
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
    let dates: string[] = [];
    let startDayIndex = weekdays.findIndex(
        (day) => day === startDay.substring(0, 3),
    );
    const endDayIndex = endDay
        ? weekdays.findIndex((day) => day === endDay.substring(0, 3))
        : -1;

    if (endDayIndex === -1) {
        dates.push(weekdays[startDayIndex]);
    } else if (startDayIndex === endDayIndex + 1) {
        dates = weekdays;
    } else {
        while (startDayIndex !== endDayIndex + 1) {
            dates.push(weekdays[startDayIndex]);
            if (startDayIndex + 1 > weekdays.length - 1) {
                startDayIndex = 0;
            } else {
                startDayIndex += 1;
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
    const arrayOfDaysWithOpeningHours: DayWithOpeningHours[] = [];

    intervals.forEach((interval) => {
        const formattedInterval = interval.trim();
        const dateRangeAndTimeRange =
            mapIntervalIntoDateRangeAndTimeRange(formattedInterval);
        const dayWithOpeningHours =
            mapDayRangeAndTimeRangeToDaysWithOpeningHours(
                dateRangeAndTimeRange,
            );
        arrayOfDaysWithOpeningHours.push(...dayWithOpeningHours);
    });

    return arrayOfDaysWithOpeningHours;
};
