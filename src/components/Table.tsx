import React, { useState } from 'react';
import { Restaurant } from '../../api/types/Restaurant';

interface Props {
    data: Restaurant[];
}

function isDateBeforeToday(date: Date) {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

const Table: React.FC<Props> = ({ data }) => {
    const [pageNumberIndex, setPageNumberIndex] = useState(0);

    return (
        <div className="overflow-x-auto w-1/2 h-full flex">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Opening Hours</th>
                        <th>Save in collection</th>
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
                            <td>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        aria-label="add-into-collection-checkbox"
                                    />
                                </label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div></div>
        </div>
    );
};

export default Table;
