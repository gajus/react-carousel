let CAROUSEL_ACTIVATE_ITEM,
    CAROUSEL_SCROLL_TO_INDEX;

CAROUSEL_ACTIVATE_ITEM = (state, action) => {
    return state
        .set('activeItemId', action.data.id);
};

CAROUSEL_SCROLL_TO_INDEX = (state, action) => {
    return state
        .set('visibleIndex', action.data.index);
};

export default {
    CAROUSEL_ACTIVATE_ITEM,
    CAROUSEL_SCROLL_TO_INDEX
};
