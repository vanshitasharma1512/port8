// @flow
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Pagination, Nav, Form, Badge } from 'react-bootstrap';
import { useNavigate, useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import { getCompletedData, getProcurementsActivities, getVendorDetails, getWorkExecution } from '../../shared/API';
import { ToastContainer, toast } from 'react-toastify';
// components
import { TAB_ITEMS } from '../../constants/material';

import Spinner from 'react-bootstrap/Spinner';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { workacquisitionSortData, underexecutionSortData } from './Constants.js';
import SearchAndDropdown from './SearchAndDropdown';
import TabHeader from './TabHeader';

import './custom.scss';
import BuyerInfoModal from './UnderExecution/BuyerInfoModal';
import { changeVendorDetails } from '../../redux/materialSupply/actions';
import { useDispatch } from 'react-redux';
import { useJsApiLoader } from '@react-google-maps/api';

const AnalyticsDashboardPage = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [Index, setIndex] = useState(0);
    const [data, setData] = useState({});
    const [procurementData, setProcurementData] = useState([]);
    const [workAcquisition, setWorkAcquisition] = useState([]);
    const [underexeclength, setUnderexeclength] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [statusInput, setStatusInput] = useState('');
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const activeTab = queryParams.get('active-tab');
    const [buyerModal, showBuyerModal] = useState(false);
    const [indiVendorView, setindiVendorView] = useState(false);
    const [completedData, setcompletedData] = useState([]);

    // useEffect(() => {
    //     if (activeTab != '') {
    //         if (activeTab == 'under-execution') {
    //             setIndex(1);
    //         }
    //     }
    // }, []);

    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };
    const handleActionFormatter = (id, po_status, po_id) => {
        return (
            <button
                className="btn btn-dark btn-sm"
                onClick={() => handleFormModal(id, po_status, po_id)}
                title="View Details">
                <i className="mdi mdi-eye"></i>&nbsp;View
            </button>
        );
    };
    const handleUnderExeFormatter = (id, row) => {
        return (
            <button className="btn btn-dark btn-sm" onClick={() => handleFormModalExe(id, row)} title="View Details">
                <i className="mdi mdi-eye"></i>&nbsp;View
            </button>
        );
    };

    function handleChange(event) {
        setSearchInput(event.target.value);
    }

    function handleStatus(event) {
        setStatusInput(event.target.value);
    }

    function handleFormModalExe(id, row) {
        navigate(`under-execution/${id}?po-id=${id}&po-number=${row.id_value}`);
    }

    function handleFormModal(id, po_status, po_id) {
        if (po_id == null) {
            toast.error('No PO ID found!');
            navigate(`work-acquisition/${id}?status=${po_status}`);
        } else {
            navigate(`work-acquisition/${id}?status=${po_status}&po-id=${po_id}`);
        }
    }

    const handleNavigate = (x, index) => {
        const queryParams = new URLSearchParams(window.location.search);
        setIndex(index);
        let p = document.querySelector('.page-item');
        p?.childNodes[0]?.click();
        if (index == 0) {
            queryParams.set('active-tab', 'work-acquisition');
        } else if (index == 1) {
            queryParams.set('active-tab', 'under-execution');
        } else {
            queryParams.set('active-tab', 'completed');
        }
        var newurl =
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?' +
            queryParams.toString();
        window.history.pushState({ path: newurl }, '', newurl);
    };

    useEffect(() => {
        
        if (Index == 0) {
            setIsLoading(true);
            getProcurementsActivities(searchInput, statusInput)
                .then((res) => {
                    setProcurementData(res.data.data);
                    setCount(res.data.data.length);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                });
        } else if (Index == 1) {
            
            setIsLoading(true);
            getWorkExecution(searchInput, statusInput)
                .then((res) => {
                    setWorkAcquisition(res.data.data);
                    setUnderexeclength(res.data.data.length);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                });
        } else if (Index == 2) {
            
            setIsLoading(true);
            getCompletedData()
                .then((res) => {
                    setcompletedData(res.data.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    toast.error(err?.data?.message);
                    setIsLoading(false);
                });
        }
        // setIsLoading(false)
    }, [searchInput, statusInput, Index]);

    const handlePoNumberFormat = (cell, row) => {
        return (
            <button
                onClick={() =>
                    navigate(
                        `/dashboard/material-supply/work-acquisition/${row.id}?status=${row.po_status}&po-id=${row.id}&redirect=under-execution`
                    )
                }
                className="btn btn-link"
                title="View Details">
                <span style={{ textDecoration: 'underline' }}>{cell}</span>
            </button>
        );
    };

    const handleShowBuyerModal = (data) => {
        //setcurrentTripEditing(trip_id);
        let vendor_id = data.vendor_id;
        setindiVendorView(true);
        getVendorDetails(vendor_id)
            .then((res) => {
                showBuyerModal(true);
                setindiVendorView(false);
                dispatch(changeVendorDetails(res.data.data));
            })
            .catch((err) => {
                toast.error(err?.data?.message);
                setindiVendorView(false);
            });
    };

    const handleBuyerFormat = (cell, row) => {
        console.log('from btn', row);
        return (
            <button
                onClick={() => handleShowBuyerModal(row)}
                className="btn btn-link btn-sm btn-has-abs-loader"
                title="View Details">
                <span>{cell}</span>
            </button>
        );
    };
    const handleStatusFormat = (cell, row) => {
        if (row.po_status == 'Bid Submitted') {
            return <Badge bg="success">{cell}</Badge>;
        }
        if (row.po_status == 'PO Awarded') {
            return <Badge bg="primary">{cell}</Badge>;
        }
        if (row.po_status == 'PO Rejected') {
            return <Badge bg="danger">{cell}</Badge>;
        }
        if (row.po_status == 'PO Accepted') {
            return <Badge bg="warning">{cell}</Badge>;
        }
        if (row.po_status == 'Invoice Generated') {
            return <Badge bg="primary">{cell}</Badge>;
        }
        return <Badge bg="secondary">{cell}</Badge>;
    };

    const handleBuyerFormatCompleted = (cell, row) => {
        row.vendor_id = row.buyer_id;
        return (
            <button
                onClick={() => handleShowBuyerModal(row)}
                className="btn btn-link btn-sm btn-has-abs-loader"
                title="View Details">
                <span>{cell}</span>
            </button>
        );
    };

    const handleCompletedDetailsFormat = (cell, row) => {
        return (
            <button className="btn btn-link btn-sm " title="Details">
                <span>Details</span>
            </button>
        );
    };

    const handleRatingFormat = (cell, row) => {
        let total = 5;

        let negative = total - cell;

        return (
            <ul className="ratingUL">
                {cell > 0 &&
                    Array.from(Array(cell), (e, i) => {
                        return <span class="mdi mdi-star"></span>;
                    })}

                {Array.from(Array(negative), (e, i) => {
                    return <span class="mdi mdi-star-outline"></span>;
                })}
            </ul>
        );
    };

    const columns = [
        {
            dataField: 'invitation_id',
            text: 'Id',
            sort: true,
        },
        {
            dataField: 'buyer_name',
            text: 'Buyer',
            // sort: true
        },
        {
            dataField: 'title',
            text: 'Title',
            // sort: true
        },
        {
            dataField: 'Site',
            text: 'Site/Location',
            // sort: true
        },
        {
            dataField: 'material',
            text: 'Materials',
            // sort: true
        },
        {
            dataField: 'created_on',
            text: 'Created on',
            // sort: true,
            formatter: (cell, row) => handleDateFormat(cell),
        },
        {
            dataField: 'po_status',
            text: 'Status',
            formatter: (cell, row) => handleStatusFormat(cell, row),
            sort: true,
        },
        {
            dataField: 'status_updated_on',
            text: 'Status Updated on',
            // sort: true,
            formatter: (cell, row) => handleDateFormat(cell),
        },
        {
            dataField: 'invitation_id',
            text: 'View',
            // sort: true
            formatter: (cell, row) => handleActionFormatter(cell, row.po_status, row.po_id),
        },
    ];
    const columns2 = [
        {
            dataField: 'id_value',
            text: 'PO Number',
            formatter: (cell, row) => handlePoNumberFormat(cell, row),
            sort: true,
        },
        {
            dataField: 'po_date',
            text: 'PO Date',
            formatter: (cell, row) => handleDateFormat(cell),
        },
        {
            dataField: 'po_value',
            text: 'PO Value',
            // sort: true
        },
        {
            dataField: 'client_name',
            text: 'Buyer',
            formatter: (cell, row) => handleBuyerFormat(cell, row),
            // sort: true
        },
        {
            dataField: 'materials',
            text: 'Materials',
            // sort: true
        },
        {
            dataField: 'po_status',
            text: 'Status',
            formatter: (cell, row) => handleStatusFormat(cell, row),

            // sort: true
        },

        {
            dataField: 'status_updated_on',
            text: 'Status Updated on',
            // sort: true,
            formatter: (cell, row) => handleDateFormat(cell),
        },
        {
            dataField: 'id',
            text: 'View',
            // sort: true
            formatter: (cell, row) => handleUnderExeFormatter(cell, row),
        },
    ];
    const columns3 = [
        {
            dataField: 'po_number',
            text: 'PO Number',
            formatter: (cell, row) => handlePoNumberFormat(cell, row),
            sort: true,
        },
        {
            dataField: 'po_date',
            text: 'PO Date',
            formatter: (cell, row) => handleDateFormat(cell),
        },
        {
            dataField: 'po_value',
            text: 'PO Value',
            // sort: true
        },
        {
            dataField: 'buyer_name',
            text: 'Buyer',
            formatter: (cell, row) => handleBuyerFormatCompleted(cell, row),
            // sort: true
        },
        {
            dataField: 'materials',
            text: 'Materials',
            // sort: true
        },
        {
            dataField: 'completed_on_date',
            text: 'Completed On',
            formatter: (cell, row) => handleDateFormat(cell, row),

            // sort: true
        },

        {
            dataField: 'id',
            text: 'Details',
            // sort: true,
            formatter: (cell, row) => handleCompletedDetailsFormat(cell),
        },
        {
            dataField: 'rating',
            text: 'Rating',
            // sort: true
            formatter: (cell, row) => handleRatingFormat(cell, row),
        },
    ];

    const options = {
        sizePerPage: 10,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        prePageText: 'Prev',
        nextPageText: 'Next',
        withFirstAndLast: true,
        alwaysShowAllBtns: true,
    };
    return (
        <>
            {/* <ToastContainer /> */}
            <Row>
                <Col>
                    <div className="page-title-box">
                        <h4 className="page-title">Material Supply</h4>
                    </div>
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <TabHeader handleNavigate={handleNavigate} Index={Index} />
                    <SearchAndDropdown
                        handleChange={handleChange}
                        handleStatus={handleStatus}
                        Index={Index}
                        workacquisitionSortData={workacquisitionSortData}
                        underexecutionSortData={underexecutionSortData}
                    />

                    {isLoading == true ? (
                        <>
                            <Spinner
                                animation="border"
                                style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}
                            />
                        </>
                    ) : (
                        <div style={{ left: 0 }}>
                            {Index == 0 ? (
                                <>
                                    {/* WORK ACQUISITION */}
                                    {isLoading == false && procurementData.length == 0 ? (
                                        <>
                                            <p className="text-center">No Record Found.</p>
                                        </>
                                    ) : (
                                        <>
                                            <BootstrapTable
                                                bootstrap4
                                                keyField="id"
                                                data={procurementData}
                                                columns={columns}
                                                pagination={paginationFactory(options)}
                                            />
                                        </>
                                    )}
                                </>
                            ) : Index == 1 ? (
                                <>
                                    {/* UNDER EXECUTION */}
                                    {underexeclength == 0 ? (
                                        <>
                                            <p className="text-center">No Record Found.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="tableWraper">
                                                {indiVendorView && (
                                                    <div className="loaderOverlay">
                                                        <Spinner
                                                            animation="border"
                                                            size="sm"
                                                            style={{ marginRight: '10px' }}
                                                        />
                                                    </div>
                                                )}
                                                <BootstrapTable
                                                    bootstrap4
                                                    keyField="id"
                                                    data={workAcquisition}
                                                    columns={columns2}
                                                    pagination={paginationFactory(options)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : Index == 2 ? (
                                <>
                                    {/* COMPLETED */}
                                    {completedData == 0 ? (
                                        <>
                                            <p className="text-center">No Record Found.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="tableWraper">
                                                {indiVendorView && (
                                                    <div className="loaderOverlay">
                                                        <Spinner
                                                            animation="border"
                                                            size="sm"
                                                            style={{ marginRight: '10px' }}
                                                        />
                                                    </div>
                                                )}
                                                <BootstrapTable
                                                    bootstrap4
                                                    keyField="id"
                                                    data={completedData}
                                                    columns={columns3}
                                                    pagination={paginationFactory(options)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : null}
                        </div>
                    )}
                </Card.Body>
            </Card>
            <BuyerInfoModal show={buyerModal} showBuyerModal={showBuyerModal} />
        </>
    );
};

export default AnalyticsDashboardPage;
