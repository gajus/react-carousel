/* eslint-disable no-unused-vars, lines-around-comment */
import React, {
    /* eslint-enable */
    Component,
    PropTypes
} from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import styles from './carousel.scss';

class Carousel extends Component {
    constructor (props) {
        super(props);

        this.state = {maxWidth: null};
        this.resizeEventListener = _.debounce(() => {
            this.setState({maxWidth: ReactDOM.findDOMNode(this.refs.wrapper).offsetWidth});
        }, 100);
    }

    static propTypes = {
        activeItemId: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
        firstVisibleIndex: PropTypes.number,
        itemWidth: PropTypes.number,
        scrollStepDistance: PropTypes.number,
        itemMargin: PropTypes.number,
        controlWidth: PropTypes.number,
        onItemActivate: PropTypes.func,
        onItemsScroll: PropTypes.func
    }

    static defaultProps = {
        firstVisibleIndex: 0,
        itemWidth: 50,
        scrollStepDistance: 3,
        controlWidth: 30,
        itemMargin: 1
    };

    componentDidMount () {
        this.setState({maxWidth: ReactDOM.findDOMNode(this.refs.wrapper).offsetWidth});
        window.addEventListener('resize', this.resizeEventListener);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.resizeEventListener);
    }

    /**
     * Get the index component should (safely) scroll to
     *
     * @param {Object} options
     * @property {Number} options.totalItems Total number of items being displayed
     * @property {Number} options.currentVisibleIndex Index of item in front
     * @property {String} options.direction next|previous Direction in which to scroll
     * @property {Number} options.visibleItemsCount Number of items displayed at one time in component
     * @property {Number} options.stepDistance Number of items to scroll in one step
     *
     * @returns {Number} Index of item to which to scroll
     */
    getIndexToScrollTo ({totalItems, firstVisibleIndex, direction, visibleItemsCount, scrollStepDistance}) {
        let index,
            itemsBehindVisible,
            itemsBeyondVisible;

        itemsBeyondVisible = totalItems - firstVisibleIndex - visibleItemsCount;
        itemsBehindVisible = firstVisibleIndex;

        if (direction === 'next') {
            index = firstVisibleIndex + (itemsBeyondVisible > scrollStepDistance ? scrollStepDistance : itemsBeyondVisible);
        } else if (direction === 'previous') {
            index = firstVisibleIndex - (itemsBehindVisible > scrollStepDistance ? scrollStepDistance : itemsBehindVisible);
        }

        return index;
    }

    /**
     * Tells if the next button shall be visible or not
     *
     * @param {number} firstVisibleIndex Index of the item to which the carousel is scrolled to
     * @param {number} totalItems Total number of items shown in the carousel
     * @param {number} visibleItemsCount Number Number of items visible at the moment
     * @returns {boolean}
     */
    isNextButtonVisible (firstVisibleIndex, totalItems, visibleItemsCount) {
        return firstVisibleIndex < totalItems - visibleItemsCount;
    }

    /**
     * Tells if the previous control button shall be visible or not
     *
     * @param {number} firstVisibleIndex Index of the item to which the carousel is scrolled to
     * @returns {boolean}
     */
    isPrevButtonVisible (firstVisibleIndex) {
        return firstVisibleIndex > 0;
    }

    /**
     * Get number of items that can be shown at a point in time
     *
     * @param {Object} options Arguments in an object because they are too many
     * @property {number} firstVisibleIndex Index to which the carousel is scrolled to i.e first visible index
     * @property {number} maxWidth Maximum width available to the carousel
     * @property {number} totalItems Total number of items to be shown
     * @property {number} itemWidth Width of each item
     * @property {number} controlWidth Width of each control button
     * @property {number} itemMargin Margin between items
     * @returns {number}
     */
    getVisibleItemsCount ({firstVisibleIndex, maxWidth, totalItems, itemWidth, controlWidth, itemMargin}) {
        let availableWidth,
            calculateVisibleItemsCount,
            nextButtonVisible,
            prevButtonVisible,
            visibleItemsCount;

        /**
         * Get the number of visible items which can be shown at a time
         *
         * @param {number} fullWidth Total available width in which items are to be shown
         * @param {number} elementWidth Width of each individual item to be inserted
         * @param {number} elementMargin Margin between two items
         * @returns {number}
         */
        // Keeping this function inside because
        // a) it's only need to be used internally in this function
        // b) All names I could come up for it can confuse user for this.getVisibleItemsCount
        calculateVisibleItemsCount = (fullWidth, elementWidth, elementMargin) => {
            return Math.floor(fullWidth / (elementWidth + elementMargin) - elementMargin);
        };

        availableWidth = maxWidth;
        prevButtonVisible = this.isPrevButtonVisible(firstVisibleIndex);

        if (prevButtonVisible) {
            availableWidth -= controlWidth + itemMargin;
        }

        visibleItemsCount = calculateVisibleItemsCount(availableWidth, itemWidth, itemMargin);
        nextButtonVisible = this.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

        if (nextButtonVisible) {
            availableWidth -= controlWidth + itemMargin;
            visibleItemsCount = calculateVisibleItemsCount(availableWidth, itemWidth, itemMargin);
        }

        return visibleItemsCount;
    }

    render () {
        // declaring so many variables instead of directly using props to stay consistent with the coding
        // style adopted for other components
        let activeItemId,
            controlWidth,
            firstVisibleIndex,
            getItemJsx,
            itemMargin,
            itemWidth,
            items,
            maxWidth,
            nextButtonVisible,
            prevButtonVisible,
            scrollStepDistance,
            scrollTo,
            totalItems,
            visibleItemIndeces,
            visibleItemsCount;

        maxWidth = this.state.maxWidth;
        items = this.props.items;
        controlWidth = this.props.controlWidth;
        activeItemId = this.props.activeItemId;
        firstVisibleIndex = this.props.firstVisibleIndex;
        itemWidth = this.props.itemWidth;
        scrollStepDistance = this.props.scrollStepDistance;
        itemMargin = this.props.itemMargin;
        totalItems = items.length;
        prevButtonVisible = this.isPrevButtonVisible(firstVisibleIndex);
        visibleItemsCount = this.getVisibleItemsCount({
            firstVisibleIndex,
            maxWidth,
            totalItems,
            itemWidth,
            controlWidth,
            itemMargin
        });
        nextButtonVisible = this.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);
        visibleItemIndeces = _.range(firstVisibleIndex, visibleItemsCount + firstVisibleIndex);

        /**
         * Helper function to avoid typing so many variables twice for two control buttons since most of the variables are already in scope
         *
         * @param {string} direction direction in which to scroll
         * @returns {undefined}
         */
        scrollTo = (direction) => {
            let index;

            index = this.getIndexToScrollTo({
                direction,
                totalItems,
                firstVisibleIndex,
                visibleItemsCount,
                scrollStepDistance
            });

            this.props.onItemsScroll(index);
        };

        /**
         * Creates JSX for one item
         *
         * @param {JSX} item Valid JSX for the item's content
         * @param {number} index Index of item in the items array
         *
         * @returns {JSX}
         */
        getItemJsx = (item, index) => {
            let isVisible;

            isVisible = _.contains(visibleItemIndeces, index);

            /*
             * Here we could return only those items which need be visible, but I am returning all.
             * Since React does optimal DOM operations, rendering all items at once and then updating their
             * style is much less expensive then rendering a set of new list-items everytime.
             */
            return <li
                       styleName={`cell${activeItemId === item.key ? '-active' : ''}`}
                       style={{
                           width: itemWidth,
                           marginRight: itemMargin,
                           display: isVisible ? 'list-item' : 'none'
                       }}
                       key={item.key}
                       onClick={() => this.props.onItemActivate(item.key)}>
                       {item}
            </li>;
        };

        return <div styleName="wrapper" ref="wrapper">
                <ul styleName='carousel'>

                    <li styleName="control-cell-previous"
                        style={{
                            width: controlWidth,
                            marginRight: itemMargin,
                            display: prevButtonVisible ? 'list-item' : 'none'
                        }}
                        onClick={() => scrollTo('previous')}>
                        <span styleName="control-icon-previous"></span>
                    </li>

                    {items.map(getItemJsx)}

                    <li styleName="control-cell-next"
                        style={{
                            width: controlWidth,
                            display: nextButtonVisible ? 'list-item' : 'none'
                        }}
                        onClick={() => scrollTo('next')} >
                        <span styleName="control-icon-next"></span>
                    </li>

                </ul>
        </div>;
    }
}

export default CSSModules(Carousel, styles);
