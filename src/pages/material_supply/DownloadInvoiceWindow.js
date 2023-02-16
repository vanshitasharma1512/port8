import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Badge, Col, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getInvoiceDetailsForDownload } from '../../shared/API';

import './custom.scss';

function DownloadInvoiceWindow() {
    const queryParams = new URLSearchParams(window.location.search);
    const queryInvoiceID = queryParams.get('id');
    const queryPoId = queryParams.get('po-id');
    const [invoiceData, setinvoiceData] = useState();
    const [loading, setloading] = useState(false);
    const [errMSG, seterrMSG] = useState('');

    useEffect(() => {
        setloading(true);
        getInvoiceDetailsForDownload(queryPoId, queryInvoiceID)
            .then((res) => {
                console.log(res);
                res.data.data.invoice_items[0].c_gst = 8;
                res.data.data.invoice_items[0].s_gst = 8;
                res.data.data.invoice_items[1].c_gst = 8;
                res.data.data.invoice_items[1].s_gst = 8;
                setinvoiceData(res.data.data);
                setloading(false);
            })
            .catch((err) => {
                seterrMSG(err?.data?.message);
                setloading(false);
            });
    }, []);

    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };

    return (
        <>
            {loading && (
                <div style={{ padding: '200px 0' }}>
                    <Spinner animation="border" style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }} />
                </div>
            )}
            {!loading && invoiceData && (
                <div className="InvoiceWrap">
                    <Row>
                        <Col xl={6} lg={6} sm={6}>
                            <div className="InvoiceBox">
                                <h5>{invoiceData.billing_by}</h5>
                                <p>{invoiceData.billing_by_address}</p>
                                {/* <p className="gstIN">
                                    <b>GSTIN:</b>&nbsp;545874548DKLIE5474
                                </p> */}
                            </div>
                            <div className="InvoiceBox">
                                <p>Bill To,</p>
                                <p>
                                    <b>{invoiceData.billing_to}</b>
                                </p>
                                <p>{invoiceData.billing_to_address}</p>
                            </div>
                            {/* <div className="InvoiceBox" style={{ marginBottom: '20px' }}>
                                <p className="gstIN">
                                    <b>Place of Supply:</b>&nbsp;Madhya Pradesh
                                </p>
                            </div> */}
                        </Col>
                        <Col xl={6} lg={6} sm={6}>
                            <div className="InvoiceBox text-right">
                                <h3>Original Tax Invoice</h3>
                                <p>#{invoiceData.invoice_no}</p>
                                <p>
                                    <b>Balance Due</b>
                                </p>
                                <p className="balanceDue">Rs. {invoiceData.due_amount}</p>
                                <p className="gstIN">
                                    <b>Invoice Date:</b>&nbsp;{handleDateFormat(invoiceData.invoice_date)}
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12} lg={12}>
                            <table className="table table-striped table-bordered ">
                                <thead>
                                    <tr key={-1}>
                                        <th scope="col">HSN/SAC</th>
                                        <th scope="col">Material</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Rate</th>
                                        <th scope="col">CGST</th>
                                        <th scope="col">SGST</th>
                                        <th scope="col">IGST</th>
                                        <th scope="col">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceData.invoice_items.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.hsn_code}</td>
                                                <td>{item.material_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    {item.rate} / {item.uom}
                                                </td>

                                                <td>{item.c_gst}%</td>
                                                <td>{item.s_gst}%</td>
                                                <td>{item.i_gst}%</td>
                                                <td>{item.amount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={9} lg={6} sm={8}>
                            <div className="InvoiceBox">
                                <h5>Associated Trips</h5>
                                {invoiceData.invoice_trips.map((item, index) => {
                                    return (
                                        <p>
                                            Trip {item.trip_id}{' '}
                                            <Badge bg="primary">{handleDateFormat(item.trip_schedule_date)}</Badge>{' '}
                                        </p>
                                    );
                                })}
                            </div>

                            <div className="InvoiceBox">
                                <h5>Other Details</h5>
                                <p>{invoiceData.other_detail}</p>
                            </div>
                            <div className="InvoiceBox">
                                <h5>Terms & Conditions</h5>
                                <p>
                                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
                                    piece of classical Latin literature from 45 BC, making it over 2000 years old.
                                    Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked
                                    up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
                                    going through the cites of the word in classical literature,
                                </p>
                            </div>
                        </Col>
                        <Col xl={3} lg={6} sm={4}>
                            <Row style={{ marginBottom: '5px' }}>
                                <Col xl={6} lg={6} sm={6} style={{ textAlign: 'right' }}>
                                    Sub Total
                                </Col>
                                <Col xl={6} lg={6} sm={6}>
                                    <input
                                        type="number"
                                        value={invoiceData.total_amount}
                                        disabled
                                        className="form-control"
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '5px' }}>
                                <Col xl={6} lg={6} sm={6} style={{ textAlign: 'right' }}>
                                    GST
                                </Col>
                                <Col xl={6} lg={6} sm={6}>
                                    <input
                                        type="number"
                                        value={
                                            invoiceData.gst
                                                ? invoiceData.gst
                                                : invoiceData.due_amount - invoiceData.total_amount
                                        }
                                        disabled
                                        className="form-control"
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '5px' }}>
                                <Col xl={6} lg={6} sm={6} style={{ textAlign: 'right' }}>
                                    Payable Amount
                                </Col>
                                <Col xl={6} lg={6} sm={6}>
                                    <input
                                        type="number"
                                        value={invoiceData.payable_amount}
                                        disabled
                                        className="form-control"
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            )}

            {!loading && errMSG != '' && (
                <div className="errMsg" style={{ padding: '200px 0' }}>
                    {errMSG}
                </div>
            )}
        </>
    );
}

export default DownloadInvoiceWindow;
