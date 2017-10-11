const mutations = {
    SET_CURRENT_USER: (state, payload) => {
        state.user = payload.user;
    }
};

export default mutations;
