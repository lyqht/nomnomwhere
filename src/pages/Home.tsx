import React, { useEffect, useState } from 'react';
import { Restaurant } from '../../api/types/Restaurant';
import FileUpload from '../components/FileUpload/FileUpload';

function Welcome(): JSX.Element {
    const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

    function isDateBeforeToday(date: Date) {
        return (
            new Date(date.toDateString()) < new Date(new Date().toDateString())
        );
    }

    useEffect(() => {
        fetch('/api')
            .then((response) => response.json())
            .then(({ data }) => setRestaurants(data));
    }, []);

    return (
        <div className="p-12 h-screen">
            <div className="flex flex-col h-full">
                <h1 className="text-5xl font-bold italic">Nomnom where?</h1>
                <div className="py-8 h-3/4">
                    {restaurants ? (
                        <>
                            <div className="overflow-x-auto w-full h-full flex">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    aria-label="test"
                                                />
                                            </th>
                                            <th>Name</th>
                                            <th>Opening Hours</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {restaurants.map((stall) => (
                                            <tr key={`row-${stall.id}`}>
                                                <th>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            aria-label="add-into-collection-checkbox"
                                                        />
                                                    </label>
                                                </th>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div>
                                                            <div className="font-bold">
                                                                {stall.name}
                                                                <br />
                                                                {!isDateBeforeToday(
                                                                    new Date(
                                                                        stall.created_at,
                                                                    ),
                                                                ) ? (
                                                                    <span className="badge badge-ghost badge-sm">
                                                                        Recently
                                                                        added
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {stall.opening_hours.map(
                                                        (openingHour) => (
                                                            <p>
                                                                {
                                                                    openingHour.day
                                                                }{' '}
                                                                {
                                                                    openingHour.openingTime
                                                                }{' '}
                                                                —{' '}
                                                                {
                                                                    openingHour.closingTime
                                                                }
                                                            </p>
                                                        ),
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default Welcome;
