/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import { Row, Col, Card, Table, Pagination, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import moment from 'moment';

// components

import { getInvoices, getOrderDetails, getPayments, getTripDetails, getTripsDelivery } from '../../../shared/API';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from './ProgressBar';
import PoDetails from './PoDetails';
import TipsDelivery from './TripsDelivery/TipsDelivery';
import TripsDelivery from './TripsDelivery/TipsDelivery';
import TripModal from './TripsDelivery/TripModal';
import TripModalEdit from './TripsDelivery/TripModalEdit';
import { useDispatch } from 'react-redux';
import { changeTrip, setMasterOrderDetails } from '../../../redux/materialSupply/actions';
import Invoices from './Invoices/Invoices';
import TrackModal from './TripsDelivery/TrackModal';
import Payments from './Payments/Payments';

const TABS = [{ name: 'Summary' }, { name: 'Trips & Delivery' }, { name: 'Invoices' }, { name: 'Payments' }];

const UnderExecution = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isinnerLoading, setisinnerLoading] = useState(false);
    const [searchInput, setsearchInput] = useState('');
    const [statusInput, setstatusInput] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [data, setData] = useState();
    const [tripsdeliverydata, settripsdeliverydata] = useState();
    const [allInvoicesdata, setallInvoicesdata] = useState();
    const [allPaymentdata, setallPaymentdata] = useState([]);
    const queryParams = new URLSearchParams(window.location.search);
    const queryPoNo = queryParams.get('po-number');
    const queryPoId = queryParams.get('po-id');
    const [showUpdateModal, setshowUpdateModal] = useState(false);
    const [statusmsg, setstatusMsg] = useState('');
    const [showmsgOnce, setshowmsgOnce] = useState(false);
    const [currentTripEditing, setcurrentTripEditing] = useState(0);
    const [indiTripView, setIndiTripView] = useState(false);
    const [showTrackModal, setshowTrackModal] = useState(false);

    const handleClose = () => {
        dispatch(changeTrip({}));
        setshowUpdateModal(false);
        getTripsAndDeliveryData();
        getAllInvoicesData();
    };
    const handleShow = () => setshowUpdateModal(true);

    const navigatePA = () => {
        navigate('/dashboard/material-supply?active-tab=under-execution');
    };
    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };
    const handleDateFormatWithTime = (date) => {
        return moment(date).format('DD MMM YYYY HH:mm  A');
    };
    const formatMoney = (amount) => {
        const l = 100000;
        if (amount < l) {
            return amount;
        } else if (amount >= l) {
            return `${(amount / l).toFixed(1)} Lac`;
        }
    };

    const handleTrackModal = () => {
        setshowUpdateModal(false);
        setshowTrackModal(true);
    };

    useEffect(() => {
        if (queryPoNo == '') {
            navigatePA();
        }
    }, [currentTab]);
    useEffect(() => {
        if (currentTab == 0) {
            setisinnerLoading(true);
            getMasterOrderDetails();
            // getOrderDetails(queryPoId)
            //     .then((res) => {
            //         console.log(res.data);
            //         if (res.data.success) {
            //             setData(res.data.data);
            //         }
            //         setisinnerLoading(false);
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //         setisinnerLoading(false);
            //     });
        }
        if (currentTab == 1) {
            getTripsAndDeliveryData();
        }
        if (currentTab == 2) {
            getAllInvoicesData();
        }
        if (currentTab == 3) {
            getPaymentData();
        }
    }, [currentTab, searchInput, statusInput]);

    const getMasterOrderDetails = () => {
        getOrderDetails(queryPoId)
            .then((res) => {
                console.log('MASTER ORDER DETAILS', res.data);
                if (res.data.success) {
                    setData(res.data.data);
                    dispatch(setMasterOrderDetails(res.data.data));
                }
                setisinnerLoading(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message);
                setisinnerLoading(false);
            });
    };

    const getAllInvoicesData = () => {
        setisinnerLoading(true);
        getInvoices(queryPoId, searchInput, statusInput)
            .then((res) => {
                console.log('invoices:', res.data);
                if (res.data.success) {
                    setallInvoicesdata(res.data.data);
                }
                setisinnerLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setisinnerLoading(false);
            });
    };

    const getPaymentData = () => {
        setisinnerLoading(true);
        getPayments(queryPoId, searchInput)
            .then((res) => {
                console.log('invoices:', res.data);
                if (res.data.success) {
                    setallPaymentdata(res.data.data);
                }
                setisinnerLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setisinnerLoading(false);
            });
    };

    const getTripsAndDeliveryData = () => {
        setisinnerLoading(true);
        getTripsDelivery(queryPoId, searchInput, statusInput)
            .then((res) => {
                console.log('trips data', res.data);
                if (res.data.success) {
                    settripsdeliverydata(res.data.data);
                }
                setisinnerLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setisinnerLoading(false);
            });
    };

    const showViewTripModal = (trip_id) => {
        //setIndiTripView(true);
        setcurrentTripEditing(trip_id);
        let po_id = data.po_id;
        let items = tripsdeliverydata.map((item) => {
            if (item.trip_id == trip_id) {
                item.indiTripView = true;
            }
            return item;
        });
        settripsdeliverydata(items);

        getTripDetails(po_id, trip_id)
            .then((res) => {
                setshowUpdateModal(true);
                dispatch(changeTrip(res.data.data));
                // setIndiTripView(false);
                let items = tripsdeliverydata.map((item) => {
                    if (item.trip_id == trip_id) {
                        item.indiTripView = false;
                    }
                    return item;
                });
                settripsdeliverydata(items);
                getMasterOrderDetails();
            })
            .catch((err) => {
                console.log(err);
                // setIndiTripView(false);
                toast.error(err?.data?.message);
                let items = tripsdeliverydata.map((item) => {
                    if (item.trip_id == trip_id) {
                        item.indiTripView = false;
                    }
                    return item;
                });
                settripsdeliverydata(items);
            });
    };

    const showViewTrackModal = (trip_id) => {
        //setIndiTripView(true);

        let po_id = data.po_id;
        let items = tripsdeliverydata.map((item) => {
            if (item.trip_id == trip_id) {
                item.indiTrackView = true;
            }
            return item;
        });
        settripsdeliverydata(items);

        getTripDetails(po_id, trip_id)
            .then((res) => {
                dispatch(changeTrip(res.data.data));
                // setIndiTrackView(false);
                let items = tripsdeliverydata.map((item) => {
                    if (item.trip_id == trip_id) {
                        item.indiTrackView = false;
                    }
                    return item;
                });
                settripsdeliverydata(items);
                setshowTrackModal(true);
                getMasterOrderDetails();
            })
            .catch((err) => {
                console.log(err);
                // setIndiTrackView(false);
                toast.error(err?.data?.message);
                let items = tripsdeliverydata.map((item) => {
                    if (item.trip_id == trip_id) {
                        item.indiTrackView = false;
                    }
                    return item;
                });
                settripsdeliverydata(items);
            });
    };

    const popupCenter = ({ url, title, w, h }) => {
        const screen = {};
        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : screen.width;
        const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft;
        const top = (height - h) / 2 / systemZoom + dualScreenTop;
        const newWindow = window.open(
            url,
            title,
            `
          scrollbars=no,
          resizable=0 ,
          width=${w / systemZoom}, 
          height=${h / systemZoom}, 
          top=${top}, 
          left=${left}
          `
        );

        if (window.focus) newWindow.focus();
        newWindow.addEventListener('resize', () => {
            newWindow.resizeTo(w / systemZoom, h / systemZoom);
        });
    };

    return (
        <>
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
                    <ToastContainer />
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
                                        <h4 className="page-title">Purchase Order Details : {queryPoNo}</h4>
                                    </div>
                                </Col>
                            </Row>
                            {data && <ProgressBar data={data} />}
                        </Card.Body>
                    </Card>
                    <Card style={{ marginTop: '20px' }}>
                        <Card.Body>
                            <Row>
                                <Col xl={12} lg={12}>
                                    <ul className="nav nav-tabs tab-headers">
                                        {TABS.map((item, index) => {
                                            return (
                                                <li key={index} className="nav-item">
                                                    <a
                                                        onClick={() => setCurrentTab(index)}
                                                        className={`${
                                                            currentTab == index ? `active-tab` : ``
                                                        } nav-link`}
                                                        aria-current="page">
                                                        {item.name}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Col>
                            </Row>

                            {currentTab == 3 && data && (
                                <Payments
                                    setsearchInput={setsearchInput}
                                    setstatusInput={setstatusInput}
                                    statusInput={statusInput}
                                    searchInput={searchInput}
                                    orderDetails={data}
                                    data={tripsdeliverydata}
                                    Index={currentTab}
                                    callDataApi={getPaymentData}
                                />
                            )}

                            {currentTab == 2 && data && (
                                <Invoices
                                    setsearchInput={setsearchInput}
                                    setstatusInput={setstatusInput}
                                    statusInput={statusInput}
                                    searchInput={searchInput}
                                    orderDetails={data}
                                    data={tripsdeliverydata}
                                    Index={currentTab}
                                    callDataApi={getAllInvoicesData}
                                />
                            )}

                            {currentTab == 1 && data && (
                                <TripsDelivery
                                    setsearchInput={setsearchInput}
                                    setstatusInput={setstatusInput}
                                    statusInput={statusInput}
                                    searchInput={searchInput}
                                    orderDetails={data}
                                    data={tripsdeliverydata}
                                    Index={currentTab}
                                    callDataApi={getTripsAndDeliveryData}
                                />
                            )}

                            {!isinnerLoading ? (
                                <div>{currentTab == 0 && data && <PoDetails data={data.po_detail} />}</div>
                            ) : (
                                <Row className="p-3">
                                    <Spinner
                                        animation="border"
                                        style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}
                                    />
                                </Row>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Delivery info and Invoice & Payment Summary */}
                    {currentTab == 0 ? (
                        <>
                            <Card style={{ marginTop: '20px' }}>
                                <Card.Body>
                                    <Row>
                                        <div className="page-title-box mb-3">
                                            <h4 className="page-title">Delivery Information</h4>
                                        </div>
                                    </Row>
                                    <Row>
                                        {data && data?.po_detail?.delivery_information?.length > 0 ? (
                                            <div className="table-responsive text-nowrap">
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr key={`001`}>
                                                                <th scope="col">Material </th>
                                                                <th scope="col">Qty Awarded</th>
                                                                <th scope="col">Qty Delivered</th>
                                                                <th scope="col">Qty In-Transit</th>
                                                                <th scope="col">Qty Pending</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.po_detail.delivery_information.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <th scope="row">{item.material_name}</th>
                                                                        <td scope="row">
                                                                            {item.quantity_awarded} {item.unit}
                                                                        </td>
                                                                        <td scope="row">
                                                                            {item.quantity_delivered} {item.unit}
                                                                        </td>
                                                                        <td scope="row">
                                                                            {item.quantity_intransit} {item.unit}
                                                                        </td>
                                                                        <td scope="row">
                                                                            {item.quantity_pending} {item.unit}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No informations found!</p>
                                        )}
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card style={{ marginTop: '20px' }}>
                                <Card.Body>
                                    <Row>
                                        <div className="page-title-box mb-3">
                                            <h4 className="page-title">Invoice & Payment Summary</h4>
                                        </div>
                                    </Row>
                                    <Row>
                                        {data && data?.po_detail?.invoice_payment_summary ? (
                                            <div className="table-responsive text-nowrap">
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">PO Value </th>
                                                                <th scope="col">Invoice Generated</th>
                                                                <th scope="col">Invoice Amount</th>
                                                                <th scope="col">Amount Received</th>
                                                                <th scope="col">Amount Due</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">Rs. {data.po_detail.po_value}</th>
                                                                <td scope="row">
                                                                    {
                                                                        data.po_detail.invoice_payment_summary
                                                                            .invoice_generated
                                                                    }{' '}
                                                                    {data.po_detail.invoice_payment_summary
                                                                        .invoice_generated > 1
                                                                        ? `Invoces`
                                                                        : `Invoice`}
                                                                </td>
                                                                <td scope="row">
                                                                    Rs.{' '}
                                                                    {
                                                                        data.po_detail.invoice_payment_summary
                                                                            .invoice_amount
                                                                    }
                                                                </td>
                                                                <td scope="row">
                                                                    Rs.{' '}
                                                                    {
                                                                        data.po_detail.invoice_payment_summary
                                                                            .amount_received
                                                                    }
                                                                </td>
                                                                <td scope="row">
                                                                    Rs.{' '}
                                                                    {data.po_detail.invoice_payment_summary.amount_due}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No informations found!</p>
                                        )}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </>
                    ) : null}
                    {/* Delivery info and Invoice & Payment Summary end */}

                    {/* Trip */}
                    {currentTab == 1 ? (
                        <Card style={{ marginTop: '20px' }}>
                            <Card.Body>
                                <Row>
                                    {tripsdeliverydata && tripsdeliverydata.length > 0 ? (
                                        <div className="table-responsive text-nowrap">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered table-hover">
                                                    <thead>
                                                        <tr key={`001`}>
                                                            <th scope="col">Trip No. </th>
                                                            <th scope="col">Trip Date</th>
                                                            <th scope="col">Truck Detail</th>
                                                            <th scope="col">Driver Detail</th>
                                                            <th scope="col">Material</th>
                                                            <th scope="col">Qty</th>
                                                            <th scope="col">Status</th>
                                                            <th scope="col">Track</th>
                                                            <th scope="col">Download</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tripsdeliverydata.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-link btn-sm btn-has-abs-loader"
                                                                            onClick={(e) => {
                                                                                showViewTripModal(item.trip_id);
                                                                            }}>
                                                                            {item.indiTripView && (
                                                                                <Spinner
                                                                                    animation="border"
                                                                                    size="sm"
                                                                                    style={{ marginRight: '10px' }}
                                                                                />
                                                                            )}
                                                                            {item.trip_number}
                                                                        </button>
                                                                    </td>
                                                                    <td>{handleDateFormat(item.trip_date)}</td>
                                                                    <td>
                                                                        {item.truck_number}
                                                                        <br />
                                                                        <small>{item.truck_type} Truck</small>
                                                                    </td>
                                                                    <td>
                                                                        {item.driver_name}
                                                                        <br />
                                                                        <small>{item.driver_mobile}</small>
                                                                    </td>
                                                                    <td>{item.material_name}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{item.status}</td>
                                                                    <td>
                                                                        {item.status != 'Scheduled' ? (
                                                                            <button
                                                                                className="btn btn-link btn-sm btn-has-abs-loader"
                                                                                onClick={(e) => {
                                                                                    showViewTrackModal(item.trip_id);
                                                                                }}>
                                                                                {item.indiTrackView && (
                                                                                    <Spinner
                                                                                        animation="border"
                                                                                        size="sm"
                                                                                        style={{ marginRight: '10px' }}
                                                                                    />
                                                                                )}
                                                                                Track
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                disabled
                                                                                className="btn btn-link btn-sm">
                                                                                Track
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {item.e_way_bill != null ? (
                                                                            <a
                                                                                target="_blank"
                                                                                href={item.e_way_bill}
                                                                                className="btn btn-link btn-sm">
                                                                                E-Way Bill
                                                                            </a>
                                                                        ) : (
                                                                            <button
                                                                                disabled
                                                                                className="btn btn-sm btn-link">
                                                                                No E-Way Bill
                                                                            </button>
                                                                        )}
                                                                        {item.challan != null ? (
                                                                            <a
                                                                                target="_blank"
                                                                                href={item.challan}
                                                                                className="btn btn-link btn-sm">
                                                                                Challan
                                                                            </a>
                                                                        ) : (
                                                                            <button
                                                                                disabled
                                                                                className="btn btn-sm btn-link">
                                                                                No Challan
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <TripModalEdit
                                                    openTrackModal={handleTrackModal}
                                                    show={showUpdateModal}
                                                    handleClose={handleClose}
                                                    handleShow={handleShow}
                                                    statusMsg={setstatusMsg}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="m-0">No informations found!</p>
                                    )}
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : null}
                    {/* Trip End */}

                    {/* Invoice */}
                    {currentTab == 2 ? (
                        <Card style={{ marginTop: '20px' }}>
                            <Card.Body>
                                <Row>
                                    {allInvoicesdata && allInvoicesdata.length > 0 ? (
                                        <div className="table-responsive text-nowrap">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered table-hover">
                                                    <thead>
                                                        <tr key={`001`}>
                                                            <th scope="col">Invoice No. </th>
                                                            <th scope="col">Invoice Date</th>
                                                            <th scope="col">Invoice Amount</th>
                                                            <th scope="col">Download</th>
                                                            <th scope="col">Status</th>
                                                            <th scope="col">History</th>
                                                            <th scope="col">Amount Paid</th>
                                                            <th scope="col">Balance</th>
                                                            <th scope="col">Status Updated On</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allInvoicesdata.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-link btn-sm btn-has-abs-loader"
                                                                            onClick={(e) => {
                                                                                // showViewTripModal(item.trip_id);
                                                                                popupCenter({
                                                                                    url: `/material-supply/download-invoice?id=${item.id}&po-id=${queryPoId}`,
                                                                                    title: 'Invoice Details',
                                                                                    w: 900,
                                                                                    h: 750,
                                                                                });
                                                                            }}>
                                                                            {item.indiTripView && (
                                                                                <Spinner
                                                                                    animation="border"
                                                                                    size="sm"
                                                                                    style={{ marginRight: '10px' }}
                                                                                />
                                                                            )}
                                                                            {item.id_value}
                                                                        </button>
                                                                    </td>
                                                                    <td>{handleDateFormat(item.invoice_date)}</td>
                                                                    <td>{formatMoney(item.invoice_amount)}</td>
                                                                    <td>
                                                                        {item.attachment != '' ? (
                                                                            <a
                                                                                target="_blank"
                                                                                download
                                                                                href={item.attachment}
                                                                                className="btn btn-link btn-sm">
                                                                                Download
                                                                            </a>
                                                                        ) : (
                                                                            <button
                                                                                target="_blank"
                                                                                download
                                                                                href={item.attachment}
                                                                                disabled
                                                                                title="No Attachement Found"
                                                                                className="btn btn-link btn-sm">
                                                                                Download
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <Badge bg="danger">{item.invoice_status}</Badge>
                                                                    </td>
                                                                    <td>
                                                                        <button className="btn btn-link btn-sm">
                                                                            Payment History
                                                                        </button>
                                                                    </td>
                                                                    <td>{formatMoney(item.paid_amount)}</td>
                                                                    <td>{formatMoney(item.due_amount)}</td>
                                                                    <td>
                                                                        {handleDateFormatWithTime(
                                                                            item.status_updated_on
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <TripModalEdit
                                                    orderDetails={data}
                                                    show={showUpdateModal}
                                                    handleClose={handleClose}
                                                    handleShow={handleShow}
                                                    statusMsg={setstatusMsg}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="m-0">No informations found!</p>
                                    )}
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : null}
                    {/* Invoice end*/}

                    {/* Payment */}
                    {currentTab == 3 ? (
                        <Card style={{ marginTop: '20px' }}>
                            <Card.Body>
                                <Row>
                                    {allPaymentdata && allPaymentdata.length > 0 ? (
                                        <div className="table-responsive text-nowrap">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered table-hover">
                                                    <thead>
                                                        <tr key={`001`}>
                                                            <th scope="col">Payment ID </th>
                                                            <th scope="col">Payment Date</th>
                                                            <th scope="col">Payment Amount</th>
                                                            <th scope="col">Mode</th>
                                                            <th scope="col">Transaction No.</th>
                                                            <th scope="col">Invoce</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allPaymentdata.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.id}</td>
                                                                    <td>{handleDateFormat(item.payment_date)}</td>
                                                                    <td>{item.amount}</td>
                                                                    <td>{item.payment_mode}</td>
                                                                    <td>{item.transaction_no}</td>
                                                                    <td>
                                                                        <button className="btn btn-link btn-sm">
                                                                            {item.Invoice}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="m-0">No informations found!</p>
                                    )}
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : null}
                    {/* Payment end */}

                    {/* Track Modal */}
                    {showTrackModal && (
                        <TrackModal show={showTrackModal} handleClose={() => setshowTrackModal(false)} />
                    )}
                    {/* Track Modal end*/}
                </>
            )}
        </>
    );
};

export default UnderExecution;
