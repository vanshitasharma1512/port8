// @flow
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Pagination, Nav, Form } from 'react-bootstrap';
import { useNavigate, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { getProcurementsActivities } from '../../../shared/API';

// components
import { TAB_ITEMS } from '../../../constants/material';
import classNames from 'classnames';

const AnalyticsDashboardPage = () => {
    const navigate = useNavigate();
    const [Index, setIndex] = useState(0);
    const [data, setData] = useState({});
    const [procurementData, setProcurementData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [statusInput, setStatusInput] = useState('');
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };
    function handleChange(event) {
        setSearchInput(event.target.value);
    }
    function handleStatus(event) {
        setStatusInput(event.target.value);
    }
    function handleFormModal(id) {
        // console.log("id",id)
        navigate(`work-acquisition/${id}`);
        // setStatusInput(event.target.value)
    }
    const handleNavigate = (x, index) => {
        setIndex(index);
    };

    useEffect(() => {
        getProcurementsActivities()
            .then((res) => {
                setProcurementData(res);
                setCount(res.data.data.length);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [searchInput, statusInput]);

    return (
        <>
            <Row>
                <Col>
                    <div className="page-title-box">
                        <h4 className="page-title">Material Supply</h4>
                    </div>
                </Col>
            </Row>
            <Card>
                {' '}
                <Card.Body>
                    <Row>
                        <Col xl={12} lg={12}>
                            <ul className="nav nav-tabs">
                                {TAB_ITEMS.map((x, index) => (
                                    <li key={index} className="nav-item" onClick={() => handleNavigate(x, index)}>
                                        <a
                                            style={{ cursor: 'pointer' }}
                                            className={Index === index ? 'active-tab nav-link ' : 'nav-link'}
                                            aria-current="page">
                                            {x.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginBottom: '50px', justifyContent: 'right', display: 'flex' }}>
                        <Col xl={2} sm={12}>
                            <input
                                required
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput2"
                                placeholder="Search"
                                onChange={handleChange}
                            />
                        </Col>
                        <Col xl={2} sm={12}>
                            <Form.Group>
                                <Form.Select
                                    className="custom-select"
                                    aria-label="Default select example"
                                    onClick={handleStatus}>
                                    <option value="" key>
                                        Select Status
                                    </option>
                                    <option value="open_for_bidding">Open for Bidding</option>
                                    <option value="bid_submitted">Bid Submitted</option>
                                    <option value="po_received">PO Received</option>
                                    <option value="po_accepted">PO Accepted</option>
                                    <option value="po_rejected">PO Rejected</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        {Index === 0 && (
                            <>
                                <Col xl={12} lg={12}>
                                    <div className="table-responsive text-nowrap">
                                        <Table hover responsive paginations=({sizePerPage:"5"})>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Id</th>
                                                    <th scope="col">Buyer</th>
                                                    <th scope="col">Title</th>
                                                    <th scope="col">Site/Location</th>
                                                    <th scope="col">Materials</th>
                                                    <th scope="col">Created on</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Status Updated on</th>
                                                    <th scope="col">View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {procurementData?.data?.data?.map((x) => (
                                                    <tr key={x.id}>
                                                        <th scope="row">{x.id}</th>
                                                        <td scope="row">{x.buyer_name}</td>
                                                        <td scope="row">{x.title}</td>
                                                        <td scope="row">{x.Site}</td>
                                                        <td scope="row">{x.material}</td>
                                                        <td scope="row">{handleDateFormat(x.created_on)}</td>
                                                        <td scope="row">{x.po_status}</td>
                                                        <td scope="row">{handleDateFormat(x.status_updated_on)}</td>
                                                        <td
                                                            scope="row"
                                                            style={{
                                                                // color: 'blue',
                                                                // textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => handleFormModal(x.id)}>
                                                            <i className="mdi mdi-eye"></i>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                            </>
                        )}
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default AnalyticsDashboardPage;
