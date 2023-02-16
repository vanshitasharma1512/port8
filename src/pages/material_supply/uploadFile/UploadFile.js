import React from 'react';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { uploadFile } from '../../../shared/API';

function UploadFile({ mode = 'add', onlyView = false, UploadFor, filePath, file, ...props }) {
    const [uploading, setuploading] = useState(false);

    const handleFileSelect = (e) => {
        setuploading(true);
        let data = new FormData();
        data.append('file', e.target.files[0]);
        data.append('UploadFor', UploadFor);

        uploadFile(data)
            .then((res) => {
                console.log(res.data.data);
                filePath(res.data.data.file_path);
                setuploading(false);
            })
            .catch((err) => {
                setuploading(false);
                console.log(err);
                toast.error(err.data.message);
            });
    };

    return (
        <>
            {mode == 'add' ? (
                <span {...props}>
                    {!uploading ? (
                        <label>
                            <span className="btn btn-primary btn-sm">{file != '' ? 'Change' : 'Browse'}</span>
                            <input
                                type="file"
                                style={{ position: 'absolute', visibility: 'hidden' }}
                                onChange={handleFileSelect}
                            />
                        </label>
                    ) : (
                        <button disabled className="btn btn-primary btn-sm btn-upload-spinner">
                            <Spinner size="sm" animation="border" /> Uploading...
                        </button>
                    )}
                </span>
            ) : (
                <span {...props} style={{ ...props.style, display: 'flex' }}>
                    {!onlyView && (
                        <span>
                            {!uploading ? (
                                <label>
                                    <span className="btn btn-primary btn-sm">{file != '' ? 'Change' : 'Browse'}</span>
                                    <input
                                        type="file"
                                        style={{ position: 'absolute', visibility: 'hidden' }}
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            ) : (
                                <button disabled className="btn btn-primary btn-sm btn-upload-spinner">
                                    <Spinner size="sm" animation="border" /> Uploading...
                                </button>
                            )}
                        </span>
                    )}
                    <a style={{ marginLeft: '10px' }} className="btn btn-success btn-sm" target="_blank" href={file}>
                        <i className="mdi mdi-eye"></i>
                    </a>
                </span>
            )}
        </>
    );
}

export default UploadFile;
