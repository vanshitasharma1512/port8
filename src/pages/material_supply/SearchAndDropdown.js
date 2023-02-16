import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const SearchAndDropdown = ({ handleChange, handleStatus, Index, workacquisitionSortData, underexecutionSortData }) => {
    return (
        <>
            <Row style={{ marginTop: '20px', marginBottom: '50px', justifyContent: 'right', display: 'flex' }}>
                <Col xl={2} sm={12}>
                    <input
                        required
                        type="search"
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
                            <option key={`all`} value="">
                                All
                            </option>
                            {Index == 0 ? (
                                <>
                                    {workacquisitionSortData.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </>
                            ) : Index == 1 ? (
                                <>
                                    {underexecutionSortData.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                ''
                            )}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};

export default SearchAndDropdown;
