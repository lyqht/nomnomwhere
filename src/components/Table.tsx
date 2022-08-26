import React, { useState } from 'react';
import { Restaurant } from '../../api/types/Restaurant';
import { Collection } from '../../api/types/Collection';
import axios from 'axios';

interface Props {
    data: Restaurant[];
    collections: Collection[];
    showSaveToCollectionColumn: boolean;
    fetchAndSetCollections: () => void;
}

function isDateBeforeToday(date: Date) {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

const Table: React.FC<Props> = ({
    data,
    collections,
    showSaveToCollectionColumn,
    fetchAndSetCollections,
}) => {
    const [pageNumberIndex, setPageNumberIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [itemsBeingSaved, setItemsBeingSaved] = useState<string[]>([]);

    const saveRestaurantIntoCollection = async (restaurantId: string, collectionId: string) => {
        try {
            setItemsBeingSaved([...itemsBeingSaved, restaurantId]);
            const { data } = await axios.patch('/api/collections', {
                restaurantId,
                collectionId,
            });
            setMessage(`Saved into ${data.data.name}`);
            fetchAndSetCollections();
        } catch (err) {
            console.error(JSON.stringify(err));
        }

        const updatedItemsBeingSaved = [...itemsBeingSaved];
        updatedItemsBeingSaved.splice(itemsBeingSaved.findIndex((id) => id === restaurantId));
        setItemsBeingSaved(updatedItemsBeingSaved);
    };

    return (
        <div className="overflow-x-auto h-full flex rounded-3xl shadow-md overflow-y-auto">
            <table className="table table-compact w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Opening Hours</th>
                        {showSaveToCollectionColumn ? <th>Save in collection</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {data.map((stall, index) => (
                        <tr key={`row-${stall.id}`}>
                            <th>{index + 1}</th>
                            <td className="w-24">
                                <div className="flex items-center">
                                    <div>
                                        <div className="font-bold w-1/3">
                                            {stall.name}
                                            <br />
                                            {!isDateBeforeToday(new Date(stall.created_at)) ? (
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
                                    <p key={`opening-hours-${stall.id}-${openingHour.day}`}>
                                        {openingHour.day} {openingHour.openingTime} —{' '}
                                        {openingHour.closingTime}
                                    </p>
                                ))}
                            </td>
                            {showSaveToCollectionColumn ? (
                                <td>
                                    <div className="dropdown dropdown-end">
                                        <label
                                            tabIndex={0}
                                            className={`btn m-1 ${
                                                itemsBeingSaved.includes(stall.id)
                                                    ? 'loading disabled'
                                                    : ''
                                            }`}
                                        >
                                            Save
                                        </label>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box"
                                        >
                                            {collections &&
                                                collections.map((collection) => (
                                                    <li
                                                        key={`dropdown-select-option-${collection.id}`}
                                                        onClick={async () => {
                                                            await saveRestaurantIntoCollection(
                                                                stall.id,
                                                                collection.id,
                                                            );
                                                        }}
                                                    >
                                                        <a>{collection.name}</a>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
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
