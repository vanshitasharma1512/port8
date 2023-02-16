import moment from 'moment';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

function PoDetails({ data, queryPoNo }) {
    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };
    return (
        <div className="detailsWrap p-3">
            <Row>
                <Col xl={6} lg={6}>
                    <div className="page-title-box mb-3">
                        <h4 className="page-title">Order Details</h4>
                    </div>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>PO Number :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{data.po_number}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>PO Date :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{handleDateFormat(data.po_date)}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Order Type :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{`Order from ${data.order_type}`}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Site Location :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{data.Site != null ? data.Site : '-'}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>PO Validity:</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{handleDateFormat(data.po_validity_date)}</p>
                        </Col>
                    </Row>
                </Col>
                <Col xl={6} lg={6}>
                    <div className="page-title-box mb-3">
                        <h4 className="page-title">Buyer Details</h4>
                    </div>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Buyer Name :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{data.buyer_name}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Buyer Address :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>
                                {data.buyer_address}
                                {data.buyer_city}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Contact Person :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{data.buyer_contact_person}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Phone Number :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{data.buyer_mobile}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} lg={6}>
                            <p>
                                <b>Email :</b>
                            </p>
                        </Col>
                        <Col xl={6} lg={6}>
                            <p>{data.buyer_email}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default PoDetails;
