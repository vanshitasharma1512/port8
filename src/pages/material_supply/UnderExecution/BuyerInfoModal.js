import React from 'react';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { changeVendorDetails } from '../../../redux/materialSupply/actions';

function BuyerInfoModal({ show, showBuyerModal }) {
    const dispatch = useDispatch();
    const { vendor } = useSelector((state) => state.MaterialSupply);

    const handleClose = () => {
        dispatch(changeVendorDetails({}));
        showBuyerModal(false);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} className="tripModal">
                <Modal.Header closeButton>
                    {vendor && <Modal.Title>{vendor.organization_name}</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {vendor && (
                        <div className="p-2">
                            <Row>
                                <Col xl={6} lg={6}>
                                    <h5 className="mb-3">Buyer Information</h5>
                                    <Row className="mb-2">
                                        <Col xl={4} lg={6}>
                                            <b>Name</b>
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            {vendor.organization_name != null ? vendor.organization_name : '-'}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xl={4} lg={6}>
                                            <b>Contact Person</b>
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            {vendor.contact_person_name != null ? vendor.contact_person_name : '-'}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xl={4} lg={6}>
                                            <b>Phone</b>
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            {vendor.mobile != null ? vendor.mobile : '-'}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xl={4} lg={6}>
                                            <b>Email</b>
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            {vendor.email != null ? vendor.email : '-'}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={6} lg={6}>
                                    <h5 className="mb-3"></h5>
                                    <Row className="mb-2">
                                        <Col xl={4} lg={6}>
                                            <b>Address</b>
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            {vendor.address != null ? vendor.address : '-'}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xl={4} lg={6}>
                                            <b>GSTIN</b>
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            {vendor.gst_document_number != null ? vendor.gst_document_number : '-'}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default BuyerInfoModal;
