import { describe, expect, it } from 'vitest';
import {
    mapIntervalIntoDateRangeAndTimeRange,
    mapDayRangeAndTimeRangeToDaysWithOpeningHours,
    mapAllOpeningHoursIntoDaysWithOpeningHours,
} from './openingHoursMapper';

describe('Opening Hours Mapper', () => {
    describe('mapIntervalIntoDateRangeAndTimeRange should map an opening hours interval into specific day range and time range', () => {
        it('when input contains a date range with time range', () => {
            const input = 'Mon-Tue 11:30 am - 9 pm';
            expect(mapIntervalIntoDateRangeAndTimeRange(input)).toEqual([
                'Mon-Tue',
                '11:30am-9pm',
            ]);
        });

        it('when input contains single day with time range', () => {
            const input = 'Mon 11:30 am - 9 pm';
            expect(mapIntervalIntoDateRangeAndTimeRange(input)).toEqual([
                'Mon',
                '11:30am-9pm',
            ]);
        });
    });

    describe('mapDayRangeAndTimeRangeToDaysWithOpeningHours should return all days within an interval with same opening & closing hours', () => {
        it('when day range is only 2 days', () => {
            const input = ['Mon-Tue', '11:30am-9pm'];
            expect(
                mapDayRangeAndTimeRangeToDaysWithOpeningHours(input),
            ).toEqual([
                {
                    day: 'Mon',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Tue',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
            ]);
        });

        it('when day range exceeds 2 days, and is within same week', () => {
            const input = ['Tue-Fri', '11:30am-9pm'];
            expect(
                mapDayRangeAndTimeRangeToDaysWithOpeningHours(input),
            ).toEqual([
                {
                    day: 'Tue',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Wed',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Thu',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Fri',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
            ]);
        });

        it('when day range exceeds 2 days, and spills over to next week', () => {
            const input = ['Sat-Mon', '11:30am-9pm'];
            expect(
                mapDayRangeAndTimeRangeToDaysWithOpeningHours(input),
            ).toEqual([
                {
                    day: 'Sat',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Sun',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Mon',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
            ]);
        });

        it('when date range has startDayIndex === endDayIndex + 1', () => {
            const input = ['Mon-Sun', '11:30am-9pm'];
            expect(
                mapDayRangeAndTimeRangeToDaysWithOpeningHours(input),
            ).toEqual([
                {
                    day: 'Sun',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Mon',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Tue',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Wed',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Thu',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Fri',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Sat',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
            ]);
        });

        it('when day range is only 1 day', () => {
            const input = ['Mon', '11:30am-9pm'];
            expect(
                mapDayRangeAndTimeRangeToDaysWithOpeningHours(input),
            ).toEqual([
                {
                    day: 'Mon',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
            ]);
        });

        it.each([
            ['Tues', 'Tue'],
            ['Weds', 'Wed'],
            ['Thurs', 'Thu'],
        ])(
            'when given day range contains a day with length more than 3: %s',
            (a, b) => {
                const input = [a, '11:30am-9pm'];
                expect(
                    mapDayRangeAndTimeRangeToDaysWithOpeningHours(input)[0].day,
                ).toEqual(b);
            },
        );

        it('throw error when given input is not a date range and time range', () => {
            const input = [''];
            expect(() =>
                mapDayRangeAndTimeRangeToDaysWithOpeningHours(input),
            ).toThrowError(
                new Error(
                    'This method is expecting a date range & time range input.',
                ),
            );
        });
    });

    describe('mapAllOpeningHoursIntoDaysWithOpeningHours should return array of days with opening hours', () => {
        it('when given only one interval of opening hours', () => {
            const input = 'Mon-Tue 11:30 am - 9 pm';
            expect(mapAllOpeningHoursIntoDaysWithOpeningHours(input)).toEqual([
                {
                    day: 'Mon',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
                {
                    day: 'Tue',
                    openingTime: '11:30am',
                    closingTime: '9pm',
                },
            ]);
        });

        it('when given multiple intervals of opening hours', () => {
            const input =
                'Mon-Wed 5 pm - 12:30 am  / Thu-Fri 5 pm - 1:30 am  / Sat 3 pm - 1:30 am  / Sun 3 pm - 11:30 pm';
            expect(mapAllOpeningHoursIntoDaysWithOpeningHours(input)).toEqual([
                {
                    day: 'Mon',
                    openingTime: '5pm',
                    closingTime: '12:30am',
                },
                {
                    day: 'Tue',
                    openingTime: '5pm',
                    closingTime: '12:30am',
                },
                {
                    day: 'Wed',
                    openingTime: '5pm',
                    closingTime: '12:30am',
                },
                {
                    day: 'Thu',
                    openingTime: '5pm',
                    closingTime: '1:30am',
                },
                {
                    day: 'Fri',
                    openingTime: '5pm',
                    closingTime: '1:30am',
                },
                {
                    day: 'Sat',
                    openingTime: '3pm',
                    closingTime: '1:30am',
                },
                {
                    day: 'Sun',
                    openingTime: '3pm',
                    closingTime: '11:30pm',
                },
            ]);
        });
    });
});
