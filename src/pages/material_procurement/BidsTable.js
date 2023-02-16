// @flow
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// components
const BidsTable = ({ bidData }) => {
    return (
        <>
            <Row>
                <Col xs={12} style={{ marginTop: '15px' }}>
                    <div class="table-responsive text-nowrap">
                        <table class="table table-striped ">
                            <thead>
                                <tr>
                                    <th scope="col">Material</th>
                                    <th scope="col">Qty Required</th>
                                    <th scope="col">Bid Amount</th>
                                    <th scope="col">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bidData?.map((obj) => (
                                    <tr>
                                        <td>{obj?.material_name}</td>
                                        <td>{obj?.quantity_required}</td>
                                        <td>{obj?.bid_amount}</td>
                                        <td>{obj.remark}</td>
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

export default BidsTable;
