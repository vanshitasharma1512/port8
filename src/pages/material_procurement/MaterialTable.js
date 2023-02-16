// @flow
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// components
const MaterialTable = ({ myData, handleMaterial }) => {
    console.log('myData', myData);

    return (
        <>
            <Row>
                <Col xs={12} style={{ marginTop: '15px' }}>
                    <div class="table-responsive text-nowrap">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Select</th>

                                    <th scope="col">Material</th>
                                    <th scope="col">Qty Required</th>
                                    <th scope="col">Qty Awarded</th>

                                    <th scope="col">Rate</th>
                                    <th scope="col">GST Rate(%)</th>

                                    <th scope="col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myData?.map((obj, index) => (
                                    <tr>
                                        {/* <td>{obj?.material_name}</td>
                                        <td>{obj?.quantity_required}</td>
                                        <td>{obj?.bid_amount}</td>
                                        <td>{obj?.remark}</td> */}
                                        <td scope="row">
                                            {' '}
                                            <input type="checkbox" checked />{' '}
                                        </td>
                                        <td scope="row">{obj?.name}</td>
                                        <td scope="row">
                                            {obj?.quantity} {obj?.unit}
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                style={{ width: '90px' }}
                                                min="1"
                                                name="quantity_required"
                                                value={obj?.quantity_required}
                                                onChange={(e) => handleMaterial(e, index)}
                                            />{' '}
                                            {obj?.unit}
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                style={{ width: '90px' }}
                                                min="1"
                                                name="rate"
                                                value={obj?.rate}
                                                onChange={(e) => handleMaterial(e, index)}
                                            />
                                        </td>
                                        <td scope="row">
                                            <input disabled style={{ width: '90px' }} value={obj?.gst_rate} />
                                        </td>
                                        <td scope="row">
                                            <input
                                                disabled
                                                style={{ width: '90px' }}
                                                value={obj?.rate * obj?.quantity_required}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default MaterialTable;
