/* eslint-disable no-undef */
import React from 'react';
import { Badge, Col, Modal, Row, ToastContainer } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
import MarkarIcon from './../../Marker.png';
import { getTrackingData } from '../../../../shared/API';
import moment from 'moment';

const center = { lat: 23.124578, lng: 78.235689 };
// const origin = `23.124578, 78.235689`;
// const destination = `28.522600554321965, 77.21493238751135`;

const API_CALL_INTERVAL = 10000;

function TrackModal({ show, handleClose }) {
    const google = (window.google = window.google ? window.google : {});
    const state = useSelector((state) => state);
    const [directionResponse, setDirectionResponse] = useState();
    const [distance, setDistance] = useState();
    const [duration, setDuration] = useState();
    const [isLoding, setIsLoading] = useState(false);
    const [origin, setorigin] = useState('');
    const [destination, setdestination] = useState('');
    const [currentLocation, setcurrentLocation] = useState({});
    const [trackingData, settrackingData] = useState();

    useEffect(() => {
        handleGetTrackingData();
        //calculateRoute();

        // Scheduled API call

        let intval = setInterval(() => {
            handleGetTrackingData();
        }, API_CALL_INTERVAL);

        return () => {
            clearInterval(intval);
        };
    }, []);

    const handleDateFormat = (date) => {
        return moment(date).format('DD MMM YYYY');
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    });

    const handleGetTrackingData = () => {
        setIsLoading(true);
        if (state?.MaterialSupply?.trip?.trip_id) {
            let trip_id = state.MaterialSupply.trip.trip_id;
            getTrackingData(trip_id)
                .then((res) => {
                    setIsLoading(false);
                    settrackingData(res.data.data);

                    setOriginDestination(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                });
        } else {
            toast.error('Trip ID not found');
        }
    };

    const setOriginDestination = async (data) => {
        let pickup_location = data.pickup_location;
        let drop_location = data.drop_location;
        let current_location = data.current_location;

        if (pickup_location.latitude != '') {
            const directionService = new google.maps.DirectionsService();
            const res = await directionService.route({
                origin: `${pickup_location.latitude}, ${pickup_location.longitude}`,
                destination: `${drop_location.latitude}, ${drop_location.longitude}`,
                travelMode: google.maps.TravelMode.DRIVING,
            });

            if (current_location.latitude != '') {
                setcurrentLocation({
                    lat: parseFloat(current_location.latitude),
                    lng: parseFloat(current_location.longitude),
                });
            }
            // setcurrentLocation({ lat: 23.124578, lng: 78.235689 });
            setDirectionResponse(res);
            setDistance(res.routes[0].legs[0].distance.text);
            setDuration(res.routes[0].legs[0].duration.text);
        }

        // setorigin(`${pickup_location.latitude}, ${pickup_location.longitude}`);
        // setdestination(`${drop_location.latitude}, ${drop_location.longitude}`);
        // calculateRoute();
    };

    // const calculateRoute = async () => {
    //     if (origin == ', null' || origin == '' || origin == null || destination == '' || destination == null) {
    //         console.log('calculate route undefined');
    //     } else {
    //         console.log('calculate route');
    //         console.log(origin, destination);
    //         const directionService = new google.maps.DirectionsService();
    //         const res = await directionService.route({
    //             origin,
    //             destination,
    //             travelMode: google.maps.TravelMode.DRIVING,
    //         });

    //         setDirectionResponse(res);
    //         setDistance(res.routes[0].legs[0].distance.text);
    //         setDuration(res.routes[0].legs[0].duration.text);
    //     }
    // };

    // const checkCurrentLocAvailability = () => {
    //     if (
    //         trackingData?.current_location?.latitude == '' ||
    //         trackingData?.current_location?.latitude == null ||
    //         trackingData?.current_location?.longitude == '' ||
    //         trackingData?.current_location?.longitude == null
    //     ) {
    //         return false;
    //     }
    //     return true;
    // };

    return (
        <>
            {state.MaterialSupply.trip && (
                <Modal show={show} onHide={handleClose} className="trackModal">
                    <ToastContainer />

                    <Modal.Header closeButton>
                        <Modal.Title>Trip Tracking: {state.MaterialSupply.trip.trip_number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="truckInformation">
                            <Row>
                                <Col xl={4} sm={12}>
                                    <b>Current Location: </b>
                                    {trackingData && trackingData.current_location.address != null ? (
                                        <>{trackingData.current_location.address}</>
                                    ) : (
                                        '----'
                                    )}
                                </Col>
                                <Col xl={4} sm={12}>
                                    <b>Truck: </b>
                                    {trackingData && trackingData.truck_detail.truck_number != null
                                        ? trackingData.truck_detail.truck_number
                                        : '----'}
                                </Col>
                                <Col xl={4} sm={12}>
                                    <b>Driver: </b>
                                    {trackingData && trackingData.truck_detail.driver_name != null
                                        ? trackingData.truck_detail.driver_name
                                        : '----'}
                                    &nbsp;<i className="mdi mdi-phone"></i>{' '}
                                    {trackingData && trackingData.truck_detail.driver_mobile != null
                                        ? trackingData.truck_detail.driver_mobile
                                        : '----'}
                                </Col>
                            </Row>
                        </div>

                        {isLoaded && (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '400px' }}
                                zoom={5}
                                center={currentLocation.lat ? currentLocation : center}
                                options={{
                                    // zoomControl: false,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                }}>
                                {currentLocation.lat && (
                                    <Marker
                                        position={currentLocation}
                                        animation="BOUNCE"
                                        icon={{
                                            url: MarkarIcon,
                                            scaledSize: { width: 40, height: 40 },
                                            origin: { x: 0, y: 0 }, // origin
                                            rotation: 45,
                                            //anchor: { x: 0, y: 0 }, // anchor
                                        }}
                                    />
                                )}
                                {directionResponse && <DirectionsRenderer directions={directionResponse} />}
                            </GoogleMap>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <div style={{ width: '100%' }}>
                            <Row>
                                <Col xl={6} sm={12}>
                                    <p className="head">
                                        <b>Pickup Location</b>
                                    </p>
                                    {trackingData && trackingData.pickup_location.address != null && (
                                        <p>{trackingData.pickup_location.address}</p>
                                    )}

                                    <p className="head">
                                        <b>Drop Location</b>
                                    </p>
                                    {trackingData && trackingData.pickup_location.address != null && (
                                        <p>{trackingData.drop_location.address}</p>
                                    )}
                                </Col>
                                <Col xl={6} sm={12}>
                                    <p className="head">
                                        <b>Activities</b>
                                    </p>
                                    {trackingData && trackingData.activities.length > 0 ? (
                                        <div className="tracking_activities">
                                            <ul>
                                                {trackingData.activities.map((item, index) => {
                                                    return (
                                                        <li key={index}>
                                                            {item.activity_detail}{' '}
                                                            <Badge bg="primary">
                                                                {handleDateFormat(item.activity_date)}
                                                            </Badge>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No activities found!</p>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}

export default TrackModal;
