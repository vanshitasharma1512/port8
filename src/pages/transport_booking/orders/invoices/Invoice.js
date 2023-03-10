import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageTitle from '../../../../components/PageTitle'
import Table from '../../../../components/Table'
import { invoiceList } from './InvoiceData'
import classNames from 'classnames'
import { order_invoice_delete, order_invoice_list } from '../../../../helpers'
import { toast } from 'react-toastify';
import moment from 'moment-timezone'

const TransportBookingsInvoice = ({ orderid }) => {
    const [invoiceList, setInvoiceList] = useState([])
    const rightButtonObj = { link: "invoice-add", title: "Add Invoice" }
    const [isLoading, setIsLoading] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [invoiceId, setInvoiceId] = useState(0)


    const toggleDelete = () => {
        setModalDelete(!modalDelete);
    };

    /*
     Opens modal with custom class
    */
    const openModalDeleteModal = (invoiceid) => {
        setInvoiceId(invoiceid);
        toggleDelete();
    }

    /* ------------------- Column Render ------------------*/
    const StatusColumn = ({ row }) => {
        return (
            <>
                <span
                    className={`badge ${row.original.invoice_status ? 'bg-success' : 'bg-danger'}`}>
                    {row.original.invoice_status ? "Paid" : "Unpaid"}
                </span>
            </>
        );
    };
    const ActionColumn = ({ row }) => {
        return (
            <>
                <Link to={`invoice-view/` + row.original.id} className="action-icon">
                    {' '}
                    <i className="mdi mdi-eye"></i>
                </Link>
                <Link to={`invoice-edit/` + row.original.id} className="action-icon">
                    {' '}
                    <i className="mdi mdi-square-edit-outline"></i>
                </Link>
                <Button variant='default' onClick={() => openModalDeleteModal(row.original.id)} className="action-icon">
                    {' '}
                    <i className="mdi mdi-delete"></i>
                </Button>

            </>
        );
    };
    const DownloadColumn = ({ row }) => {
        return (
            <>
                {row.original.invoice_pdf &&
                    <Button variant='default'>
                        <i className="uil uil-arrow-to-bottom">{row.original.invoice_pdf}</i>
                    </Button>
                }
            </>
        );
    };
    const InvoiceDateColumn = ({ row }) => {
        return (
            <>
                {row.original.invoice_date &&
                    <Button variant='default'>
                        {row.original.invoice_date && moment(new Date(row.original.invoice_date)).format("D MMM YYYY")}
                    </Button>
                }
            </>
        );
    };

    // get all columns
    const columns = [
        {
            Header: 'Invoice No.',
            accessor: 'id',
            sort: true
        },
        {
            Header: 'Invoice Date',
            accessor: 'invoice_date',
            sort: true,
            Cell: InvoiceDateColumn
        },
        {
            Header: 'Invoice Amount',
            accessor: 'payable_amount',
            sort: true
        },
        {
            Header: 'Details',
            accessor: 'other_detail',
            sort: true
        },
        {
            Header: 'Status',
            accessor: 'invoice_status',
            sort: false,
            classes: 'table-action',
            Cell: StatusColumn
        },
        {
            Header: 'Download',
            sort: false,
            classes: 'table-action',
            Cell: DownloadColumn
        },
        {
            Header: 'Action',
            accessor: 'action',
            sort: false,
            classes: 'table-action',
            Cell: ActionColumn
        },
    ];


    // get pagelist to display
    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '20',
            value: 20,
        },
        {
            text: 'All',
            value: invoiceList.length,
        },
    ];


    // order_invoice_list
    const loadInvoiceList = () => {
        setIsLoading(true)
        const fetchApi = order_invoice_list(orderid);
        fetchApi.then(result => {
            const dataResult = result.data.data.result
            if (dataResult) {
                setIsLoading(false)
                setInvoiceList(dataResult);
            } else {
                setIsLoading(false)
                setInvoiceList([]);
            }
        }).catch(error => {
            setIsLoading(false)
            setInvoiceList([]);
            return toast.error(error);
        })
    }

    useEffect(() => {
        loadInvoiceList();
    }, [])
    
    const deleteInvoiceFunc = (id) => {
        order_invoice_delete(orderid, id).then(res => {
            if (res !== undefined) {
                toast.success("Invoice successfully deleted")
                toggleDelete()
                loadInvoiceList()
            }
        }).catch(e => {
            toast.error(e)
        })
    }
    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Table
                                rightButton={rightButtonObj}
                                columns={columns}
                                isLoading={isLoading}
                                data={invoiceList}
                                pageSize={5}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                theadClass="table-light"
                                searchBoxClass="mb-2"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={modalDelete} onHide={toggleDelete}>
                <Modal.Header
                    onHide={toggleDelete}
                    closeButton
                    className={classNames('modal-colored-header', 'bg-danger')}>
                    <h4 className="modal-title text-light">Delete Invoice</h4>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="mt-0">Are you sure want to delete Invoice</h5>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={toggleDelete}>
                        Cancel
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteInvoiceFunc(invoiceId)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default TransportBookingsInvoice;