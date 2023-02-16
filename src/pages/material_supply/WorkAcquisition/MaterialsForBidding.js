import React from 'react';
import { Card, Col, Table } from 'react-bootstrap';

function MaterialsForBidding({ data, handleSubmit, biditems, updateItem, isSubmitting, handleStatus, Spinner }) {
    return (
        <>
            <Card style={{ marginTop: '25px' }}>
                <Card.Body>
                    {data?.data?.po_status == 'Invited For Quote' || data?.data?.po_status == 'Open For Bidding' ? (
                        <>
                            <h4 className="page-title">Materials for Bidding</h4>
                            <Col xl={12} lg={12}>
                                <form onSubmit={handleSubmit}>
                                    <div className="table-responsive text-nowrap">
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">Material</th>
                                                    <th scope="col">Qty</th>
                                                    <th scope="col">Bid</th>
                                                    <th scope="col">Remark</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {biditems?.map((x, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <input
                                                                type="checkbox"
                                                                id={`material_${x.id}`}
                                                                onChange={(e) =>
                                                                    updateItem(x.id, 'is_checked', e.target.checked)
                                                                }
                                                            />
                                                        </th>
                                                        <th scope="row">
                                                            <label htmlFor={`material_${x.id}`}>
                                                                {x.material_name}
                                                            </label>
                                                        </th>
                                                        <td scope="row">{x.quantity_required}</td>
                                                        <th scope="row">
                                                            <Col xl={4} sm={12}>
                                                                <div className="mb-0 input-group">
                                                                    <input
                                                                        type="number"
                                                                        id="uom"
                                                                        min={0}
                                                                        step={0.01}
                                                                        required={x.is_checked}
                                                                        className="form-control"
                                                                        value={x.bid_amount}
                                                                        onChange={(e) =>
                                                                            updateItem(
                                                                                x.id,
                                                                                'bid_amount',
                                                                                parseFloat(e.target.value)
                                                                            )
                                                                        }
                                                                    />
                                                                    <div
                                                                        className="input-group-text input-group-password"
                                                                        data-password="false">
                                                                        / {x.UOM}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </th>
                                                        <th scope="row">
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                onChange={(e) =>
                                                                    updateItem(x.id, 'remark', e.target.value)
                                                                }
                                                            />
                                                        </th>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                        <button
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                            style={{ float: 'right' }}>
                                            {isSubmitting ? <Spinner animation="border" size="sm" /> : null} Submit
                                        </button>
                                    </div>
                                </form>
                            </Col>
                        </>
                    ) : data?.data?.po_status == 'PO Awarded' || data?.data?.po_status == 'PO Received' ? (
                        <>
                            <h4 className="page-title">Materials</h4>
                            <Col xl={12} lg={12}>
                                <div className="table-responsive text-nowrap">
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th scope="col">Material</th>
                                                <th scope="col">Qty Required</th>
                                                <th scope="col">Rate</th>
                                                <th scope="col">GST Rate(%)</th>
                                                <th scope="col">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.data?.bid_materials?.map((x, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{x.material_name}</th>
                                                    <th scope="row">
                                                        {x.quantity_awarded} {x.UOM}
                                                    </th>
                                                    <th scope="row">{x.rate ? x.rate : x.bid_amount}</th>
                                                    <th scope="row">{x.gst_rate} </th>
                                                    <th scope="row">
                                                        {x.quantity_awarded * (x.rate ? x.rate : x.bid_amount)}
                                                    </th>
                                                </tr>
                                            ))}
                                            {data?.data?.materials?.map((x, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{x.material_name}</th>
                                                    <th scope="row">
                                                        {x.quantity_awarded} {x.UOM}
                                                    </th>
                                                    <th scope="row">{x.rate ? x.rate : x.bid_amount}</th>
                                                    <th scope="row">{x.gst} </th>
                                                    <th scope="row">
                                                        {x.quantity_awarded * (x.rate ? x.rate : x.bid_amount)}
                                                    </th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    <div style={{ float: 'right', display: 'flex', gap: '10px' }}>
                                        <input
                                            className="btn btn-primary"
                                            type="button"
                                            value="Accept"
                                            disabled={isSubmitting}
                                            onClick={(e) => handleStatus(e)}
                                        />
                                        <input
                                            className="btn btn-danger"
                                            type="button"
                                            value="Reject"
                                            disabled={isSubmitting}
                                            onClick={(e) => handleStatus(e)}
                                        />
                                    </div>
                                    {/* </form> */}
                                </div>
                            </Col>
                        </>
                    ) : (
                        <>
                            <h4 className="page-title">Materials</h4>
                            <Col xl={12} lg={12}>
                                <div className="table-responsive text-nowrap">
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th scope="col">Material </th>
                                                <th scope="col">Qty</th>
                                                <th scope="col">Bid</th>
                                                <th scope="col">Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.data?.bid_materials?.map((x, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{x.material_name}</th>
                                                    <td scope="row">
                                                        {x.quantity_required} {x.UOM}
                                                    </td>
                                                    <td scope="row">{x.bid_amount}</td>
                                                    <td scope="row">{x.remark}</td>
                                                </tr>
                                            ))}
                                            {data?.data?.materials?.map((x, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{x.material_name}</th>
                                                    <td scope="row">
                                                        {x.quantity_awarded} {x.unit}
                                                    </td>
                                                    <td scope="row">
                                                        {x.rate} / {x.unit}
                                                    </td>
                                                    <td scope="row">{x.remark}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </>
                    )}
                </Card.Body>
            </Card>
        </>
    );
}

export default MaterialsForBidding;
