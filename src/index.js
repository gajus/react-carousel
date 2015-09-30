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

        this.state = {maxWidth: null}
    }

    static propTypes = {
        activeItemId: PropTypes.string,
        visibleIndex: PropTypes.number,
        onItemActivate: PropTypes.func,
        onItemsScroll: PropTypes.func,
        items: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    static defaultProps = {
        visibleIndex: 0,
        onItemActivate: () => {}
    }

    componentDidMount () {
        this.setState({maxWidth: ReactDOM.findDOMNode(this.refs.wrapper).offsetWidth});
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

    /**
     * Handle the clicks on nav buttons. Just a wrapper so we won't have to write too long string in jsx
     * @param {Arguments} args Arguments passed as is to this.getIndexToScrollTo
     * @returns {undefined}
     */
    handleItemsScroll (options) {
        let index;

        index = this.getIndexToScrollTo(options);
        this.props.onItemsScroll(index);
    }

    render () {
        let activeItemId,
            cellWidth,
            items,
            displayWindowSize,
            listPosition,
            listWidth,
            maxWidth,
            navButtonWidth,
            nextButtonActive,
            prevButtonActive,
            scrollStepDistance,
            visibleCells,
            visibleIndex;

        maxWidth = this.state.maxWidth;
        navButtonWidth = 30;
        items = this.props.items;
        activeItemId = this.props.activeItemId;
        // actual width + padding. To make this configurable, move the width+padding of cells from css and put them inline using this variable
        cellWidth = 80 + 1;
        visibleIndex = this.props.visibleIndex;
        displayWindowSize = 5;
        scrollStepDistance = 3;

        if (maxWidth) {
            cellWidth = (maxWidth - (navButtonWidth + 1) * 2) / displayWindowSize;
        } else {
            maxWidth = cellWidth * displayWindowSize + navButtonWidth * 2 + 1;
        }

        listPosition = -(cellWidth * visibleIndex);
        prevButtonActive = visibleIndex !== 0;
        nextButtonActive = visibleIndex < items.length - displayWindowSize;

        if (!nextButtonActive) {
            cellWidth += navButtonWidth / displayWindowSize;
            listPosition = -(cellWidth * visibleIndex);
        }
        if (!prevButtonActive) {
            cellWidth += navButtonWidth / displayWindowSize;
            listPosition = -(cellWidth * visibleIndex) - navButtonWidth;
        }

        listWidth = cellWidth * displayWindowSize;
        visibleCells = _.times(displayWindowSize, (num) => visibleIndex + num);

        return <div styleName="wrapper" ref="wrapper">
            <span styleName={`nav-cell-previous${prevButtonActive ? '' : '-inactive'}`}
                  onClick={() => this.handleItemsScroll({
                           totalItems: items.length,
                           direction: 'previous',
                           visibleIndex,
                           displayWindowSize,
                           scrollStepDistance
                           })}>
                <span styleName="nav-icon-previous"></span>
            </span>

            <div styleName='visible-window'>
                <ul styleName='items-list'
                    style={{left: `${listPosition}px`,
                            maxWidth: `${listWidth}px`}}>

                    {items.map((item, index) =>
                        <li
                        styleName={`cell${activeItemId === item.key ? '-active' : ''}`}
                        key={item.key}
                        onClick={() => this.props.onItemActivate(item.key)}
                        style={{left: `${index * cellWidth}px`,
                                width: `${cellWidth - 1}px`,
                                opacity: `${_.contains(visibleCells, index) ? 1 : 0}`,
                                visibility: `${_.contains(visibleCells, index) ? 'visible' : 'hidden'}`,
                                transitionDelay: '0s'}}>

                        <span>{item}</span>
                        </li>
                     )}
                </ul>
            </div>

            <span styleName={`nav-cell-next${nextButtonActive ? '' : '-inactive'}`}
                  onClick={() => this.handleItemsScroll({
                           totalItems: items.length,
                           direction: 'next',
                           visibleIndex,
                           displayWindowSize,
                           scrollStepDistance
                           })}>
                <span styleName="nav-icon-next"></span>
            </span>
        </div>;
    }
}

export default CSSModules(styles)(Carousel);
