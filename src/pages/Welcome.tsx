import React, { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import classes from './Welcome.module.css';

function Welcome(): JSX.Element {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello')
            .then((response) => response.json())
            .then((data) => setMessage(data.message));
    }, []);

    return (
        <div>
            <p className={classes.message}>{message}</p>;
            <FileUpload />
        </div>
    );
}

export default Welcome;
