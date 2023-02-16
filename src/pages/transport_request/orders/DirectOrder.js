import Form from 'react-bootstrap/Form';

// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import classNames from 'classnames';
import PageTitle from '../../../components/PageTitle';
import Table from '../../../components/Table';
import { fleetsData } from '../Data';

/* action column render */
const ActionColumn = ({ row }) => {
    return (
         <>
            <Link to={"/transport-request/orders/"+row.original.pono} className="action-icon">
             <i className="mdi mdi-eye"></i>
            </Link>
        </>
    );
};

// get all columns
const columns = [
    {
        Header: 'Transporter',
        accessor: 'supplier_name',
        sort: true,
        // Cell: ProductColumn,
    },
    {
        Header: 'Contact',
        accessor: 'contact_person',
        sort: true,
    },
    {
        Header: 'Phone',
        accessor: 'phone',
        sort: true,
    },
    {
        Header: 'Email',
        accessor: 'email',
        sort: true,
    },
    {
        Header: 'Pickup Location',
        accessor: 'pickup',
        sort: true,

    },
    {
        Header: 'Drop Location',
        accessor: 'drop',
        sort: true,

    },

    {
        Header: 'Action',
        // accessor: 'action',
        sort: false,
        Cell: ActionColumn,
    },
];

// get pagelist to display
const sizePerPageList = [
    {
        text: '5',
        value: 5,
    },
    {
        text: '10',
        value: 10,
    },
    {
        text: '20',
        value: 20,
    },
    {
        text: 'All',
        value: fleetsData.length,
    },
];

// main component
const TranspReqDirectOrder = (): React$Element<React$FragmentType> => {
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                ]}
                title={'Direct Order'}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col sm={5}>
                                    <div className="searchBoxClass">
                                        <span className="d-flex align-items-center">
                                            {' '}
                                            <input
                                                value=''
                                                placeholder='Material...'
                                                className="form-control w-auto ms-1"
                                            />
                                            <input
                                                value=''
                                                placeholder='From Location...'
                                                className="form-control w-auto ms-1"
                                            />
                                            <input
                                                value=''
                                                placeholder='To Location...'
                                                className="form-control w-auto ms-1"
                                            />
                                        </span>
                                    </div>

                                </Col>
                                <Col sm={5}>
                                </Col>

                                <Col sm={2}>
                                    <div className="text-sm-end">
                                        <Link to="/transport-request/add-po" className="btn btn-danger">
                                            <i className="mdi mdi-plus-circle me-2"></i> Add PO
                                        </Link>

                                    </div>
                                </Col>
                            </Row>

                            <Table
                                columns={columns}
                                data={fleetsData}
                                pageSize={2}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSelectable={false}
                                isSearchable={false}
                                theadClass="table-light"
                                searchBoxClass="mb-5"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>



        </>
    );
};

export default TranspReqDirectOrder;