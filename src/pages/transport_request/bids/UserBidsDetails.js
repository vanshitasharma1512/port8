// @flow
import React from 'react';
import { Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PageTitle from '../../../components/PageTitle';
import { Link } from 'react-router-dom';


const TranspReqUserBidsDetails = () => {
  return (

    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'RFQ', path: '/transport-request/rfq' },
          { label: 'Bids Details', path: '', active: true },
        ]}
        title={'Bids Details'}
      />

      {/* <h4 className="header-title mb-3">Bids / Quote details</h4> */}
      {/* <div className='container-fluid'>
        <h4 className="header-title">Request details</h4> */}

      <Col xs={12}>
      <Card>
                <Card.Body>
                    <h4>Request Details</h4>
                    <Row>
                        <Col lg={4} >
                            <h4>Quote Id</h4>
                            <p>ATSPL-BPL-123</p>
                        </Col>
                        <Col lg={4} >
                            <h4>Published On</h4>
                            <p>12 Aug 2022</p>
                        </Col>
                        {/* <Col lg={4} >
                            <h4>Site/Location</h4>
                            <p>Hyderabad</p>
                        </Col> */}
                         <Col lg={2} >
                            <h4>Pickup Location</h4>
                            <p>Hyderabad</p>
                        </Col>
                        <Col lg={2} >
                            <h4>Drop Location</h4>
                            <p>Delhi</p>
                        </Col> 
                        <Col lg={4} >
                            <h4>Material</h4>
                            <p>Ultrafine Flyash</p>
                        </Col>
                        <Col lg={4} >
                            <h4>Quantity</h4>
                            <p>200 MT</p>
                        </Col>
                        {/* <Col lg={3} >
                            <h4>Organization/Requested By</h4>
                            <p>Delhi</p>
                        </Col> */}
                        <Col lg={4} >
                            <h4>PO Validity Date</h4>
                            <p>15 Aug 2022</p>
                        </Col>
                        {/* <Col lg={3} >
                            <h4>Contact Person Name</h4>
                            <p>KK Soni</p>
                        </Col>
                        <Col lg={3} >
                            <h4>Mobile</h4>
                            <p>7566550986</p>
                        </Col>
                        <Col lg={3} >
                            <h4>Email</h4>
                            <p>kksoni@acompworld.com</p>
                        </Col> */}
                        <Col lg={12} >
                            <h4>Description</h4>
                            <p>With supporting text below as a natural lead-in to additional contenposuere erat a ante.
                                Voluptates, illo, iste itaque voluptas corrupti ratione reprehenderit magni similique?
                                Tempore, quos delectus asperiores libero voluptas quod perferendis! Voluptate, quod illo
                                rerum? Lorem ipsum dolor sit amet.</p>
                        </Col>



                    </Row>

                </Card.Body>
            </Card>
      </Col>
      {/* <Button variant='outline-info'>Description</Button> */}

      <Row>
        <Col xs={8}>
          <Card>
            <Card.Body>
              <h4>Other Bids</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Transporter</th>
                    <th>Bid plan</th>
                    <th>Remark</th>
                    <th>Action</th>
                    <th>View</th>


                  </tr>
                </thead>
                <tbody>
                  <tr>

                    <td>XOZ supplier</td>
                    <td>4500</td>
                    <td>---</td>
                    <td>      <Button variant='outline-info'>Select</Button>
                    </td>
                    <td><Link to="/transport-request/fleet-profile" className="btn btn-default"><i className="mdi mdi-eye"></i></Link></td>


                  </tr>
                  <tr>

                    <td>XOZ supplier</td>
                    <td>4500</td>
                    <td>---</td>
                    <td><Button variant='outline-info'>Select</Button>
                    </td>
                    <td><Link to="/transport-request/fleet-profile" className="btn btn-default"><i className="mdi mdi-eye"></i></Link></td>


                  </tr>
                  <tr>

                    <td>XOZ supplier</td>
                    <td>4500</td>
                    <td>---</td>
                    <td><Button variant='outline-info'>Select</Button>
                    </td>
                    <td><Link to="/transport-request/fleet-profile" className="btn btn-default"><i className="mdi mdi-eye"></i></Link></td>
                  </tr>

                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>



        <Col xs={4}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>PO Date</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>PO Number</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>GST in %</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Upload PO</Form.Label>
                  <Form.Control type="file" Placeholders="Browse" />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <div className='mb-4' style={{textAlign:"right"}}>
        <Button variant="danger" type="submit">
          Accept & Update
        </Button>
      </div>
    </>
  );
};



export default TranspReqUserBidsDetails;
