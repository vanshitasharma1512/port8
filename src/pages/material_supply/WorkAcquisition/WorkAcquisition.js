// @flow
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Row, Col, Card, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import moment from 'moment';

import { Formik } from 'formik';
// components
import { TAB_ITEMS_PO } from '../../../../constants/data';
import {
    getWorkAcquisitionBidSubmission,
    addWorkAcquisitionBidSubmission,
    updateProcurementsActivitiesPo,
    getWorkAcquisitionPODetails,
} from '../../../../shared/API';
import Spinner from 'react-bootstrap/Spinner';
import MaterialsForBidding from './MaterialsForBidding';

const WorkAcquisition = (props) => {
    // const { state,po_id } = useLocation();
    const queryParams = new URLSearchParams(window.location.search);
    const queryStatus = queryParams.get('status');
    const queryPoId = queryParams.get('po-id');
    const redirect = queryParams.get('redirect');

    let { id } = useParams();

    const navigate = useNavigate();
    const [Index, setIndex] = useState(2);
    const [modal, setModal] = useState(false);
    const [data, setData] = useState({});
    const [biditems, setbiditems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };

    const navigatePA = () => {
        if (redirect == '' || redirect == null || redirect == undefined) {
            navigate('/dashboard/material-supply?active-tab=work-acquisition');
        } else {
            navigate('/dashboard/material-supply?active-tab=under-execution');
        }
    };

    useEffect(() => {
        getWorkAcquisitionData();
    }, []);
    const getWorkAcquisitionData = () => {
        
        setIsLoading(true);
        if (queryStatus == 'PO Awarded' || queryStatus == 'PO Received' || queryStatus == 'PO Accepted') {
            getWorkAcquisitionPODetails(queryPoId)
                .then((res) => {
                    queryParams.set('status', res.data.data.po_status);
                    // window.location.href = window.location.pathname + queryParams.toString();
                    var newurl =
                        window.location.protocol +
                        '//' +
                        window.location.host +
                        window.location.pathname +
                        '?' +
                        queryParams.toString();
                    window.history.pushState({ path: newurl }, '', newurl);
                    setData(res.data);

                    setbiditems(res.data.data.bid_materials ? res.data.data.bid_materials : res.data.data.materials);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                });
        } else {
            getWorkAcquisitionBidSubmission(id)
                .then((res) => {
                    setData(res.data);
                    setErrorMsg('');
                    setbiditems(res.data.data.bid_materials);
                    setIsLoading(false);
                })
                .catch((err) => {
                    toast.error(err.data.message);
                    setErrorMsg(err.data.message);
                    console.log(err);
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        if (queryStatus == undefined) {
            navigate('/dashboard/material-supply');
        }
    }, []);

    const updateItem = (id, whichvalue, newvalue) => {
        let index = biditems.findIndex((x) => x.id === id);

        if (index !== -1) {
            let temporaryarray = biditems.slice();
            //if (newvalue < 0) newvalue = 0;
            temporaryarray[index][whichvalue] = newvalue;
            setbiditems(temporaryarray);
        } else {
            console.log('no match');
        }
    };
    const structuredClone = (val) => JSON.parse(JSON.stringify(val));
    const handleSubmit = (e) => {
        e.preventDefault();
        setisSubmitting(true);
        let items = biditems.filter((item) => item.is_checked);
        let data = { bid_vendor_list: items };
        let clonedData = structuredClone(data);
        clonedData.bid_vendor_list.map((item) => {
            item.id = item.bid_material_id;
            delete item.gst_rate;
            delete item.UOM;
            delete item.bid_material_id;
            delete item.is_checked;
            delete item.material_name;
            delete item.quantity_awarded;
        });
        console.log('BID', clonedData);

        addWorkAcquisitionBidSubmission(id, clonedData)
            .then((res) => {
                console.log('res', res);
                setisSubmitting(false);
                toast(res.data.message);
                getWorkAcquisitionData();
            })
            .catch((err) => {
                console.log(err);
                setisSubmitting(false);
                toast.error(err.data.message);
            });
    };

    const handleStatus = (e) => {
        setisSubmitting(true);
        let status = e.target.value == 'Accept' ? 'POAccepted' : 'PORejected';
        updateProcurementsActivitiesPo(queryPoId, status)
            .then((res) => {
                console.log(res);
                setisSubmitting(false);
                toast.success(res.data.message);
              //  window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                setisSubmitting(false);
                toast.error(err.data.message);
               // window.location.reload();
            });
    };

    const removeHTMLTags = (data) => {
        const regex = /(<([^>]+)>)/gi;
        return data.replace(regex, '');
    };
    return (
        <>
            <ToastContainer />

            {isLoading == true ? (
                <>
                    <Card style={{ marginTop: '20px' }}>
                        <Card.Body>
                            <Spinner
                                animation="border"
                                style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}
                            />
                        </Card.Body>
                    </Card>
                </>
            ) : (
                <>
                    <Card style={{ marginTop: '20px' }}>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <form className="d-flex">
                                                <button className="btn btn-primary ms-2" onClick={navigatePA}>
                                                    <i className="dripicons-arrow-thin-left"></i> back to list
                                                </button>
                                            </form>
                                        </div>
                                        <h4 className="page-title">Work Acquisition Activity : {id}</h4>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {errorMsg == '' ? (
                        <Card style={{ marginTop: '20px' }}>
                            <Card.Body>
                                <Row>
                                    <Col
                                        xs={12}
                                        md={12}
                                        style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            Activity Type :<b> {data?.data?.po_status}</b>
                                        </div>
                                        <div>
                                            Created on :<b> {handleDateFormat(data?.data?.created_on)}</b>
                                        </div>
                                    </Col>
                                    <Col
                                        xs={12}
                                        md={12}
                                        style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            Current Status :<b> {data?.data?.po_status}</b>
                                        </div>
                                        <div>
                                            Status updated on :<b> {handleDateFormat(data?.data?.status_updated_on)}</b>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <h4 className="page-title" style={{ marginTop: '25px' }}>
                                        Specifications
                                    </h4>
                                    <Col style={{ marginTop: '15px' }}>
                                        <Row>
                                            <Col className="col-md-2">Title</Col>
                                            <Col className="col-md-10">
                                                <b> {data?.data?.title}</b>{' '}
                                            </Col>
                                        </Row>
                                        <Row className="mt-2">
                                            <Col className="col-md-2">Site/Location</Col>
                                            <Col className="col-md-10">
                                                <b> {data?.data?.Site}</b>{' '}
                                            </Col>
                                        </Row>

                                        <Row className="mt-2">
                                            <Col className="col-md-2">Complete Address</Col>
                                            <Col className="col-md-10">
                                                <b> {data?.data?.complete_address}</b>{' '}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <h4 className="page-title" style={{ marginTop: '25px' }}>
                                        {data?.data?.po_status == 'PO Accepted' || data?.data?.po_status == 'PO Awarded'
                                            ? 'PO Details'
                                            : 'Order Details'}
                                    </h4>
                                    {data?.data?.po_status == 'PO Accepted' || data?.data?.po_status == 'PO Awarded' ? (
                                        <>
                                            <Col style={{ marginTop: '15px' }}>
                                                <Row>
                                                    <Col className="col-md-2">PO Date </Col>
                                                    <Col className="col-md-10">
                                                        <b> {handleDateFormat(data?.data?.po_date)}</b>{' '}
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">PO Number</Col>
                                                    <Col className="col-md-10">
                                                        <b> {data?.data?.po_number}</b>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">PO Value (Amount)</Col>
                                                    <Col className="col-md-10">
                                                        <b> Rs. {data?.data?.po_value}</b>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">GST Amount</Col>
                                                    <Col className="col-md-10">
                                                        <b> Rs. {data?.data?.po_value}</b>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">Description</Col>
                                                    <Col className="col-md-10">
                                                        <b> {removeHTMLTags(data?.data?.description)}</b>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">Attachment</Col>
                                                    <Col className="col-md-10">
                                                        {data?.data?.attachement_url && (
                                                            <a
                                                                className="btn btn-primary btn-xs"
                                                                target="_blank"
                                                                href={data?.data?.attachement_url}>
                                                                <i className="mdi mdi-eye"></i>&nbsp; View
                                                            </a>
                                                        )}
                                                        &nbsp; &nbsp;
                                                        {data?.data?.attachement_url && (
                                                            <a
                                                                className="btn btn-success btn-xs"
                                                                target="_blank"
                                                                download
                                                                href={data?.data?.attachement_url}>
                                                                <i className="mdi mdi-download"></i>&nbsp; Download
                                                            </a>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </>
                                    ) : (
                                        <>
                                            <Col style={{ marginTop: '15px' }}>
                                                <Row>
                                                    <Col className="col-md-2">Payment terms in Days </Col>
                                                    <Col className="col-md-10">
                                                        <b> {data?.data?.payment_terms_in_days} Days</b>{' '}
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">Quote Submission Last Date </Col>
                                                    <Col className="col-md-10">
                                                        <b>
                                                            {' '}
                                                            {handleDateFormat(data?.data?.quote_submission_last_date)}
                                                        </b>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col className="col-md-2">Validity Date</Col>
                                                    <Col className="col-md-10">
                                                        <b> {handleDateFormat(data?.data?.validity_date)}</b>
                                                    </Col>
                                                </Row>
                                                {data?.data?.description != '' && data?.data?.description != null ? (
                                                    <Row className="mt-2">
                                                        <Col className="col-md-2">Description</Col>
                                                        <Col className="col-md-10">
                                                            <b> {removeHTMLTags(data?.data?.description)}</b>
                                                        </Col>
                                                    </Row>
                                                ) : null}
                                                {data?.data?.attachement_url != '' &&
                                                data?.data?.attachement_url != null ? (
                                                    <Row className="mt-2">
                                                        <Col className="col-md-2">Attachment</Col>
                                                        <Col className="col-md-10">
                                                            <a
                                                                className="btn btn-primary btn-xs"
                                                                href={data?.data?.attachement_url}>
                                                                <i className="mdi mdi-eye"></i>&nbsp; View
                                                            </a>
                                                            &nbsp; &nbsp;
                                                            <a
                                                                className="btn btn-success btn-xs"
                                                                download
                                                                href={data?.data?.attachement_url}>
                                                                <i className="mdi mdi-download"></i>&nbsp; Download
                                                            </a>
                                                        </Col>
                                                    </Row>
                                                ) : null}
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card>
                            <Card.Body>
                                <p style={{ marginBottom: 0, textAlign: 'center' }}>{errorMsg}</p>
                            </Card.Body>
                        </Card>
                    )}
                    {/* MATERIALS FOR BIDDING */}
                    {errorMsg == '' ? (
                        <MaterialsForBidding
                            data={data}
                            handleSubmit={handleSubmit}
                            biditems={biditems}
                            updateItem={updateItem}
                            isSubmitting={isSubmitting}
                            handleStatus={handleStatus}
                            Spinner={Spinner}
                        />
                    ) : null}
                </>
            )}
        </>
    );
};

export default WorkAcquisition;
