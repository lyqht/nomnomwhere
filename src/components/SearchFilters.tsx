import React, { useState } from 'react';

export type SearchFilters = {
    day: string[];
    openingTime: string[];
    closingTime: string[];
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
    const getUpdatedFilters = (day: string, toShow: boolean): SearchFilters => {
        const modifiedSearchFilters = { ...searchFilters };
        if (modifiedSearchFilters.day.includes(day)) {
            if (!toShow) {
                modifiedSearchFilters.day.splice(
                    modifiedSearchFilters.day.findIndex((d) => d === day),
                    1,
                );
            }
        } else {
            if (toShow) {
                modifiedSearchFilters.day.push(day);
            }
        }
        return modifiedSearchFilters;
    };

    return (
        <div>
            <div id="search-by-name-section">
                <h2>Search by name</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Search…"
                        className="input input-bordered"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-square"
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
            <div className="py-4">
                <h2>Search by day</h2>
                <div className="form-control">
                    {weekdays.map((weekday) => (
                        <label
                            key={`search-filter-${weekday}`}
                            className="label cursor-pointer"
                        >
                            <span className="label-text">{weekday}</span>
                            <input
                                type="checkbox"
                                checked={searchFilters.day.includes(weekday)}
                                onChange={(e) =>
                                    setSearchFilters(
                                        getUpdatedFilters(
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
        </div>
    );
};

export default SearchFiltersSection;
