import React, { useEffect, useState } from 'react';
import { Badge, Col, Form, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { createInvoices } from '../../../../shared/API';
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
    invoice_number: '',
    invoice_date: '',
    total: 0,
    gst: 0,
    payable_amount: 0,
    other_details: '',
    associated_trips: [],
};

function InvoiceModal({ show, handleClose, orderDetails, statusMsg }) {
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
    const [associatedTrips, setAssociatedTrips] = useState([]);

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

    const getFormattedSate = (data) => {
        let d = new Date(data);
        let yy = d.getFullYear();
        let m = d.getMonth() + 1;
        let mm = m < 10 ? `0${m}` : `${m}`;
        let dd = d.getDate();
        let ddd = dd < 10 ? `0${dd}` : `${dd}`;
        return `${ddd}-${mm}-${yy}`;
    };

    useEffect(() => {
        calculateTotal();
    }, [userCreatedInvoices]);

    const calculateTotal = () => {
        let totalWithoutGST = 0;
        let totalGST = 0;
        let totalWithGST = 0;

        if (userCreatedInvoices.length > 0) {
            userCreatedInvoices.map((item) => {
                let rate = item.rate;
                let qty = item.qty;
                let { cgst, sgst, igst } = calculateTotalGSTrate(item);

                let cgstPercentage = cgst;
                let sgstPercentage = sgst;
                let igstPercentage = igst;
                let amount = qty * rate;
                let cgstAmount = (amount * cgstPercentage) / 100;
                let sgstAmount = (amount * sgstPercentage) / 100;
                let igstAmount = (amount * igstPercentage) / 100;
                let totalAmount = amount + cgstAmount + sgstAmount + igstAmount;
                totalWithoutGST = totalWithoutGST + amount;
                totalGST = totalGST + (cgstAmount + sgstAmount + igstAmount);
                totalWithGST = totalWithoutGST + totalGST;
            });
        }

        setinvoceData({ ...invoceData, total: totalWithoutGST, gst: totalGST, payable_amount: totalWithGST });
    };

    const onmaterialselect = (e) => {
        let current_selected_material = e.target.value;
        setcurrentSeletedMaterial(current_selected_material);
        let materialSeleted = materials.filter((item) => item.material_id == current_selected_material);
        if (materialSeleted.length > 0) {
            setseletedMaterialObj(materialSeleted[0]);
            //calculateGST rate
            let { cgst, sgst, igst } = calculateTotalGSTrate(materialSeleted[0]);

            setAddInvoiceItemFormValue({
                ...addInvoiceItemFormValue,
                material_name: materialSeleted[0].material_name,
                material_id: materialSeleted[0].material_id,
                material_uom: materialSeleted[0].unit,
                rate: materialSeleted[0].rate,
                cgst,
                sgst,
                igst,
                gst_rate: materialSeleted[0].gst_rate,
                hsn_code: materialSeleted[0].hsn_code,
            });
            setcurrentSeletedMaterialUnit(materialSeleted[0].unit);
        } else {
            setAddInvoiceItemFormValue(initialInvoiceObj);
            setcurrentSeletedMaterialUnit('');
        }
    };

    const calculateTotalGSTrate = (item) => {
        let gst_rate = item.gst_rate;

        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        let { supply_state_id, supplier_state_id } = state.master_order_details.po_detail;

        if (supply_state_id == supplier_state_id) {
            cgst = (gst_rate / 2).toFixed(2);
            sgst = (gst_rate / 2).toFixed(2);
            igst = 0;
        } else {
            cgst = 0;
            sgst = 0;
            igst = gst_rate;
        }
        return { cgst, sgst, igst };
    };

    const onQtyChange = (e) => {
        let qty = parseInt(e.target.value);
        let rate = seletedMaterialObj.rate;
        let { cgst, sgst, igst } = calculateTotalGSTrate(seletedMaterialObj);
        let cgstPercentage = cgst;
        let sgstPercentage = sgst;
        let igstPercentage = igst;
        let amount = qty * rate;
        let cgstAmount = (amount * cgstPercentage) / 100;
        let sgstAmount = (amount * sgstPercentage) / 100;
        let igstAmount = (amount * igstPercentage) / 100;
        let totalAmount = amount + cgstAmount + sgstAmount + igstAmount;
        setAddInvoiceItemFormValue({
            ...addInvoiceItemFormValue,
            qty,
            amount: totalAmount,
        });
    };

    const handleAddNewInvoiceData = (item) => {
        if (addInvoiceItemFormValue.material_id == 0 || addInvoiceItemFormValue.material_name == '') {
            toast.error('Please Select A Material !');
            return;
        }
        if (addInvoiceItemFormValue.qty == 0) {
            toast.error('Please Select Quantity');
            return;
        }
        if (addInvoiceItemFormValue.qty < 0) {
            toast.error('Quantity cannot be less than 0');
            return;
        }
        // addInvoiceItemFormValue.id = addInvoiceItemFormValue.length + 1;
        setAddInvoiceItemFormValue({
            ...addInvoiceItemFormValue,
            id: Date.now(),
        });
        let lats = item;
        lats.id = Date.now();

        setUserCreatedInvoices([...userCreatedInvoices, lats]);
        setAddInvoiceItemFormValue(initialInvoiceObj);
    };
    const deleteCreatedInvoiceItem = (e, id) => {
        e.preventDefault();
        let itemsLeft = userCreatedInvoices.filter((item, i) => item.id != id);

        setUserCreatedInvoices(itemsLeft);
    };

    const handleAssociatedTrips = (e, item) => {
        let isChecked = e.target.checked;
        let trip_id = item.trip_id;
        if (isChecked) {
            //
            setAssociatedTrips([...associatedTrips, { trip_id }]);
        } else {
            let fitems = associatedTrips.filter((item) => item.trip_id != trip_id);
            setAssociatedTrips(fitems);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let po_id = state.master_order_details.po_detail.po_id;

        let masterInvoiceData = {
            invoice_date: new Date(invoceData.invoice_date),
            po_id,
            billingTo_id: null,
            billingBy_id: null,
            address: '',
            invoice_no: invoceData.invoice_number,
            gst: invoceData.gst,
            total_amount: invoceData.total,
            payable_amount: invoceData.payable_amount,
            invoice_status: 'UnPaid',
            other_detail: invoceData.other_details,
            invoice_pdf: '',
            paid_amount: 0,
            invoice_trips: associatedTrips,
            invoice_items: userCreatedInvoices,
        };
        console.log('🚀 masterInvoiceData', masterInvoiceData);

        createInvoices(po_id, masterInvoiceData)
            .then((res) => {
                if (res.data.message == '') {
                    statusMsg('Invoiced Added Successfully!');
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

    return (
        <>
            <Modal show={show} onHide={handleClose} className="tripModal invoieModal">
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Invoice</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="p-2">
                            <Row className="mb-2">
                                <Col xl={4} lg={6}>
                                    <label className="blockLabel">
                                        <p>Invoice Number</p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={invoceData.invoice_number}
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, invoice_number: e.target.value })
                                            }
                                        />
                                    </label>
                                </Col>
                                <Col xl={2} lg={6}>
                                    <label className="blockLabel">
                                        <p>Invoice Date</p>
                                        <input
                                            className="form-control"
                                            type="date"
                                            required
                                            value={invoceData.invoice_date}
                                            onChange={(e) =>
                                                setinvoceData({ ...invoceData, invoice_date: e.target.value })
                                            }
                                        />
                                    </label>
                                </Col>
                                <Col xl={6} lg={6}>
                                    <label className="blockLabel">
                                        <p>Billing To</p>
                                        <input className="form-control" type="text" disabled value={buyerInfo.name} />
                                    </label>
                                </Col>
                            </Row>
                            <div className="mt-2">
                                <h5 className="mb-3">Items</h5>
                                <Row>
                                    <Col xl={6} lg={6}>
                                        <Row>
                                            <Col xl={4} lg={4}>
                                                <label className="blockLabel">
                                                    <p>Material</p>
                                                    <Form.Select
                                                        className="custom-select"
                                                        aria-label="Default select example"
                                                        onChange={onmaterialselect}
                                                        value={addInvoiceItemFormValue.material_id}>
                                                        <option key="-1" value="">
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
                                                </label>
                                            </Col>
                                            <Col xl={4} lg={4}>
                                                <label className="blockLabel">
                                                    <p>Quantity</p>
                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            style={{ flex: 1 }}
                                                            className="form-control"
                                                            type="number"
                                                            value={addInvoiceItemFormValue.qty}
                                                            disabled={currentSeletedMaterial == ''}
                                                            onChange={onQtyChange}
                                                        />
                                                        {currentSeletedMaterialUnit && (
                                                            <span style={{ marginLeft: '10px' }} className="uom">
                                                                {currentSeletedMaterialUnit}
                                                            </span>
                                                        )}
                                                    </span>
                                                </label>
                                            </Col>
                                            <Col xl={4} lg={4}>
                                                <label className="blockLabel">
                                                    <p>Rate</p>
                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            style={{ flex: 1 }}
                                                            className="form-control"
                                                            type="number"
                                                            value={addInvoiceItemFormValue.rate}
                                                            disabled
                                                        />
                                                        {currentSeletedMaterialUnit && (
                                                            <span style={{ marginLeft: '10px' }} className="uom">
                                                                /{currentSeletedMaterialUnit}
                                                            </span>
                                                        )}
                                                    </span>
                                                </label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xl={6} lg={6}>
                                        <Row className="lesspadding">
                                            <Col xl={2} lg={2}>
                                                <label className="blockLabel">
                                                    <p>CGST %</p>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        disabled
                                                        value={addInvoiceItemFormValue.cgst}
                                                    />
                                                </label>
                                            </Col>
                                            <Col xl={2} lg={2}>
                                                <label className="blockLabel">
                                                    <p>SGST %</p>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        disabled
                                                        value={addInvoiceItemFormValue.sgst}
                                                    />
                                                </label>
                                            </Col>
                                            <Col xl={2} lg={2}>
                                                <label className="blockLabel">
                                                    <p>IGST %</p>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        disabled
                                                        value={addInvoiceItemFormValue.igst}
                                                    />
                                                </label>
                                            </Col>
                                            <Col xl={2} lg={2}>
                                                <label className="blockLabel">
                                                    <p>Amount</p>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        disabled
                                                        value={addInvoiceItemFormValue.amount}
                                                    />
                                                </label>
                                            </Col>
                                            <Col xl={2} lg={2}>
                                                <label className="blockLabel">
                                                    <p>HSN Code</p>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        disabled
                                                        value={addInvoiceItemFormValue.hsn_code}
                                                    />
                                                </label>
                                            </Col>
                                            <Col xl={2} lg={2}>
                                                <label className="blockLabel">
                                                    <p>&nbsp;</p>
                                                    <a
                                                        className="btn btn-primary btn-sm"
                                                        onClick={(e) =>
                                                            handleAddNewInvoiceData(addInvoiceItemFormValue)
                                                        }>
                                                        <i className="dripicons-plus"></i>
                                                    </a>
                                                </label>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">HSN Code</th>
                                            <th scope="col">Material</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Rate</th>
                                            <th scope="col">CGST</th>
                                            <th scope="col">SGST</th>
                                            <th scope="col">IGST</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userCreatedInvoices &&
                                            userCreatedInvoices.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.hsn_code}</td>
                                                        <td>{item.material_name}</td>
                                                        <td>{item.qty}</td>
                                                        <td>{item.rate}</td>
                                                        <td>{item.cgst}</td>
                                                        <td>{item.sgst}</td>
                                                        <td>{item.igst}</td>
                                                        <td>{item.amount}</td>
                                                        <td>
                                                            <a
                                                                className="btn btn-danger btn-sm"
                                                                onClick={(e) => deleteCreatedInvoiceItem(e, item.id)}>
                                                                <i className="dripicons-trash"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            <Row>
                                <Col xl={6} lg={6}>
                                    <h5 className="mb-3">Associated Trips</h5>
                                    <ul className="trips_list_ul">
                                        {state?.master_order_details?.trip_detail.map((item, index) => {
                                            return (
                                                <li key={index} style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'flex', columnGap: '20px' }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            onClick={(e) => handleAssociatedTrips(e, item)}
                                                        />
                                                        {item.trip_number}{' '}
                                                        <Badge bg="secondary">{getFormattedSate(item.trip_date)}</Badge>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Col>
                                <Col xl={6} lg={6}>
                                    <Row style={{ marginBottom: '5px' }}>
                                        <Col xl={6} lg={6} style={{ textAlign: 'right' }}>
                                            Total
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            <input
                                                type="number"
                                                value={invoceData.total}
                                                disabled
                                                className="form-control"
                                            />
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '5px' }}>
                                        <Col xl={6} lg={6} style={{ textAlign: 'right' }}>
                                            GST
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            <input
                                                type="number"
                                                value={invoceData.gst}
                                                disabled
                                                className="form-control"
                                            />
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '5px' }}>
                                        <Col xl={6} lg={6} style={{ textAlign: 'right' }}>
                                            Payable Amount
                                        </Col>
                                        <Col xl={6} lg={6}>
                                            <input
                                                type="number"
                                                value={invoceData.payable_amount}
                                                disabled
                                                className="form-control"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={12} lg={6}>
                                    <h5 className="mb-3">Other Details</h5>
                                    <textarea
                                        className="form-control"
                                        style={{ minHeight: '100px' }}
                                        value={invoceData.other_details}
                                        onChange={(e) =>
                                            setinvoceData({ ...invoceData, other_details: e.target.value })
                                        }></textarea>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">
                            Generate Invoice
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default InvoiceModal;
