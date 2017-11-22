# react-carousel

[![Travis build status](http://img.shields.io/travis/gajus/react-carousel/master.svg?style=flat-square)](https://travis-ci.org/gajus/react-carousel)
[![NPM version](http://img.shields.io/npm/v/react-carousel.svg?style=flat-square)](https://www.npmjs.org/package/react-carousel)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

A carousel.

## Markup

```css
.react-carousel
  .react-carousel__navigation-button .react-carousel__navigation-button--previous
  ul
    li
  .react-carousel__navigation-button .react-carousel__navigation-button--next

```

## Usage

> Refer to [demo](#demo) for a complete setup.

```js
<Carousel
  controlWidth={50}
  itemWidth={240}
  itemMargin={20}
>
  <div>foo</div>
  <div>bar</div>
  <div>baz</div>
</Carousel>
```

## Demo

```bash
git clone https://github.com/gajus/react-carousel.git
cd ./react-carousel/demo
npm install
npm start
```

## Behaviour

  * The component does very little by itself. You provide it the input with `props`, and it renders it. To make any changes (like change active item, scroll items), you need to change `props` that you pass to it

    Ideally, you keep state in a (redux) store, and pass that state as props to this component. The callbacks are used to manipulate the store which shall eventually change the props passed, and render the component.

  * The component will show scroll buttons (two buttons; one in front of the carousel and one at the end) if number of items in the carousel exceed the total number of items that can be displayed without overflowing the contents.
  * The total number of items that can be displayed in the carousel is determined using the width of the component container, the `itemWidth` property value and `itemMargin` property value.
  * The carousel shrinks if the container width can't be filled with items.
  * `onItemActivate` will be given the `key` of the item that is clicked by the user.
  * `onItemScroll` gets called when user clicks on next/ previous scroll button. It gives index of the new `firstVisibleIndex` item.

## Properties

```js

/**
 * Called when user clicks on an item.
 *
 * @typedef Carousel~onItemActivate
 * @property {String} Key prop of the item
 */

/**
 * Called when user clicks on buttons to scroll items (next or previous)
 *
 * @typedef Carousel~onItemScroll
 * @property {Number} index Index to scroll to
 */

/**
 * @property {Carousel~controlWidth} Width of the carousel navigation button.
 * @property {Carousel~firstVisibleIndex} Index to which the carousel is scrolled to (i.e the first index which is visible.) (default: `0`).
 * @property {Carousel~itemMargin} Margin between two items in the carousel.
 * @property {Carousel~itemWidth} Width of an item.
 * @property {Carousel~onItemActivate} Called when user clicks on an item.
 * @property {Carousel~onItemScroll} Called when user clicks on control buttons.
 * @property {Carousel~scrollStepDistance} Number of items to scroll at one time (default: the current visible item count).
 */
```
