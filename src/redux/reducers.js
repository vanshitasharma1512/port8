// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import MaterialSupply from './materialSupply/reducers'

export default (combineReducers({
    Auth,
    Layout,
    MaterialSupply
}): any);
