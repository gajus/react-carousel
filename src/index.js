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
        displayWindowSize: PropTypes.number,
        scrollStepDistance: PropTypes.number,
        itemMargin: PropTypes.number,
        controlButtonWidth: PropTypes.number,
        onItemActivate: PropTypes.func,
        onItemsScroll: PropTypes.func
    }

    static defaultProps = {
        visibleIndex: 0,
        displayWindowSize: 5,
        scrollStepDistance: 3,
        controlButtonWidth: 30,
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
     * @property {Number} options.displayWindowSize Number of items displayed at one time in component
     * @property {Number} options.stepDistance Number of items to scroll in one step
     *
     * @returns {Number} Index of item to which to scroll
     */
    getIndexToScrollTo ({totalItems, visibleIndex, direction, displayWindowSize, scrollStepDistance}) {
        let index,
            itemsBehindVisible,
            itemsBeyondVisible;

        itemsBeyondVisible = totalItems - visibleIndex - displayWindowSize;
        itemsBehindVisible = visibleIndex;

        if (direction === 'next') {
            index = visibleIndex + (itemsBeyondVisible > scrollStepDistance ? scrollStepDistance : itemsBeyondVisible);
        } else if (direction === 'previous') {
            index = visibleIndex - (itemsBehindVisible > scrollStepDistance ? scrollStepDistance : itemsBehindVisible);
        }

        return index;
    }

    getMeasurements ({maxWidth, controlButtonWidth, totalItems, displayWindowSize, itemMargin, visibleIndex}) {
        let cellWidth,
            listPosition,
            listWidth,
            nextButtonActive,
            prevButtonActive,
            visibleCellIdeces;

        cellWidth = (maxWidth - (controlButtonWidth + itemMargin) * 2) / displayWindowSize;
        listPosition = -(cellWidth * visibleIndex);

        prevButtonActive = visibleIndex !== 0;
        nextButtonActive = visibleIndex < totalItems - displayWindowSize;

        if (!nextButtonActive) {
            cellWidth += controlButtonWidth / displayWindowSize;
            listPosition = -(cellWidth * visibleIndex);
        }
        if (!prevButtonActive) {
            cellWidth += controlButtonWidth / displayWindowSize;
            listPosition = -(cellWidth * visibleIndex) - controlButtonWidth;
        }

        listWidth = cellWidth * displayWindowSize;
        visibleCellIdeces = _.times(displayWindowSize, (num) => visibleIndex + num);

        return {
            cellWidth,
            listPosition,
            prevButtonActive,
            nextButtonActive,
            listWidth,
            visibleCellIdeces
        };
    }

    render () {
        let activeItemId,
            controlButtonWidth,
            displayWindowSize,
            getItem,
            itemMargin,
            items,
            maxWidth,
            scrollStepDistance,
            scrollTo,
            totalItems,
            visibleIndex;

        maxWidth = this.state.maxWidth;
        items = this.props.items;
        controlButtonWidth = this.props.controlButtonWidth;
        activeItemId = this.props.activeItemId;
        visibleIndex = this.props.visibleIndex;
        displayWindowSize = this.props.displayWindowSize;
        scrollStepDistance = this.props.scrollStepDistance;
        itemMargin = this.props.itemMargin;
        totalItems = items.length;

        /* eslint-disable one-var,lines-around-comment */
        let {
            cellWidth,
            listPosition,
            prevButtonActive,
            nextButtonActive,
            listWidth,
            visibleCellIdeces
        } = this.getMeasurements({
            maxWidth,
            controlButtonWidth,
            totalItems,
            displayWindowSize,
            itemMargin,
            visibleIndex
        });
        /* eslint-enable */

        scrollTo = (direction) => {
            let index;

            index = this.getIndexToScrollTo({
                direction,
                totalItems,
                visibleIndex,
                displayWindowSize,
                scrollStepDistance
            });

            this.props.onItemsScroll(index);
        };

        getItem = (item, index) => {
            let isVisible,
                positionLeft,
                width;

            isVisible = _.contains(visibleCellIdeces, index);
            width = cellWidth - itemMargin;
            positionLeft = index * cellWidth + itemMargin;

            return <li
                       styleName={`cell${activeItemId === item.key ? '-active' : ''}`}
                       key={item.key}
                       onClick={() => this.props.onItemActivate(item.key)}
                       style= {{left: `${positionLeft}px`,
                          width: `${width}px`,
                          opacity: `${isVisible ? 1 : 0}`,
                          visibility: `${isVisible ? 'visible' : 'hidden'}`,
                          transitionDelay: '0s'
                        }}>
                        <span>{item}</span>
            </li>;
        };

        return <div styleName="wrapper" ref="wrapper">
                <span styleName={`control-cell-previous${prevButtonActive ? '' : '-inactive'}`}
                      onClick={() => scrollTo('previous')}>
                    <span styleName="control-icon-previous"></span>
                </span>

                <div styleName='visible-window'>
                    <ul styleName='items-list'
                        style={{left: `${listPosition}px`,
                                maxWidth: `${listWidth}px`}}>
                        {items.map(getItem)}
                    </ul>
                </div>

                <span styleName={`control-cell-next${nextButtonActive ? '' : '-inactive'}`}
                      onClick={() => scrollTo('next')}>
                    <span styleName="control-icon-next"></span>
                </span>
        </div>;
    }
}

export default CSSModules(styles)(Carousel);
