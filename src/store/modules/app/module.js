//Module description

import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import Config from '../../../../config.json';

// State schema
const state = {
    config: Config
};

const module = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};

export default module;
