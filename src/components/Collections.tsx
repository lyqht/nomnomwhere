import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Collection } from '../../types/Entities';

type alertType = 'alert-success' | 'alert-error';

interface Props {
    collections: Collection[] | null;
    selectedCollection: Collection | null;
    setSelectedCollection: (x: Collection | null) => void;
    fetchAndSetCollections: () => void;
}

const Collections: React.FC<Props> = ({
    selectedCollection,
    setSelectedCollection,
    collections,
    fetchAndSetCollections,
}) => {
    const [userIsAddingCollection, setUserIsAddingCollection] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState<string>('');
    const [alert, setAlert] = useState<alertType | ''>('');

    const addCollection = async () => {
        if (newCollectionName) {
            try {
                setLoading(true);
                const body: Partial<Collection> = {
                    name: newCollectionName,
                    savedRestaurants: [],
                };
                await axios.post('/api/collections', body);
                setAlert('alert-success');
                fetchAndSetCollections();
            } catch (err) {
                console.error(err);
                setAlert('alert-error');
            }

            setTimeout(() => {
                setAlert('');
            }, 5000);

            setLoading(false);
            setUserIsAddingCollection(false);
        }
    };

    useEffect(() => {
        fetchAndSetCollections();
    }, []);
    return (
        <div id="collections-card" className="rounded-3xl p-8 shadow-md">
            {alert && (
                <div
                    id="alert"
                    className={`alert ${alert} ease-in-out shadow-lg absolute top-0 right-0 m-4 w-1/3`}
                >
                    {alert === 'alert-error' ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current flex-shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current flex-shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                    <span>
                        {alert === 'alert-error'
                            ? 'Error adding collection'
                            : 'Added collection successfully!'}
                    </span>
                </div>
            )}
            <div id="collections-content" className="flex flex-col gap-4">
                <div
                    id="title-and-add-collection"
                    className="flex flex-row justify-between items-center"
                >
                    <h2 className="text-lg">Browse Collections</h2>
                    {!userIsAddingCollection && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setUserIsAddingCollection(true)}
                            disabled={userIsAddingCollection}
                        >
                            Add your own
                        </button>
                    )}
                </div>
                {userIsAddingCollection ? (
                    <div className="flex flex-row justify-between items-center py-4">
                        <input
                            type="text"
                            required={true}
                            placeholder="Name of new collection"
                            onChange={(e) => {
                                setNewCollectionName(e.target.value);
                            }}
                            className="input input-bordered w-full max-w-xs"
                        />
                        <div className="flex flex-row gap-4">
                            <button
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={async () => {
                                    await addCollection();
                                }}
                            >
                                {loading ? 'Loading' : 'Submit'}
                            </button>
                            <button
                                className="btn btn-tertiary"
                                onClick={() => {
                                    setUserIsAddingCollection(false);
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : null}
                {collections ? (
                    <ul id="collections-section" className="menu bg-base-100">
                        {collections?.map((collection) => (
                            <li key={`collection-row-${collection.id}`}>
                                <a
                                    className={`${
                                        selectedCollection &&
                                        selectedCollection.id === collection.id
                                            ? 'active'
                                            : ''
                                    } p-4`}
                                    onClick={() => {
                                        selectedCollection &&
                                        selectedCollection.id === collection.id
                                            ? setSelectedCollection(null)
                                            : setSelectedCollection(collection);
                                    }}
                                >
                                    <p>{collection.name}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </div>
    );
};

export default Collections;
