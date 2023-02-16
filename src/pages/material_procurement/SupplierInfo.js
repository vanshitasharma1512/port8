// @flow
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import BidsTable from './BidsTable';
// import PurchaseOrder from './PurchaseOrder';
import { Rating } from 'react-simple-star-rating';

// components

const SupplierInfo = ({ modal, handleClose, data }) => {
    const [rating, setRating] = useState(data?.rating);
    console.log('rating', rating);
    console.log('111', data);
    return (
        <>
            <Row>
                <Col>
                    <Col xl={12}>
                        <Modal show={modal} size="lg" onHide={handleClose}>
                            <Modal.Header
                                closeButton
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                }}>
                                <Modal.Title>{data?.supplier}</Modal.Title>
                                <Rating
                                    style={{ marginLeft: '20px' }}
                                    initialValue={rating}
                                    readonly={true}
                                    size={30}
                                />
                            </Modal.Header>
                            <Modal.Body>
                                <h3 style={{ color: 'black' }}>Supplier Information</h3>
                                <Row>
                                    <Col lg={6} sm={12}>
                                        <div style={{ marginTop: '20px' }}>
                                            {' '}
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>Name:</span>{' '}
                                            {data?.supplier}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>Contact Person:</span>{' '}
                                            {data?.contact_person}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            {' '}
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>Phone:</span>{' '}
                                            {data?.mobile}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>Email:</span>{' '}
                                            {data?.email}
                                        </div>
                                    </Col>
                                    <Col lg={6} sm={12}>
                                        <div style={{ marginTop: '20px' }}>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>Address</span>{' '}
                                            {data?.site_location}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>GSTIN:</span>{' '}
                                            {data?.gst_in_no}
                                        </div>
                                    </Col>
                                </Row>

                                <div class="table-responsive text-nowrap" style={{ marginTop: '20px' }}>
                                    <h4> Material List</h4>
                                    <table class="table table-striped ">
                                        <thead>
                                            <tr>
                                                <th scope="col">Material</th>
                                                <th scope="col">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.material_list?.map((obj) => (
                                                <tr>
                                                    <td scope="row">{obj?.material_name}</td>
                                                    <td scope="row">{obj?.rate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div class="table-responsive text-nowrap" style={{ marginTop: '20px' }}>
                                    <h4> Service Location</h4>
                                    <table class="table table-striped ">
                                        <thead>
                                            <tr>
                                                <th scope="col">State</th>
                                                <th scope="col">City</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.client_site_list?.map((obj) => (
                                                <tr>
                                                    <td scope="row">{obj?.state_name}</td>
                                                    <td scope="row">{obj?.city_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Col>
            </Row>
        </>
    );
};

export default SupplierInfo;
