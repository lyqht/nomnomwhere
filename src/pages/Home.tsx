import React, { useEffect, useState } from 'react';
import { Restaurant } from '../../api/types/Restaurant';
import FileUpload from '../components/FileUpload';
import Table from '../components/Table';
import SearchFiltersSection, {
    SearchFilters,
} from '../components/SearchFilters';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayWithOpeningHours } from '../../api/types/OpeningHours';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const emoji = ['🍔', '🌯', '🥗', '🍜', '🍙', '🍕', '😫', '😵'];
const getRandomItem = (items: string[]) =>
    items[Math.floor(Math.random() * items.length)];

function Home(): JSX.Element {
    const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
    const [displayedRestaurants, setDisplayedRestaurants] = useState<
        Restaurant[]
    >([]);
    const [searchNameInput, setSearchNameInput] = useState<string>();
    const [filters, setFilters] = useState<SearchFilters>({
        days: [],
        timeRange: ['11:00', '22:00'],
    });

    useEffect(() => {
        fetch('/api')
            .then((response) => response.json())
            .then(({ data }: { data: Restaurant[] }) => {
                setRestaurants(data);
                setDisplayedRestaurants(data);
            });
    }, []);

    useEffect(() => {
        if (searchNameInput) {
            setDisplayedRestaurants(
                restaurants?.filter((stall) =>
                    stall.name
                        .toLowerCase()
                        .includes(searchNameInput.toLowerCase()),
                ) ?? [],
            );
        } else {
            setDisplayedRestaurants(restaurants!);
        }
    }, [searchNameInput]);

    useEffect(() => {
        if (restaurants) {
            const filtered = restaurants.filter(
                (stall) =>
                    stall.opening_hours.filter(
                        (timeslot: DayWithOpeningHours) => {
                            const storeIsOpenInSelectedDays =
                                filters.days.length > 0
                                    ? filters.days.includes(timeslot.day)
                                    : true;
                            const storeIsOpenInSelectedTimeRange =
                                dayjs(filters.timeRange[0], [
                                    'h:m a',
                                    'H:m',
                                ]).isAfter(
                                    dayjs(timeslot.openingTime, [
                                        'h:m a',
                                        'H:m',
                                        'hha',
                                    ]),
                                ) &&
                                dayjs(filters.timeRange[1], [
                                    'h:m a',
                                    'H:m',
                                ]).isBefore(
                                    dayjs(timeslot.closingTime, [
                                        'h:m a',
                                        'H:m',
                                        'hha',
                                    ]),
                                );

                            return (
                                storeIsOpenInSelectedDays &&
                                storeIsOpenInSelectedTimeRange
                            );
                        },
                    ).length > 0,
            );
            setDisplayedRestaurants(filtered);
        }
    }, [filters.days.length, filters.timeRange[0], filters.timeRange[1]]);

    return (
        <div className="p-12 h-screen">
            <div className="flex flex-col h-full">
                <div className="flex flex-row justify-between">
                    <h1 className="text-5xl font-bold italic">
                        Nomnom where? {getRandomItem(emoji)}
                    </h1>
                </div>

                <div className="py-8 h-3/4 w-full flex flex-row">
                    {restaurants ? (
                        <>
                            <Table data={displayedRestaurants} />
                            <div className="px-8 w-1/2">
                                <SearchFiltersSection
                                    searchFilters={filters}
                                    setSearchFilters={setFilters}
                                    setSearchNameInput={setSearchNameInput}
                                />
                                <div className="py-4" id="collections">
                                    My collections
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Fetching restaurants!</p>
                    )}
                </div>
                <FileUpload />
            </div>
        </div>
    );
}

export default Home;
