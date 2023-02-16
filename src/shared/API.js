import API from './API-AUTH';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const getProcurementsActivities = (searchInput, statusInput) => {
    return new Promise((resolve, reject) => {
        API.get(`/procurement/bid?status=${statusInput}&search=${searchInput}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export const updateProcurementsActivitiesPo = (id, status) => {
    return new Promise((resolve, reject) => {
        API.put(`/Procurements/activities/po/${id}/status`, { status })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                toast.error(error.data.message);
                reject(error);
            });
    });
};
export const getWorkAcquisitionBidSubmission = (id) => {
    return new Promise((resolve, reject) => {
        API.get(`/procurement/bidsubmission/${id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export const getWorkAcquisitionPODetails = (id) => {
    return new Promise((resolve, reject) => {
        API.get(`/Procurements/activities/workacquisition/po/${id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export const addWorkAcquisitionBidSubmission = (id, payload) => {
    return new Promise((resolve, reject) => {
        API.put(`/Procurement/bid/${id}`, payload)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export const getWorkExecution = (searchInput, statusInput) => {
    return new Promise((resolve, reject) => {
        API.get(`/procurements/activities/po/vendor/underexecution?search=${searchInput}&status=${statusInput}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// UNDER EXECUTION

export const getOrderDetails = (id) => {
    return new Promise((resolve, reject) => {
        //API.get(`procurements/activities/povendor/${id}`)
        API.get(`/materialsupply/podetail/${id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getTripsDelivery = (id, searchInput, statusInput) => {
    return new Promise((resolve, reject) => {
        API.get(`orders/${id}/trips?search=${searchInput}&status=${statusInput}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const createInvoices = (id, data) => {
    return new Promise((resolve, reject) => {
        API.post(`order/${id}/invoices`, data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const createPayment = (id, data) => {
    return new Promise((resolve, reject) => {
        API.post(`orders/${id}/payment`, data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getInvoices = (id, searchInput, statusInput) => {
    return new Promise((resolve, reject) => {
        API.get(`order/${id}/invoices?search=${searchInput}&status=${statusInput}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getPayments = (id, searchInput) => {
    return new Promise((resolve, reject) => {
        API.get(`orders/${id}/payment?search=${searchInput}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const scheduleNewTrip = (id, formData) => {
    return new Promise((resolve, reject) => {
        API.post(`orders/${id}/trips`, formData)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const updateScheduledTrip = (id, trip_id, formData) => {
    return new Promise((resolve, reject) => {
        API.put(`orders/${id}/trips/${trip_id}`, formData)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getDriversList = () => {
    return new Promise((resolve, reject) => {
        API.get(`/user/driverlist`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getTruckList = () => {
    return new Promise((resolve, reject) => {
        API.get(`/truck/list`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const uploadFile = (formData) => {
    return new Promise((resolve, reject) => {
        API.post(`/uploads`, formData)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getTripDetails = (pi_id, trip_id) => {
    return new Promise((resolve, reject) => {
        API.get(`/orders/${pi_id}/trips/${trip_id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getVendorDetails = (vendor_id) => {
    return new Promise((resolve, reject) => {
        API.get(`/client/${vendor_id}/profile`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getTrackingData = (id) => {
    return new Promise((resolve, reject) => {
        API.get(`/trips/${id}/track`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getCompletedData = () => {
    return new Promise((resolve, reject) => {
        API.get(`/Procurements/activities/po/vendor/completed`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getInvoiceDetailsForDownload = (po_id, invoice_id) => {
    return new Promise((resolve, reject) => {
        API.get(`order/${po_id}/invoices/${invoice_id}`)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
