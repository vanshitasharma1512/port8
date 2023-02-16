import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Accordion, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getDriversList, getTruckList, updateScheduledTrip } from'../../../../shared/API';
import UploadFile from '../../uploadFile/UploadFile';
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
    pickup_address_id: 0,
    drop_address_id: 0,
};
function TripModalEdit({ openTrackModal, show, handleClose, handleShow, orderDetails, statusMsg }) {
    const state = useSelector((state) => state);
    const [materials, setmaterials] = useState();
    const [currentSeletedMaterial, setcurrentSeletedMaterial] = useState();
    const [currentSeletedMaterialUnit, setcurrentSeletedMaterialUnit] = useState();
    const [driversList, setdriversList] = useState([]);
    const [seletedDriverId, setseletedDriverId] = useState();
    const [seletedDriverDetails, setseletedDriverDetails] = useState();
    const [trucksList, settrucksList] = useState([]);
    const [seletedTruckId, setseletedTruckId] = useState();
    const [seletedTruckDetails, setseletedTruckDetails] = useState();
    const [pickUpAddress, setpickUpAddress] = useState(addressInit);
    const [dropAddress, setdropAddress] = useState(addressInit);
    const [deliveryChallan, setDeliveryChallan] = useState(null);
    const [ewayBill, setewayBill] = useState(null);
    const [tripDate, setTripDate] = useState();
    const [qty, setqty] = useState();
    const [status, setstatus] = useState('');

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

    useEffect(() => {
        getDriversList()
            .then((res) => {
                console.log(res.data.data);
                setdriversList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.data.message);
            });
        getTruckList()
            .then((res) => {
                console.log(res.data.data);
                settrucksList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.data.message);
            });
    }, []);

    useEffect(() => {
        if (state?.MaterialSupply?.trip) {
            console.log('>>>>', state.MaterialSupply.trip);
            let mainTripDetails = state.MaterialSupply.trip;
            let po_detail = state.MaterialSupply.master_order_details;
            setTripDate(getFormattedSate(mainTripDetails.trip_date));
            setqty(parseInt(mainTripDetails.quantity));

            //MATERIALS
            const { delivery_information } = po_detail.po_detail;
            setmaterials(delivery_information);

            setcurrentSeletedMaterial(mainTripDetails.material_id);
            //setcurrentSeletedMaterial(2);

            //STATUS

            setstatus(mainTripDetails.status);

            // DRIVER
            setseletedDriverId(mainTripDetails.driver_id);
            let driverSeleted = driversList.filter((item) => item.id == mainTripDetails.driver_id);
            if (driverSeleted.length > 0) {
                setseletedDriverDetails(driverSeleted[0]);
            } else {
                setseletedDriverDetails('');
            }
            // END DRIVER
            // TRUCK
            setseletedTruckId(mainTripDetails.truck_id);

            let truckSeleted = trucksList.filter((item) => item.id == mainTripDetails.truck_id);
            if (truckSeleted.length > 0) {
                setseletedTruckDetails(truckSeleted[0]);
            } else {
                setseletedTruckDetails('');
            }
            // END TRUCK
            // PICKUP ADDRESS
            let pAddress = mainTripDetails.pickup_address;
            // pAddress.pickup_address_id = mainTripDetails.pickup_address_id;
            setpickUpAddress(pAddress);
            // setpickUpAddress({...setpickUpAddress})

            // PICKUP ADDRESS END
            // DROP ADDRESS
            let dAddress = mainTripDetails.drop_address;
            //dAddress.drop_address_id = mainTripDetails.drop_address_id;
            setdropAddress(dAddress);
            // DROP ADDRESS END

            // ATTACHEMENTS
            setewayBill(mainTripDetails.e_way_bill);
            setDeliveryChallan(mainTripDetails.challan);
        }
    }, [state]);

    const getFormattedSate = (data) => {
        let d = new Date(data);
        let yy = d.getFullYear();
        let m = d.getMonth() + 1;
        let mm = m < 10 ? `0${m}` : `${m}`;
        let dd = d.getDate();
        let ddd = dd < 10 ? `0${dd}` : `${dd}`;
        return `${yy}-${mm}-${ddd}`;
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

    const handleSubmit = (e) => {
        e.preventDefault();
        let POID = state?.MaterialSupply?.trip?.po_id;
        let trip_id = state?.MaterialSupply?.trip?.trip_id;
        let formData = { trip: {}, pickUpAddress: {}, dropAddress: {} };
        formData.trip = {
            po_id: POID,
            trip_date: new Date(tripDate),
            remarks: '',
            quantity: parseInt(qty),
            material_id: parseInt(currentSeletedMaterial),
            truck_id: parseInt(seletedTruckId),
            driver_id: parseInt(seletedDriverId),
            challan: deliveryChallan,
            notes: null,
            e_way_bill: ewayBill,
            status: status,
            pickup_address_id: state.MaterialSupply.trip.pickup_address_id,
            drop_address_id: state.MaterialSupply.trip.drop_address_id,
        };
        formData.pickUpAddress = pickUpAddress;
        formData.dropAddress = dropAddress;

        console.log(formData);

        updateScheduledTrip(POID, trip_id, formData)
            .then((res) => {
                // console.log(res);
                statusMsg(res.data.message);
                toast.success(res.data.message);
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.data?.message);
            });
    };

    return (
        <>
            {state.MaterialSupply.trip && (
                <Modal show={show} onHide={handleClose} className="tripModal">
                    <ToastContainer />
                    <form onSubmit={handleSubmit} noValidate>
                        <Modal.Header closeButton>
                            <Modal.Title>Trip Details: {state.MaterialSupply.trip.trip_number}</Modal.Title>
                            {state.MaterialSupply.trip.status == 'Delivered' ? (
                                <div style={{ flex: 1, textAlign: 'right', paddingRight: '2rem' }}>
                                    <span
                                        onClick={openTrackModal}
                                        className="btn btn-danger btn-sm"
                                        style={{ marginRight: '15px' }}>
                                        <i className="mdi mdi-cellphone-marker"></i> &nbsp;Track
                                    </span>
                                    <a
                                        href={state.MaterialSupply.trip.e_way_bill}
                                        target="_blank"
                                        download
                                        className="btn btn-primary btn-sm"
                                        style={{ marginRight: '15px' }}>
                                        <i className="mdi mdi-download"></i> &nbsp;E-Way Bill
                                    </a>
                                    <a
                                        href={state.MaterialSupply.trip.challan}
                                        target="_blank"
                                        download
                                        className="btn btn-primary btn-sm">
                                        <i className="mdi mdi-download"></i> &nbsp;Challan
                                    </a>
                                </div>
                            ) : null}
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
                                                        disabled={state.MaterialSupply.trip.status != 'Scheduled'}
                                                        value={tripDate}
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
                                                        value={status}
                                                        aria-label="Default select example"
                                                        disabled={state.MaterialSupply.trip.status != 'Scheduled'}
                                                        onChange={(e) => setstatus(e.target.value)}
                                                        required>
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="InTransit">In Transit</option>
                                                        <option value="Delivered">Delivered</option>
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
                                                        disabled={state.MaterialSupply.trip.status != 'Scheduled'}
                                                        value={currentSeletedMaterial}
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
                                                        value={qty}
                                                        disabled={state.MaterialSupply.trip.status != 'Scheduled'}
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
                                                                value={seletedTruckId}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={seletedDriverId}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={pickUpAddress?.line1}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={pickUpAddress?.line2}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
                                                                value={pickUpAddress?.contact_person}
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
                                                                type="number"
                                                                name="mobile"
                                                                value={pickUpAddress?.mobile}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={pickUpAddress?.city}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={pickUpAddress?.country}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={pickUpAddress?.state}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={pickUpAddress?.pincode}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.line1}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.line2}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.contact_person}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.mobile}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.city}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.country}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.state}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                                value={dropAddress?.pincode}
                                                                disabled={
                                                                    state.MaterialSupply.trip.status != 'Scheduled'
                                                                }
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
                                                {state.MaterialSupply.trip.status == 'Scheduled' ? (
                                                    <Col xl={4} lg={2} className="hasAbs">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            value={deliveryChallan}
                                                        />{' '}
                                                        <UploadFile
                                                            style={{ position: 'absolute', left: '100%', top: '3px' }}
                                                            UploadFor="Trip"
                                                            file={deliveryChallan}
                                                            filePath={setDeliveryChallan}
                                                            mode="update"
                                                        />
                                                    </Col>
                                                ) : (
                                                    <Col xl={4} lg={2} className="hasAbs">
                                                        <UploadFile
                                                            UploadFor="Trip"
                                                            file={deliveryChallan}
                                                            filePath={setDeliveryChallan}
                                                            mode="update"
                                                            onlyView={true}
                                                        />
                                                    </Col>
                                                )}
                                            </Row>
                                            <Row className="mb-2">
                                                <Col xl={2} lg={2}>
                                                    E-Way Bill
                                                </Col>
                                                {state.MaterialSupply.trip.status == 'Scheduled' ? (
                                                    <Col xl={4} lg={2} className="hasAbs">
                                                        <input className="form-control" type="text" value={ewayBill} />
                                                        <UploadFile
                                                            style={{ position: 'absolute', left: '100%', top: '3px' }}
                                                            className="fileUploadBtn"
                                                            UploadFor="Trip"
                                                            file={ewayBill}
                                                            filePath={setewayBill}
                                                            mode="update"
                                                        />
                                                    </Col>
                                                ) : (
                                                    <Col xl={4} lg={2} className="hasAbs">
                                                        <UploadFile
                                                            className="fileUploadBtn"
                                                            UploadFor="Trip"
                                                            file={ewayBill}
                                                            filePath={setewayBill}
                                                            mode="update"
                                                            onlyView={true}
                                                        />
                                                    </Col>
                                                )}
                                            </Row>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Modal.Body>
                        {state.MaterialSupply.trip.status == 'Scheduled' ||
                        state.MaterialSupply.trip.status == 'scheduled' ? (
                            <Modal.Footer>
                                <button type="submit" className="btn btn-primary">
                                    Update
                                </button>
                            </Modal.Footer>
                        ) : null}
                    </form>
                </Modal>
            )}
        </>
    );
}

export default TripModalEdit;
