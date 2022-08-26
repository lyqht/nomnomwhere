import React, { Fragment, useState } from 'react';
import axios from 'axios';

interface Props {
    userIsUploading: boolean;
    setUserIsUploading: (x: boolean) => void;
}

const FileUpload: React.FC<Props> = ({ userIsUploading, setUserIsUploading }) => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState<number>(0);

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        setUserIsUploading(true);

        try {
            const res = await axios.post('/api/restaurants/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const currentProgress: number = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setUploadPercentage(currentProgress);
                },
            });

            setTimeout(() => setUploadPercentage(0), 10000);
            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });
            setMessage(`File Uploaded, ${res.data.data.length} records added`);
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
            setUploadPercentage(0);
        }
    };

    return (
        <Fragment>
            <p className="py-4">
                You can also upload your own restaurants too! Refer{' '}
                <a
                    target={'_blank'}
                    className={'link link-primary'}
                    href="https://github.com/lyqht/nomnomwhere/blob/main/api/sampleFile.csv"
                >
                    here
                </a>{' '}
                for an example CSV file.
            </p>
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={onChange}
                        placeholder={''}
                    />
                </div>

                <div id="progress-bar">
                    {userIsUploading && (
                        <>
                            <p>{uploadPercentage} % done</p>
                            <progress
                                className="progress w-56"
                                value={uploadPercentage}
                                max="100"
                            ></progress>
                        </>
                    )}
                </div>

                {message ? <div>{message}!</div> : null}
                <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
            </form>
        </Fragment>
    );
};

export default FileUpload;
