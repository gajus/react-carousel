/* eslint-disable valid-jsdoc, jsdoc/require-description-complete-sentence, jsdoc/require-param, jsdoc/check-param-names */

import React, {
    Component,
    PropTypes
} from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';

/* eslint-disable react/no-set-state, react/no-did-mount-set-state */
class Carousel extends Component {
    static propTypes = {
        activeItemId: PropTypes.string,
        controlWidth: PropTypes.number,
        firstVisibleIndex: PropTypes.number,
        itemMargin: PropTypes.number,
        itemWidth: PropTypes.number,
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
        onItemActivate: PropTypes.func,
        onItemsScroll: PropTypes.func,
        scrollStepDistance: PropTypes.number
    };

    static defaultProps = {
        controlWidth: 30,
        firstVisibleIndex: 0,
        itemMargin: 1,
        itemWidth: 50,
        scrollStepDistance: 3
    };

    constructor (props) {
        super(props);

        this.state = {maxWidth: null};
        this.resizeEventListener = _.debounce(() => {
            this.setState({maxWidth: ReactDOM.findDOMNode(this.refs.wrapper).offsetWidth});
        }, 100);
    }

    componentDidMount () {
        this.setState({maxWidth: ReactDOM.findDOMNode(this.refs.wrapper).offsetWidth});
        window.addEventListener('resize', this.resizeEventListener);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.resizeEventListener);
    }

    /**
     * Get the index component should safely scroll to.
     *
     * @param {Object} options
     * @param {number} options.totalItems Total number of items being displayed
     * @param {number} options.currentVisibleIndex Index of item in front
     * @param {string} options.direction next|previous Direction in which to scroll
     * @param {number} options.visibleItemsCount Number of items displayed at one time in component
     * @param {number} options.stepDistance Number of items to scroll in one step
     *
     * @returns {number} Index of item to which to scroll
     */
    getIndexToScrollTo = ({totalItems, firstVisibleIndex, direction, visibleItemsCount, scrollStepDistance}) => {
        let index;

        const itemsBeyondVisible = totalItems - firstVisibleIndex - visibleItemsCount;
        const itemsBehindVisible = firstVisibleIndex;

        if (direction === 'next') {
            index = firstVisibleIndex + (itemsBeyondVisible > scrollStepDistance ? scrollStepDistance : itemsBeyondVisible);
        } else if (direction === 'previous') {
            index = firstVisibleIndex - (itemsBehindVisible > scrollStepDistance ? scrollStepDistance : itemsBehindVisible);
        }

        return index;
    };

    // Tells if the next button shall be visible or not.
    isNextButtonVisible = (firstVisibleIndex: number, totalItems: number, visibleItemsCount: number) : boolean => {
        return firstVisibleIndex < totalItems - visibleItemsCount;
    };

    /**
     * Tells if the previous control button shall be visible or not.
     */
    isPrevButtonVisible = (firstVisibleIndex: number) : boolean => {
        return firstVisibleIndex > 0;
    };

    /**
     * Get number of items that can be shown at a point in time.
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
    getVisibleItemsCount = ({firstVisibleIndex, maxWidth, totalItems, itemWidth, controlWidth, itemMargin}) => {
        let availableWidth,
            visibleItemsCount;

        /**
         * Get the number of visible items which can be shown at a time.
         *
         * @param {number} fullWidth Total available width in which items are to be shown
         * @param {number} elementWidth Width of each individual item to be inserted
         * @param {number} elementMargin Margin between two items
         * @returns {number}
         */
        // Keeping this function inside because
        // a) it's only need to be used internally in this function
        // b) All names I could come up for it can confuse user for this.getVisibleItemsCount
        const calculateVisibleItemsCount = (fullWidth, elementWidth, elementMargin) => {
            return Math.floor(fullWidth / (elementWidth + elementMargin));
        };

        availableWidth = maxWidth;
        const prevButtonVisible = this.isPrevButtonVisible(firstVisibleIndex);

        if (prevButtonVisible) {
            availableWidth -= controlWidth + itemMargin;
        }

        visibleItemsCount = calculateVisibleItemsCount(availableWidth, itemWidth, itemMargin);
        const nextButtonVisible = this.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

        if (nextButtonVisible) {
            availableWidth -= controlWidth + itemMargin;
            visibleItemsCount = calculateVisibleItemsCount(availableWidth, itemWidth, itemMargin);
        }

        return visibleItemsCount;
    };

    /**
     * Helper function to avoid typing so many variables twice for two control buttons since most of the variables are already in scope.
     *
     * @param {string} direction direction in which to scroll
     * @param {number} visibleItemsCount Total number of visible items
     * @returns {undefined}
     */
    handleScrollToDirection = (direction: string, visibleItemsCount: number) => {
        return () => {
            const index = this.getIndexToScrollTo({
                direction,
                firstVisibleIndex: this.props.firstVisibleIndex,
                scrollStepDistance: this.props.scrollStepDistance,
                totalItems: this.props.items.length,
                visibleItemsCount
            });

            this.props.onItemsScroll(index);
        };
    };

    handleActivateItem = (item) => {
        this.props.onItemActivate(item.key);
    };

    /**
     * Creates functoin that creates JSX for one item
     *
     * @param {number} visibleItemsCount Total number of visible items
     *
     * @returns {Function}
     */
    getItemJsx = (visibleItemsCount: number) => {
            /**
             * Creates JSX for one item
             *
             * @param {JSX} item Valid JSX for the item's content
             * @param {number} index Index of item in the items array
             * @param {number} visibleItemsCount Total number of visible items
             *
             * @returns {JSX}
             */
        return (item, index) => {
            const self = this;
            const visibleItemIndeces = _.range(this.props.firstVisibleIndex, visibleItemsCount + this.props.firstVisibleIndex);
            const isVisible = _.includes(visibleItemIndeces, index);

            /*
             * Here we could return only those items which need be visible, but I am returning all.
             * Since React does optimal DOM operations, rendering all items at once and then updating their
             * style is much less expensive then rendering a set of new list-items everytime.
             */
            return <li
                className={'react-carousel__cell' + (this.props.activeItemId === item.key ? ' react-carousel__cell--active' : '')}
                key={item.key}
                onClick={function () {
                    self.handleActivateItem(item);
                }}
                style={{
                    display: isVisible ? 'list-item' : 'none',
                    marginRight: this.props.itemMargin,
                    width: this.props.itemWidth
                }}
                   >
            {item}
            </li>;
        };
    };

    render () {
        // declaring so many variables instead of directly using props to stay consistent with the coding
        // style adopted for other components
        const maxWidth = this.state.maxWidth;
        const items = this.props.items;
        const controlWidth = this.props.controlWidth;
        const firstVisibleIndex = this.props.firstVisibleIndex;
        const itemWidth = this.props.itemWidth;
        const itemMargin = this.props.itemMargin;
        const totalItems = items.length;
        const prevButtonVisible = this.isPrevButtonVisible(firstVisibleIndex);
        const visibleItemsCount = this.getVisibleItemsCount({
            controlWidth,
            firstVisibleIndex,
            itemMargin,
            itemWidth,
            maxWidth,
            totalItems
        });
        const nextButtonVisible = this.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

        return <div className='react-carousel' ref='wrapper'>
            <ul className='clearfix react-carousel__body'>

                <li
                    className='react-carousel__control-cell carousel__control-cell--previous clearfix'
                    onClick={this.handleScrollToDirection('previous', visibleItemsCount)}
                    style={{
                        display: prevButtonVisible ? 'list-item' : 'none',
                        marginRight: itemMargin,
                        width: controlWidth
                    }}
                >
                    <span className='react-carousel__control-cell__icon--previous'></span>
                </li>

                {_.map(items, this.getItemJsx(visibleItemsCount))}

                <li
                    className='react-carousel__control-cell react-carousel__control-cell--next clearfix'
                    onClick={this.handleScrollToDirection('next', visibleItemsCount)}
                    style={{
                        display: nextButtonVisible ? 'list-item' : 'none',
                        width: controlWidth
                    }}
                >
                    <span className='react-carousel__control-cell__icon--next'></span>
                </li>

            </ul>
        </div>;
    }
}

export default Carousel;
