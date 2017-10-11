const actions = {
    setUser: (context, value) => {
        context.commit('SET_CURRENT_USER', value);
    }
};

export default actions;
