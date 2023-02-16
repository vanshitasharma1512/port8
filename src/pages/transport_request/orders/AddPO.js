// @flow
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PageTitle from '../../../components/PageTitle';

// // components
// import PageTitle from '../../components/PageTitle';

const TranspReqAddPOs = () => {
    return (

        <>

            <PageTitle
                breadCrumbItems={[
                    
                    { label: 'Direct Order', path: '/transport-request/direct-orders' },
                    { label: 'Add Pos', path: '', active: true },
                ]}
                title={'Add POs'}
            />



            <Card>
                <Card.Body>
                    <h4>Direct PO</h4>

                    <div className='row'>
                        <div className='col-lg-6'>

                            <h4>Material</h4>
                            <p>Ultratative fly</p>
                        </div>
                        <div className='col-lg-6'>

                            <h4>Supplier</h4>
                            <p>ABC Suppliers</p>

                        </div>
                    </div>
                </Card.Body>
            </Card>


            <Card>
                <Card.Body>
                    <h4>PO Details</h4>
                    {/* <div className='container-fluid'> */}
                    <form>
                    <Row>
                        <Col lg={12}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Site Location</Form.Label>
                                    <Form.Select defaultValue="">
                                        <option>....</option>
                                        <option>....</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Unit</Form.Label>
                                    <Form.Select defaultValue="">
                                        <option>....</option>
                                        <option>...</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control type='text' />

                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>PO Date</Form.Label>
                                    <Form.Control type='date' />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>PO Number</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>PO Value (Amount)</Form.Label>
                                    <Form.Control type='text' />

                                </Form.Group>
                            </Row>
                        </Col>

                        <Col lg={8}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>GST in %</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Upload PO</Form.Label>
                                    <Form.Control type='flie' />
                                </Form.Group>


                            </Row>

                        </Col>



                    </Row>

                    {/* </div> */}
                    <Button variant="danger" type="submit">
                        Send PO
                    </Button>
                    </form>
                </Card.Body>
            </Card>



        </>
    );
};


export default TranspReqAddPOs;