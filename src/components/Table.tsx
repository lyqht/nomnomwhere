import React, { useState } from 'react';
import { Restaurant } from '../../api/types/Restaurant';

interface Props {
    data: Restaurant[];
    toSaveInCollection: boolean;
}

function isDateBeforeToday(date: Date) {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

const Table: React.FC<Props> = ({ data, toSaveInCollection = false }) => {
    const [pageNumberIndex, setPageNumberIndex] = useState(0);

    return (
        <div className="overflow-x-auto h-full flex card shadow-md overflow-y-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Opening Hours</th>
                        {toSaveInCollection ? (
                            <th>Save in collection</th>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {data.map((stall) => (
                        <tr key={`row-${stall.id}`}>
                            <td className="w-24">
                                <div className="flex items-center">
                                    <div>
                                        <div className="font-bold w-1/3">
                                            {stall.name}
                                            <br />
                                            {!isDateBeforeToday(
                                                new Date(stall.created_at),
                                            ) ? (
                                                <span className="badge badge-ghost badge-sm">
                                                    Recently added
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {stall.opening_hours.map((openingHour) => (
                                    <p
                                        key={`opening-hours-${stall.id}-${openingHour.day}`}
                                    >
                                        {openingHour.day}{' '}
                                        {openingHour.openingTime} —{' '}
                                        {openingHour.closingTime}
                                    </p>
                                ))}
                            </td>
                            {toSaveInCollection ? (
                                <td>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            aria-label="add-into-collection-checkbox"
                                        />
                                    </label>
                                </td>
                            ) : null}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div></div>
        </div>
    );
};

export default Table;
