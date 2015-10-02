# react-carousel

General purpose carousel component

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
 * @typedef Carousel~onItemsScroll
 * @property {Number} index Index to scroll to
 */

/**
 * @property {Carousel~activeItemId} string - Key prop of the item which is to be marked as active
 * @property {Carousel~items[]} JSX - Array of JSX components which are to be set as content of carousel items
 * @property {Carousel~firstVisibleIndex} number - Index to which the crousel is scrolled to. i.e the first index which is visible
 * @property {Carousel~itemWidth} number - Width of each item in the carousel
 * @property {Carousel~scrollStepDistance} number - Number of items to scroll at one time
 * @property {Carousel~itemMargin} number - Margin between two items in the carousel
 * @property {Carousel~controlWidth} number - Width of control buttons
 * @property {Carousel~onItemActivate} function - Called when user clicks on an item
 * @property {Carousel~onItemsScroll} function - Called when user clicks on control buttons
 */
```

## Example

```sh
git clone git@github.com:applaudience/react-carousel.git
cd ./react-carousel/example
npm install
npm start
```

### Developing Example

For making changes in the component and checking them in development, you can run the example in dev mode. Dev mode assume you have exactly same directory structure for `example` and `src` directories's location as this repo. In dev mode, we add the component as an alias in webpack which allow us to check the changes instantaneously.

```sh
git clone git@github.com:applaudience/react-carousel.git
cd ./react-carousel/example
npm install
npm run dev
```
