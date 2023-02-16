import { MaterialSupplyActionTypes } from './constants';

export const changeTrip = (payload) => ({
    type: MaterialSupplyActionTypes.TRIP,
    payload: payload,
});
export const changeVendorDetails = (payload) => ({
    type: MaterialSupplyActionTypes.VENDOR,
    payload: payload,
});
export const setMasterOrderDetails = (payload) => ({
    type: MaterialSupplyActionTypes.MASTER_ORDER_DETAILS,
    payload: payload,
});
