// @flow

import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  range
} from 'range';
import debounce from 'debounce';

type DirectionType = 'previous' | 'next';

type StateType = {
  maxWidth: number | null
};

/**
 * Calculates the maximum number of items that can fit the container
 * without overflowing.
 */
export const getMaximumAccomodableItemCount = (fullWidth: number, elementWidth: number, elementMargin: number): number => {
  return Math.floor(fullWidth / (elementWidth + elementMargin));
};

export const isPrevButtonVisible = (firstVisibleIndex: number): boolean => {
  return firstVisibleIndex > 0;
};

export const isNextButtonVisible = (totalItems: number, firstVisibleIndex: number, visibleItemsCount: number): boolean => {
  return firstVisibleIndex < totalItems - visibleItemsCount;
};

export const getIndexToScrollTo = (
  direction: DirectionType,
  totalItems: number,
  visibleItemsCount: number,
  firstVisibleIndex: number,
  scrollStepDistance: number
) => {
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

export const getVisibleItemsCount = (
  totalItems: number,
  firstVisibleIndex: number,
  itemWidth: number,
  itemMargin: number,
  controlWidth: number,
  maxWidth: number
) => {
  let availableWidth;
  let visibleItemsCount;

  availableWidth = maxWidth;

  const prevButtonVisible = isPrevButtonVisible(firstVisibleIndex);

  if (prevButtonVisible) {
    availableWidth -= controlWidth + itemMargin;
  }

  visibleItemsCount = getMaximumAccomodableItemCount(availableWidth, itemWidth, itemMargin);

  const nextButtonVisible = isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

  if (nextButtonVisible) {
    availableWidth -= controlWidth + itemMargin;

    visibleItemsCount = getMaximumAccomodableItemCount(availableWidth, itemWidth, itemMargin);
  }

  return visibleItemsCount;
};

class Carousel extends Component {
  resizeEventListener: () => void;
  wrapperElement: HTMLElement;
  state: StateType;

  static propTypes = {
    controlWidth: PropTypes.number,
    firstVisibleIndex: PropTypes.number,
    itemMargin: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    itemWidth: PropTypes.number,
    onItemScroll: PropTypes.func,
    scrollStepDistance: PropTypes.number
  };

  static defaultProps = {
    controlWidth: 30,
    firstVisibleIndex: 0,
    itemMargin: 1,
    itemWidth: 50,
    onItemScroll: () => {},
    scrollStepDistance: 3
  };

  constructor (props: Object) {
    super(props);

    this.state = {
      maxWidth: null
    };

    this.resizeEventListener = debounce(() => {
      this.setState({
        maxWidth: this.wrapperElement.offsetWidth
      });
    }, 100);
  }

  componentDidMount () {
    if (!this.wrapperElement) {
      throw new Error('Unexpected state.');
    }

    const maxWidth = this.wrapperElement.offsetWidth;

    this.setState({
      maxWidth
    });

    window.addEventListener('resize', this.resizeEventListener);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeEventListener);
  }

  handleScrollToDirection = (direction: DirectionType, visibleItemsCount: number): () => void => {
    const index = getIndexToScrollTo(
      direction,
      this.props.items.length,
      visibleItemsCount,
      this.props.firstVisibleIndex,
      this.props.scrollStepDistance
    );

    this.props.onItemScroll(index);
  };

  getItemElement = (item: React$Element<any>, index: number, visibleItemsCount: number): React$Element<any> => {
    const visibleItemIndeces = range(this.props.firstVisibleIndex, visibleItemsCount + this.props.firstVisibleIndex);
    const isVisible = visibleItemIndeces.includes(index);

    return <li
      key={item.key}
      style={{
        boxSizing: 'border-box',
        display: isVisible ? 'list-item' : 'none',
        listStyleType: 'none',
        marginRight: this.props.itemMargin,
        width: this.props.itemWidth
      }}
    >
      {item}
    </li>;
  };

  render () {
    const {
      controlWidth,
      firstVisibleIndex,
      itemMargin,
      items,
      itemWidth,
      maxWidth
    } = this.props;
    const itemCount = items.length;
    const visibleItemsCount = getVisibleItemsCount(itemCount, firstVisibleIndex, itemWidth, itemMargin, controlWidth, maxWidth);
    const prevButtonVisible = isPrevButtonVisible(firstVisibleIndex);
    const nextButtonVisible = isNextButtonVisible(itemCount, firstVisibleIndex, visibleItemsCount);

    const carouselStyle = {
      boxSizing: 'border-box',
      display: 'flex',
      flexFlow: 'row wrap'
    };

    const navigationButtonStyle = {
      boxSizing: 'border-box',
      margin: 0,
      marginRight: itemMargin,
      padding: 0,
      width: controlWidth
    };

    const navigationButtonPreviousStyle = {
      ...navigationButtonStyle,
      display: prevButtonVisible ? 'flex' : 'none'
    };

    const navigationButtonNextStyle = {
      ...navigationButtonStyle,
      display: nextButtonVisible ? 'flex' : 'none'
    };

    const bodyStyle = {
      display: 'flex',
      flexFlow: 'row wrap',
      margin: 0,
      padding: 0
    };

    return <div
      className='react-carousel'
      ref={(element) => {
        this.wrapperElement = element;
      }}
      style={carouselStyle}
    >
      <div
        className='react-carousel__navigation-button react-carousel__navigation-button--previous'
        onClick={this.handleScrollToDirection.bind(this, 'previous', visibleItemsCount)}
        style={navigationButtonPreviousStyle}
      />
      <ul style={bodyStyle}>
        {items.map((item, index) => {
          return this.getItemElement(item, index, visibleItemsCount);
        })}
      </ul>
      <div
        className='react-carousel__navigation-button react-carousel__navigation-button--next'
        onClick={this.handleScrollToDirection.bind(this, 'next', visibleItemsCount)}
        style={navigationButtonNextStyle}
      />
    </div>;
  }
}

export default Carousel;
