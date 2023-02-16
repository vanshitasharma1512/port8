import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Accordion, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { getDriversList, getTruckList, scheduleNewTrip } from '../../../../shared/API';
import UploadFile from '../../uploadFile/UploadFile';

function TripModal({ show, handleClose, orderDetails, statusMsg }) {
    const [materials, setmaterials] = useState();
    const [currentSeletedMaterial, setcurrentSeletedMaterial] = useState();
    const [currentSeletedMaterialUnit, setcurrentSeletedMaterialUnit] = useState();
    const [driversList, setdriversList] = useState([]);
    const [seletedDriverId, setseletedDriverId] = useState();
    const [seletedDriverDetails, setseletedDriverDetails] = useState();
    const [trucksList, settrucksList] = useState([]);
    const [seletedTruckId, setseletedTruckId] = useState();
    const [seletedTruckDetails, setseletedTruckDetails] = useState();

    const [deliveryChallan, setDeliveryChallan] = useState(null);
    const [ewayBill, setewayBill] = useState(null);
    const [tripDate, setTripDate] = useState();
    const [qty, setqty] = useState();
    const addressInit = {
        line1: '',
        line2: '',
        city: '',
        country: '',
        mobile: '',
        contact_person: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
    };
    const [pickUpAddress, setpickUpAddress] = useState(addressInit);
    const [dropAddress, setdropAddress] = useState(addressInit);

    useEffect(() => {
        const { delivery_information } = orderDetails.po_detail;
        setmaterials(delivery_information);

        getDriversList()
            .then((res) => {
                // console.log(res.data.data);
                setdriversList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.data.message);
            });
        getTruckList()
            .then((res) => {
                //console.log(res.data.data);
                settrucksList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.data.message);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = { trip: {}, pickUpAddress: {}, dropAddress: {} };
        formData.trip = {
            po_id: orderDetails.po_id,
            trip_date: new Date(tripDate),
            remarks: '',
            quantity: parseInt(qty),
            material_id: parseInt(currentSeletedMaterial),
            truck_id: parseInt(seletedTruckId),
            driver_id: parseInt(seletedDriverId),
            challan: deliveryChallan,
            notes: null,
            e_way_bill: ewayBill,
            status: 'Scheduled',
        };
        formData.pickUpAddress = pickUpAddress;
        formData.dropAddress = dropAddress;

        scheduleNewTrip(orderDetails.po_id, formData)
            .then((res) => {
                // console.log(res);
                // statusMsg(res.data.message);
                // toast.success(res.data.message);
                if (res.data.message == '') {
                    statusMsg('Trip Added Successfully!');
                    //toast.success('Invoiced Added Successfully!');
                } else {
                    statusMsg(res.data.message);
                    toast.success(res.data.message);
                }
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message);
            });
    };
    const onmaterialselect = (e) => {
        let current_selected_material = e.target.value;
        setcurrentSeletedMaterial(current_selected_material);
        let materialSeleted = materials.filter((item) => item.material_id == current_selected_material);
        if (materialSeleted.length > 0) {
            setcurrentSeletedMaterialUnit(materialSeleted[0].unit);
        } else {
            setcurrentSeletedMaterialUnit('');
        }
    };

    const selectTruckOnChange = (e) => {
        let current_selected = e.target.value;
        setseletedTruckId(current_selected);
        let truckSeleted = trucksList.filter((item) => item.id == current_selected);
        if (truckSeleted.length > 0) {
            setseletedTruckDetails(truckSeleted[0]);
        } else {
            setseletedTruckDetails('');
        }
    };

    const selectDriverOnChange = (e) => {
        let current_selected = e.target.value;

        setseletedDriverId(current_selected);
        let driverSeleted = driversList.filter((item) => item.id == current_selected);
        if (driverSeleted.length > 0) {
            setseletedDriverDetails(driverSeleted[0]);
        } else {
            setseletedDriverDetails('');
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} className="tripModal">
                <ToastContainer />
                <form onSubmit={handleSubmit} noValidate>
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule New Trip</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Accordion defaultActiveKey="0" className="p-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Trip Information </Accordion.Header>
                                <Accordion.Body>
                                    <div className="p-2">
                                        <h5 className="mb-3">Trip Information</h5>
                                        <Row className="mb-2">
                                            <Col xl={2} lg={2}>
                                                Trip Date
                                            </Col>
                                            <Col xl={3} lg={2}>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    required
                                                    onChange={(e) => setTripDate(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col xl={2} lg={2}>
                                                Status
                                            </Col>
                                            <Col xl={3} lg={2}>
                                                <Form.Select
                                                    className="custom-select"
                                                    disabled
                                                    aria-label="Default select example"
                                                    required>
                                                    <option>Scheduled</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col xl={2} lg={2}>
                                                Material
                                            </Col>
                                            <Col xl={3} lg={2}>
                                                <Form.Select
                                                    className="custom-select"
                                                    aria-label="Default select example"
                                                    onChange={onmaterialselect}
                                                    required>
                                                    <option key="-1" value="-1">
                                                        Select Material
                                                    </option>
                                                    {materials &&
                                                        materials.map((item, index) => {
                                                            return (
                                                                <option value={item.material_id} key={index}>
                                                                    {item.material_name}
                                                                </option>
                                                            );
                                                        })}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col xl={2} lg={2}>
                                                Quantity
                                            </Col>
                                            <Col xl={3} lg={2} className="hasAbs">
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    required
                                                    onChange={(e) => setqty(e.target.value)}
                                                />
                                                {currentSeletedMaterialUnit && (
                                                    <span className="uom">{currentSeletedMaterialUnit}</span>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Truck & Driver Details</Accordion.Header>
                                <Accordion.Body>
                                    <div className="p-2">
                                        <Row>
                                            <Col xl={6} lg={6}>
                                                <h5 className="mb-3">Truck Details</h5>
                                                <Row className="mb-2">
                                                    <Col xl={4} lg={6}>
                                                        Vehicle Number
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <Form.Select
                                                            className="custom-select"
                                                            aria-label="Default select example"
                                                            onChange={selectTruckOnChange}>
                                                            <option key={`-1`}>Select Truck</option>
                                                            {trucksList.map((item, index) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={item.id}
                                                                        disabled={!item.active}>
                                                                        {item.registration_no}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Form.Select>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={4} lg={6}>
                                                        Truck Type
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        {seletedTruckDetails && (
                                                            <input
                                                                disabled
                                                                className="form-control"
                                                                type="text"
                                                                value={`${seletedTruckDetails.truck_type_name} Truck`}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={4} lg={6}>
                                                        Quantity
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        {seletedTruckDetails && (
                                                            <input
                                                                disabled
                                                                className="form-control"
                                                                type="text"
                                                                value={`${seletedTruckDetails.truck_model}`}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl={6} lg={6}>
                                                <h5 className="mb-3">Driver Details</h5>
                                                <Row className="mb-2">
                                                    <Col xl={4} lg={6}>
                                                        Driver Name
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <Form.Select
                                                            className="custom-select"
                                                            aria-label="Default select example"
                                                            onChange={selectDriverOnChange}>
                                                            <option key={`-1`}>Select Driver</option>
                                                            {driversList.map((item, index) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={item.id}
                                                                        disabled={!item.active}>
                                                                        {item.first_name}
                                                                        {item.last_name}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Form.Select>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={4} lg={6}>
                                                        Contact No.
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        {seletedDriverDetails && (
                                                            <input
                                                                disabled
                                                                className="form-control"
                                                                type="number"
                                                                value={seletedDriverDetails.mobile}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={4} lg={6}>
                                                        License No.
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        {seletedDriverDetails && (
                                                            <input
                                                                disabled
                                                                className="form-control"
                                                                type="text"
                                                                value={`${
                                                                    seletedDriverDetails.driving_license_no
                                                                        ? seletedDriverDetails.driving_license_no
                                                                        : `N/A`
                                                                }`}
                                                            />
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Pickup Location</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col xl={4} lg={4}>
                                            <div className="p-2">
                                                <h5 className="mb-3">Pickup Location</h5>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Address Line 1
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    line1: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Address Line 2
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    line2: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Contact Person
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="contact_person"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    contact_person: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Contact No.
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="mobile"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    mobile: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                        <Col xl={2} lg={2}></Col>
                                        <Col xl={4} lg={4}>
                                            <div className="p-2">
                                                <h5 className="mb-3">&nbsp;</h5>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        City
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    city: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Country
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    country: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        State
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="contact_person"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    state: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Pincode
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="mobile"
                                                            onChange={(e) =>
                                                                setpickUpAddress({
                                                                    ...pickUpAddress,
                                                                    pincode: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Drop Location</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col xl={4} lg={4}>
                                            <div className="p-2">
                                                <h5 className="mb-3">Drop Location</h5>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Address Line 1
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    line1: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Address Line 2
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    line2: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Contact Person
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="contact_person"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    contact_person: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Contact No.
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="mobile"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    mobile: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                        <Col xl={2} lg={2}></Col>
                                        <Col xl={4} lg={4}>
                                            <div className="p-2">
                                                <h5 className="mb-3">&nbsp;</h5>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        City
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    city: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Country
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    country: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        State
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="contact_person"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    state: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-2">
                                                    <Col xl={6} lg={6}>
                                                        Pincode
                                                    </Col>
                                                    <Col xl={6} lg={6}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="mobile"
                                                            onChange={(e) =>
                                                                setdropAddress({
                                                                    ...dropAddress,
                                                                    pincode: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>Attachments</Accordion.Header>
                                <Accordion.Body>
                                    <div className="p-2">
                                        <h5 className="mb-3">Attachments</h5>

                                        <Row className="mb-2">
                                            <Col xl={2} lg={2}>
                                                Delivery Challan
                                            </Col>
                                            <Col xl={4} lg={2} className="hasAbs">
                                                <input className="form-control" type="text" value={deliveryChallan} />{' '}
                                                <UploadFile
                                                    style={{ position: 'absolute', left: '100%', top: '3px' }}
                                                    UploadFor="Trip"
                                                    file={deliveryChallan}
                                                    filePath={setDeliveryChallan}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col xl={2} lg={2}>
                                                E-Way Bill
                                            </Col>
                                            <Col xl={4} lg={2} className="hasAbs">
                                                <input className="form-control" type="text" value={ewayBill} />
                                                <UploadFile
                                                    style={{ position: 'absolute', left: '100%', top: '3px' }}
                                                    className="fileUploadBtn"
                                                    UploadFor="Trip"
                                                    file={ewayBill}
                                                    filePath={setewayBill}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">
                            Schedule
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default TripModal;
