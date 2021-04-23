import React, { useState } from "react"
import { Button, Modal } from "rsuite"

const FileUpload = ({ onSuccess }: { onSuccess: () => void }): JSX.Element => {
    const [show, setShow] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isSelected, setIsSelected] = useState(false);

    // eslint-disable-next-line
    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    const handleSubmission = () => {
        const formData = new FormData();
        if (selectedFile) formData.append('files', selectedFile);

        fetch(
            '/api/files/action/upload',
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                onSuccess()
                setShow(false)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Body className="text-center">
                    <input multiple type="file" name="file" onChange={changeHandler} />
                    {isSelected ? (
                        <div>
                            <p>Filename: {selectedFile?.name}</p>
                            <p>Filetype: {selectedFile?.type}</p>
                            <p>Size in bytes: {selectedFile?.size}</p>
                            <p>
                                lastModifiedDate:{' '}
                                {/* selectedFile?.lastModifiedDate.toLocaleDateString() */}
                            </p>
                        </div>
                    ) : (
                            <p>Select a file to show details</p>
                        )}
                    <div>
                        <Button onClick={handleSubmission}>Submit</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <div className="mt-10">
                <Button onClick={() => setShow(true)}>Upload File</Button>
            </div>
        </>
    )
}

export default FileUpload
