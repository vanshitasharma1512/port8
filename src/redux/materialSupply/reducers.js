// @flow
import { MaterialSupplyActionTypes } from './constants';

const INIT_STATE = {};

const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
        case MaterialSupplyActionTypes.TRIP:
            return {
                ...state,
                trip: action.payload,
            };
        case MaterialSupplyActionTypes.VENDOR:
            return {
                ...state,
                vendor: action.payload,
            };
        case MaterialSupplyActionTypes.MASTER_ORDER_DETAILS:
            return {
                ...state,
                master_order_details: action.payload,
            };
        default:
            return state;
    }
};

export default Layout;
