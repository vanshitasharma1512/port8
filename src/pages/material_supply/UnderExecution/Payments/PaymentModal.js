import React, { useEffect, useState } from 'react';
import { Badge, Col, Form, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { createInvoices, createPayment } from '../../../../shared/API';
import { paymentModes } from '../../Constants';
import './../../custom.scss';

const initialInvoiceObj = {
    id: 0,
    hsn_code: '',
    material_name: '',
    material_id: 0,
    material_uom: '',
    qty: 0,
    rate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    amount: 0,
    gst_rate: 0,
};

const initialFullInvoice = {
    payment_date: '',
    payment_amount: 0,
    payment_mode: 0,
    transaction_no: '',
    other_details: '',
};

function PaymentModal({ show, handleClose, orderDetails, statusMsg }) {
    const state = useSelector((state) => state.MaterialSupply);

    const [invoicedate, setinvoicedate] = useState('');
    const [materials, setmaterials] = useState();
    const [buyerInfo, setbuyerInfo] = useState({
        name: '',
        email: '',
        mobile: '',
        contact_person: '',
        city: '',
        address: '',
    });
    const [currentSeletedMaterial, setcurrentSeletedMaterial] = useState('');
    const [currentSeletedMaterialUnit, setcurrentSeletedMaterialUnit] = useState();

    const [addInvoiceItemFormValue, setAddInvoiceItemFormValue] = useState(initialInvoiceObj);
    const [userCreatedInvoices, setUserCreatedInvoices] = useState([]);
    const [invoceData, setinvoceData] = useState(initialFullInvoice);
    const [seletedMaterialObj, setseletedMaterialObj] = useState({});
    const [associatedInvoce, setAssociatedInvoice] = useState([]);

    useEffect(() => {
        const {
            delivery_information,
            buyer_name,
            buyer_mobile,
            buyer_email,
            buyer_contact_person,
            buyer_city,
            buyer_address,
        } = state.master_order_details.po_detail;
        setbuyerInfo({
            name: buyer_name,
            email: buyer_email,
            mobile: buyer_mobile,
            contact_person: buyer_contact_person,
            city: buyer_city,
            address: buyer_address,
        });
        setmaterials(delivery_information);
    }, []);

    const handleAssociatedInvoice = (e, item) => {
        let isChecked = e.target.checked;
        let id = item.id;
        if (isChecked) {
            //
            setAssociatedInvoice([...associatedInvoce, { invoice_id: id }]);
        } else {
            let fitems = associatedInvoce.filter((item) => item.invoice_id != id);
            setAssociatedInvoice(fitems);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(invoceData);
        console.log(associatedInvoce);

        let po_id = state.master_order_details.po_detail.po_id;

        let masterPaymentData = {
            payment_date: new Date(invoceData.payment_date),
            amount: parseInt(invoceData.payment_amount),
            payment_mode: invoceData.payment_mode,
            transaction_detail: invoceData.other_details,
            transaction_no: invoceData.transaction_no,
            invoices: associatedInvoce,
        };

        console.log(JSON.stringify(masterPaymentData));

        // let masterInvoiceData = {
        //     invoice_date: new Date(invoceData.invoice_date),
        //     po_id,
        //     billingTo_id: null,
        //     billingBy_id: null,
        //     address: '',
        //     invoice_no: invoceData.invoice_number,
        //     gst: invoceData.gst,
        //     total_amount: invoceData.total,
        //     payable_amount: invoceData.payable_amount,
        //     invoice_status: 'UnPaid',
        //     other_detail: invoceData.other_details,
        //     invoice_pdf: '',
        //     paid_amount: 0,
        //     invoice_trips: associatedInvoce,
        //     invoice_items: userCreatedInvoices,
        // };
        console.log('🚀 masterPaymentData', masterPaymentData);

        createPayment(po_id, masterPaymentData)
            .then((res) => {
                if (res.data.message == '') {
                    statusMsg('Receipt Added Successfully!');
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
    const getFormattedSate = (data) => {
        let d = new Date(data);
        let yy = d.getFullYear();
        let m = d.getMonth() + 1;
        let mm = m < 10 ? `0${m}` : `${m}`;
        let dd = d.getDate();
        let ddd = dd < 10 ? `0${dd}` : `${dd}`;
        return `${ddd}-${mm}-${yy}`;
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} className="tripModal invoieModal">
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Payment Receipt</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="p-2">
                            <Row className="mb-2">
                                <Col xl={4} lg={6}>
                                    <label className="blockLabel">
                                        <p>Payment Date</p>
                                        <input
                                            className="form-control"
                                            type="date"
                                            required
                                            value={invoceData.payment_date}
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, payment_date: e.target.value })
                                            }
                                        />
                                    </label>
                                </Col>
                                <Col xl={4} lg={6}>
                                    <label className="blockLabel">
                                        <p>Amount</p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={invoceData.payment_amount}
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, payment_amount: e.target.value })
                                            }
                                        />
                                    </label>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col xl={4} lg={6}>
                                    <label className="blockLabel">
                                        <p>Payment Mode</p>
                                        <Form.Select
                                            className="custom-select"
                                            aria-label="Default select example"
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, payment_mode: e.target.value })
                                            }
                                            value={addInvoiceItemFormValue.payment_mode}>
                                            <option key="-1" value="">
                                                Select Mode
                                            </option>
                                            {paymentModes &&
                                                paymentModes.map((item, index) => {
                                                    return (
                                                        <option value={item.value} key={index}>
                                                            {item.name}
                                                        </option>
                                                    );
                                                })}
                                        </Form.Select>
                                    </label>
                                </Col>
                                <Col xl={4} lg={6}>
                                    <label className="blockLabel">
                                        <p>Transaction/Cheque Number</p>
                                        <input
                                            disabled={invoceData.payment_mode == 'Cash'}
                                            type="text"
                                            className="form-control"
                                            required
                                            value={invoceData.transaction_no}
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, transaction_no: e.target.value })
                                            }
                                        />
                                    </label>
                                </Col>
                                <Col xl={4} lg={6}>
                                    <label className="blockLabel">
                                        <p>Other Details</p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={invoceData.other_details}
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, other_details: e.target.value })
                                            }
                                        />
                                    </label>
                                </Col>
                            </Row>

                            <Row>
                                <Col xl={6} lg={6}>
                                    <h5 className="mb-3">Associated Invoces</h5>
                                    <ul className="trips_list_ul">
                                        {state?.master_order_details?.invoice_detail.map((item, index) => {
                                            return (
                                                <li key={index} style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'flex', columnGap: '20px' }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            onClick={(e) => handleAssociatedInvoice(e, item)}
                                                        />
                                                        {item.id_value}{' '}
                                                        <Badge bg="secondary">
                                                            {getFormattedSate(item.invoice_date)}
                                                        </Badge>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">
                            Add Receipt
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default PaymentModal;
