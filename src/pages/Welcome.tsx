import React, { useEffect, useState } from 'react';
import { Restaurant } from '../../api/types/Restaurant';
import FileUpload from '../components/FileUpload/FileUpload';

function Welcome(): JSX.Element {
    const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

    useEffect(() => {
        fetch('/api')
            .then((response) => response.json())
            .then(({ data }) => setRestaurants(data));
    }, []);

    return (
        <div>
            <div>
                <h1>Nomnom where?</h1>
                {restaurants ? (
                    restaurants.map((stall) => (
                        <div>
                            <p>{stall.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No restaurants found :(</p>
                )}
            </div>

            <FileUpload />
        </div>
    );
}

export default Welcome;
