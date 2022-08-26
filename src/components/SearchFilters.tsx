import React, { useState } from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

export type SearchFilters = {
    days: string[];
    timeRange: [string, string];
};

interface Props {
    setSearchNameInput: (x: string) => void;
    searchFilters: SearchFilters;
    setSearchFilters: (x: SearchFilters) => void;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SearchFiltersSection: React.FC<Props> = ({
    setSearchNameInput,
    setSearchFilters,
    searchFilters,
}) => {
    const [name, setName] = useState('');
    const [days, setDays] = useState(searchFilters.days);
    const [timeRange, setTimeRange] = useState(searchFilters.timeRange);
    const getSelectedDays = (day: string, toShow: boolean): string[] => {
        const modifiedDays = [...days];
        if (modifiedDays.includes(day)) {
            if (!toShow) {
                modifiedDays.splice(
                    modifiedDays.findIndex((d) => d === day),
                    1,
                );
            }
        } else {
            if (toShow) {
                modifiedDays.push(day);
            }
        }
        return modifiedDays;
    };

    return (
        <div id="search-filters-section" className="shadow-md p-8 card">
            <div id="search-by-name-section">
                <h2 className="text-lg">Search by name</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Search…"
                        className="input input-bordered"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-primary btn-square"
                        title="search"
                        onClick={() => setSearchNameInput(name)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div id="search-by-datetime-section">
                <div id="search-by-day-section" className="py-4">
                    <h2 className="text-lg">Search by opening hours</h2>
                    <div className="form-control flex flex-row flex-wrap gap-2 py-4">
                        {weekdays.map((weekday) => (
                            <label
                                key={`search-filter-${weekday}`}
                                className="label cursor-pointer badge badge-primary badge-outline p-4 items-center"
                            >
                                <span className="label-text mr-2">
                                    {weekday}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={days.includes(weekday)}
                                    onChange={(e) =>
                                        setDays(
                                            getSelectedDays(
                                                weekday,
                                                e.target.checked,
                                            ),
                                        )
                                    }
                                    className="checkbox checkbox-primary"
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div id="search-by-timerange-section" className="py-4">
                    <TimeRangePicker
                        disableClock={true}
                        onChange={setTimeRange}
                        value={timeRange}
                    />
                </div>
                <button
                    title={'Submit search filter'}
                    className="btn btn-primary btn-block mt-4"
                    onClick={() => {
                        setSearchFilters({ days, timeRange });
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default SearchFiltersSection;
