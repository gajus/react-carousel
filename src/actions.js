let activateItem,
    scrollToIndex;

/**
 * Sends action to mark `date` as activeDate in state
 * @param {Object} item Item object with id property
 * @returns {object} action
 */
activateItem = (item) => {
    return {
        name: 'CAROUSEL_ACTIVATE_ITEM',
        data: {
            id: item.key
        }
    };
};

/**
 * Sends action to mark `index` as visibleIndex in state
 * @param {number} index
 * @returns {object} action
 */
scrollToIndex = (index) => {
    return {
        name: 'CAROUSEL_SCROLL_TO_INDEX',
        data: {
            index
        }
    };
};

export default {
    activateItem,
    scrollToIndex
};
