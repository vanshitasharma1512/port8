import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import moment from 'moment';
import MaterialTable from './viewMaterialTableDisabled';
import PlacesAutocomplete from 'react-places-autocomplete';
// import { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
// components
export default function PODetailDisabled({ poModal, setPOModal, POData }) {
    const handlePODClose = () => {
        setPOModal(false);
    };
    return (
        <Row>
            <Col>
                <Col xl={12}>
                    <Modal show={poModal} onHide={handlePODClose} size="xl">
                        <Modal.Header>
                            <Modal.Title>Purchase Order Detail</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Col xl={6} lg={6}>
                                <form style={{ width: '100%' }}>
                                    <div class="form-group" style={{ width: '100%' }}>
                                        <label for="formGroupExampleInput">Supplier</label>
                                        <input
                                            required
                                            type="text"
                                            class="form-control"
                                            id="formGroupExampleInput"
                                            value={POData?.vendor_name}
                                            placeholder="vendor_name Name"
                                            disabled
                                        />
                                    </div>
                                </form>
                            </Col>
                            <Col xl={12}>
                                <div class="form-group" style={{ marginTop: '20px' }}>
                                    <label for="formGroupExampleInput2">Material</label>
                                    <MaterialTable
                                        //  handleMaterial={handleMaterial}
                                        material={POData.materials}
                                    />
                                </div>
                            </Col>
                            <Row>
                                <Col
                                    xl={6}
                                    lg={6}
                                    style={{
                                        paddingRight: '20px',
                                    }}>
                                    <label for="cars">Site/Location</label>
                                    <div>
                                        <input
                                            required
                                            type="text"
                                            class="form-control"
                                            id="formGroupExampleInput2"
                                            value={POData?.buyer_site}
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col xl={6} lg={6}>
                                    <PlacesAutocomplete
                                    // value={address}
                                    //  onChange={setAddress} onSelect={handleSelect}
                                    >
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                                <label for="formGroupExampleInput2">Complete Address</label>

                                                <input
                                                    {...getInputProps({ placeholder: 'Enter Address' })}
                                                    style={{ width: '100%', height: '38px' }}
                                                    required
                                                    name="complete_address"
                                                    value={POData?.complete_address}
                                                    disabled
                                                />
                                                <p style={{ color: 'red' }}></p>
                                                <div>
                                                    {loading ? <div>...loading</div> : null}
                                                    {suggestions.map((suggestion) => {
                                                        const style = {
                                                            backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                                                            border: '1px solid black',
                                                        };
                                                        return (
                                                            <div {...getSuggestionItemProps(suggestion, { style })}>
                                                                {suggestion.description}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </PlacesAutocomplete>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={3} style={{ marginTop: '20px' }}>
                                    <div>
                                        <label for="cars">PO Date</label>

                                        <input
                                            required
                                            name="po_date"
                                            value={moment(POData?.po_date).format('YYYY-MM-DD')}
                                            type="date"
                                            class="form-control"
                                            id="formGroupExampleInput2"
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col xl={3} style={{ marginTop: '20px' }}>
                                    <div>
                                        <label for="cars">PO Number</label>

                                        <input
                                            name="po_number"
                                            value={POData?.po_number}
                                            required
                                            type="text"
                                            class="form-control"
                                            id="formGroupExampleInput2"
                                            disabled
                                        />
                                    </div>
                                </Col>

                                <Col xl={3} style={{ marginTop: '20px' }}>
                                    <div>
                                        <label for="cars">PO Value (Amount)</label>

                                        <input
                                            style={{ backgroundColor: 'grey', color: 'white' }}
                                            required
                                            type="text"
                                            class="form-control"
                                            id="formGroupExampleInput2"
                                            disabled
                                            value={POData?.po_value}
                                        />
                                    </div>
                                </Col>

                                <Col xl={3} style={{ marginTop: '20px' }}>
                                    <div>
                                        <label for="cars">GST</label>

                                        <input
                                            style={{ backgroundColor: 'grey', color: 'white' }}
                                            required
                                            type="text"
                                            class="form-control"
                                            id="formGroupExampleInput2"
                                            disabled
                                            value={POData?.gst_amount}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={12} style={{ marginTop: '20px' }}>
                                    <label for="cars">Description</label>

                                    <textarea
                                        class="form-control"
                                        id="textAreaExample1"
                                        rows="4"
                                        name="detail"
                                        value={POData?.detail}
                                        disabled
                                    />
                                </Col>

                                <Col xl={3} style={{ marginTop: '20px' }}>
                                    <div>
                                        <label for="cars">Attachment (if any)</label>

                                        <input
                                            disabled
                                            required
                                            type="file"
                                            class="form-control"
                                            id="formGroupExampleInput2"
                                            placeholder="Qty"
                                            // value={POData.attachment}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handlePODClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Col>
        </Row>
    );
}
