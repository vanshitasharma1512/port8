import React, { useEffect } from 'react';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { tripsDeliverySortData } from '../../Constants';
import TripModal from './TripModal';

function TripsDelivery({ Index, setstatusInput, setsearchInput, searchInput, statusInput, orderDetails, callDataApi }) {
    const state = useSelector((state) => state.MaterialSupply.master_order_details);

    const [show, setShow] = useState(false);
    const [statusmsg, setstatusMsg] = useState('');
    const [showmsgOnce, setshowmsgOnce] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (statusmsg != '' && !showmsgOnce) {
            console.log('>>>>>>>>>>>>>');
            // toast.success(statusmsg);
            setshowmsgOnce(true);
        }
        callDataApi();
    }, [statusmsg]);

    return (
        <div className="tipsDeliveryWrap p-3">
            <ToastContainer />
            <Row>
                <Col xl={8} lg={4}>
                    <button
                        disabled={state.current_status == 'POCancelled'}
                        className="btn btn-secondary ms-2"
                        onClick={handleShow}>
                        <i className="dripicons-plus"></i>Schedule New Trip
                    </button>
                    <TripModal
                        orderDetails={orderDetails}
                        show={show}
                        handleClose={handleClose}
                        handleShow={handleShow}
                        statusMsg={setstatusMsg}
                    />
                </Col>
                <Col xl={4} lg={8}>
                    <Row>
                        <Col xl={6} sm={12}>
                            <input
                                required
                                type="search"
                                className="form-control"
                                id="formGroupExampleInput2"
                                placeholder="Search"
                                value={searchInput}
                                onChange={(e) => setsearchInput(e.target.value)}
                            />
                        </Col>
                        <Col xl={6} sm={12}>
                            <Form.Group>
                                <Form.Select
                                    className="custom-select"
                                    aria-label="Default select example"
                                    onClick={(e) => setstatusInput(e.target.value)}>
                                    <option key={`all`} value="">
                                        All
                                    </option>

                                    {Index == 1 ? (
                                        <>
                                            {tripsDeliverySortData.map((item, index) => (
                                                <option key={index} value={item.value}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default TripsDelivery;
