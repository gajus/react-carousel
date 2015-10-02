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
        visibleIndex: PropTypes.number,
        itemWidth: PropTypes.number,
        scrollStepDistance: PropTypes.number,
        itemMargin: PropTypes.number,
        controlWidth: PropTypes.number,
        onItemActivate: PropTypes.func,
        onItemsScroll: PropTypes.func
    }

    static defaultProps = {
        visibleIndex: 0,
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
    getIndexToScrollTo ({totalItems, visibleIndex, direction, visibleItemsCount, scrollStepDistance}) {
        let index,
            itemsBehindVisible,
            itemsBeyondVisible;

        itemsBeyondVisible = totalItems - visibleIndex - visibleItemsCount;
        itemsBehindVisible = visibleIndex;

        if (direction === 'next') {
            index = visibleIndex + (itemsBeyondVisible > scrollStepDistance ? scrollStepDistance : itemsBeyondVisible);
        } else if (direction === 'previous') {
            index = visibleIndex - (itemsBehindVisible > scrollStepDistance ? scrollStepDistance : itemsBehindVisible);
        }

        console.log('New Scroll Position', index);
        return index;
    }

    /**
     * Get the number of visible items which can be shown at a time
     *
     * @param {number} availableWidth Total available width in which items are to be shown
     * @param {number} itemWidth Width of each individual item to be inserted
     * @param {number} itemMargin Margin between two items
     * @returns {}
     */
    getVisibleItemsCount (availableWidth, itemWidth, itemMargin) {
        return Math.floor(availableWidth / (itemWidth + itemMargin) - itemMargin);
    }

    getMeasurements ({visibleIndex, maxWidth, totalItems, itemWidth, controlWidth, itemMargin}) {
        let availableWidth,
            nextButtonVisible,
            prevButtonVisible,
            visibleItemIndeces,
            visibleItemsCount;

        availableWidth = maxWidth;
        prevButtonVisible = visibleIndex > 0;

        if (prevButtonVisible) {
            availableWidth -= controlWidth + itemMargin;
        }

        visibleItemsCount = this.getVisibleItemsCount(availableWidth, itemWidth, itemMargin);

        nextButtonVisible = visibleIndex < totalItems - visibleItemsCount;

        if (nextButtonVisible) {
            availableWidth -= controlWidth + itemMargin;
            visibleItemsCount = this.getVisibleItemsCount(availableWidth, itemWidth, itemMargin);
        }

        visibleItemIndeces = _.range(visibleIndex, visibleItemsCount + visibleIndex);

        return {
            nextButtonVisible,
            prevButtonVisible,
            visibleItemsCount,
            visibleItemIndeces
        };
    }

    render () {
        let activeItemId,
            controlWidth,
            getItemJsx,
            itemMargin,
            itemWidth,
            items,
            maxWidth,
            scrollStepDistance,
            scrollTo,
            totalItems,
            visibleIndex;

        maxWidth = this.state.maxWidth;
        items = this.props.items;
        controlWidth = this.props.controlWidth;
        activeItemId = this.props.activeItemId;
        visibleIndex = this.props.visibleIndex;
        itemWidth = this.props.itemWidth;
        scrollStepDistance = this.props.scrollStepDistance;
        itemMargin = this.props.itemMargin;
        totalItems = items.length;

        /* eslint-disable one-var,lines-around-comment */
        let {
            nextButtonVisible,
            prevButtonVisible,
            visibleItemsCount,
            visibleItemIndeces
        } = this.getMeasurements({
            visibleIndex,
            maxWidth,
            totalItems,
            itemWidth,
            controlWidth,
            itemMargin
        });
        /* eslint-enable */

        scrollTo = (direction) => {
            let index;

            index = this.getIndexToScrollTo({
                direction,
                totalItems,
                visibleIndex,
                visibleItemsCount,
                scrollStepDistance
            });

            this.props.onItemsScroll(index);
        };

        getItemJsx = (item, index) => {
            let isVisible;

            isVisible = _.contains(visibleItemIndeces, index);

            return <li
            styleName={`cell${activeItemId === item.key ? '-active' : ''}`}
            style={{
                width: itemWidth,
                marginRight: itemMargin,
                display: isVisible ? 'list-item' : 'none'
            }}
            key={item.key}
            onClick={() => this.props.onItemActivate(item.key)}>
                <span>{item}</span>
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
