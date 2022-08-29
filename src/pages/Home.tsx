import React, { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import Table from '../components/Table';
import SearchFiltersSection, { SearchFilters } from '../components/SearchFilters';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Collection, DayWithOpeningHours, Restaurant } from '../../api/types/Entities';
import Collections from '../components/Collections';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const emoji = ['🍔', '🌯', '🥗', '🍜', '🍙', '🍕', '😫', '😵'];
const getRandomItem = (items: string[]) => items[Math.floor(Math.random() * items.length)];

function Home(): JSX.Element {
    const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [searchNameInput, setSearchNameInput] = useState<string>();
    const [filters, setFilters] = useState<SearchFilters>({
        days: [],
        timeRange: ['11:00', '22:00'],
    });
    const [userIsUploading, setUserIsUploading] = useState(false);

    const fetchAndSetRestaurants = () => {
        fetch('/api/restaurants')
            .then((response) => response.json())
            .then(({ data }: { data: Restaurant[] }) => {
                setRestaurants(data);
                setDisplayedRestaurants(data);
            });
    };

    const fetchAndSetCollections = () => {
        fetch('/api/collections')
            .then((response) => response.json())
            .then(({ data }: { data: Collection[] }) => {
                setCollections(data);
            });
    };

    useEffect(() => {
        fetchAndSetRestaurants();
        fetchAndSetCollections();
    }, []);

    useEffect(() => {
        if (searchNameInput) {
            setDisplayedRestaurants(
                restaurants?.filter((stall) =>
                    stall.name.toLowerCase().includes(searchNameInput.toLowerCase()),
                ) ?? [],
            );
        } else {
            setDisplayedRestaurants(restaurants!);
        }
    }, [searchNameInput]);

    useEffect(() => {
        fetchAndSetRestaurants();
    }, [userIsUploading]);

    useEffect(() => {
        if (restaurants) {
            if (selectedCollection) {
                setDisplayedRestaurants(
                    restaurants?.filter((stall) =>
                        selectedCollection.savedRestaurants.includes(stall.id),
                    ),
                );
            } else {
                setDisplayedRestaurants(restaurants);
            }
        }
    }, [selectedCollection?.id]);

    useEffect(() => {
        if (restaurants) {
            const filtered = restaurants.filter(
                (stall) =>
                    stall.opening_hours.filter((timeslot: DayWithOpeningHours) => {
                        const storeIsOpenInSelectedDays =
                            filters.days.length > 0 ? filters.days.includes(timeslot.day) : true;
                        const storeIsOpenInSelectedTimeRange =
                            dayjs(filters.timeRange[0], ['h:m a', 'H:m']).isAfter(
                                dayjs(timeslot.openingTime, ['h:m a', 'H:m', 'hha']),
                            ) &&
                            dayjs(filters.timeRange[1], ['h:m a', 'H:m']).isBefore(
                                dayjs(timeslot.closingTime, ['h:m a', 'H:m', 'hha']),
                            );

                        return storeIsOpenInSelectedDays && storeIsOpenInSelectedTimeRange;
                    }).length > 0,
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
                            <div className="w-1/2">
                                <Table
                                    collections={collections}
                                    data={displayedRestaurants}
                                    showSaveToCollectionColumn={selectedCollection ? false : true}
                                    fetchAndSetCollections={fetchAndSetCollections}
                                />
                                <FileUpload
                                    userIsUploading={userIsUploading}
                                    setUserIsUploading={setUserIsUploading}
                                />
                            </div>
                            <div className="px-8 w-1/2 flex flex-col gap-8">
                                <Collections
                                    collections={collections}
                                    fetchAndSetCollections={fetchAndSetCollections}
                                    setSelectedCollection={setSelectedCollection}
                                    selectedCollection={selectedCollection}
                                />
                                <SearchFiltersSection
                                    searchFilters={filters}
                                    setSearchFilters={setFilters}
                                    setSearchNameInput={setSearchNameInput}
                                />
                            </div>
                        </>
                    ) : (
                        <p>Fetching restaurants!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
