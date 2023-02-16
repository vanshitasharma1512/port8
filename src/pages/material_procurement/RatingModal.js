import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';
import Alert from 'react-bootstrap/Alert';
export default function RatingModal({ setRatingModal, ratingModal, handleCloseRM, poId, vendorId }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [modalAlert, setModalAlert] = useState(false);
    const [res, setRes] = useState();
    const scm_user=sessionStorage.getItem('scm_user')
    console.log('res', res);
    console.log('review', review);
    const handleRating = (rate) => {
        setRating(rate);
    };

    const data = {
        vendor_id: vendorId,
        rating: rating,
        review: review,
    };

    console.log('data', data);
    const manageRating = async (e) => {
        e.preventDefault();
        if (data.rating === 0 || review === '') {
            setModalAlert(true);
            setTimeout(() => {
                setModalAlert(false);
            }, 3000);
        } else {
            e.preventDefault();
            try {
                const { data: response } = await axios.post(
                    `https://scm.acolabz.com/backend/api/vendorrating/${poId}`,
                    data,

                    {
                        headers: {
                            Authorization: `Bearer ${scm_user.token}`,
                        },
                    }
                );
                if (response?.success) {
                    setRatingModal(false);
                }
                setRes(response);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Modal show={ratingModal} onHide={handleCloseRM} size="lg">
            {modalAlert && (
                <div
                    style={{
                        alignItems: 'center',
                        display: 'grid',
                        width: '100%',
                        backgroundColor: '#F8D7DA',
                        paddingTop: '20px',
                        paddingLeft: '20px',
                    }}>
                    <p>Please fill all the fields</p>
                </div>
            )}
            <Modal.Header closeButton>
                <Modal.Title>Review & Ratings</Modal.Title>
            </Modal.Header>
            <form>
                <Modal.Body>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h4>Rating</h4>

                        <Rating
                            style={{ marginLeft: '20px' }}
                            initialValue={0}
                            readonly={false}
                            size={20}
                            onClick={handleRating}
                        />
                    </div>
                    <div style={{ display: 'flex', marginTop: '40px' }}>
                        <h4>Review</h4>

                        <textarea
                            onChange={(e) => setReview(e.target.value)}
                            required
                            style={{ marginLeft: '20px' }}
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRM}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={(e) => manageRating(e)}>
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
