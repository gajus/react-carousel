# react-carousel

[![Travis build status](http://img.shields.io/travis/gajus/react-carousel/master.svg?style=flat-square)](https://travis-ci.org/gajus/react-carousel)
[![NPM version](http://img.shields.io/npm/v/react-carousel.svg?style=flat-square)](https://www.npmjs.com/package/react-carousel)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-brightgreen.svg?style=flat-square)](https://github.com/gajus/canonical)

General purpose carousel component build with and for React.js. Check a [demo here](http://gajus.github.io/react-carousel/)

This component is built for react apps that strictly follow flux (or redux) architecture. It tries to be a pure component in that all its requirements are fed to it as `props` of the component.

#### Impurity

This component is however not fully pure because it uses some state internally. It uses state to store the max-width of its container. There is no way around this. For the behavior required it need to know when its parent's width changes (so it can resize itself accordingly), and it need to re-render. Instead of delegating this operation (like all others) to parent, I've decided to do this internally using state.

## Usage

This component exports es6 module, not es5. So you'll have to make some adjustments in your build system if you're compiling es6 to es5/3.

If you're using webpack, put this in your webpack config:

```js
.
.
    loaders: [
        {
            include: [
                /react-carousel\/src/
            ],
            loader: 'babel',
            test: /\.js$/
        },
.
.
```

Similar setup would need to be done for browserify or other build system you're using.

## Behaviour

- The component does very little by itself. You provide it the input with `props`, and it renders it. To make any changes (like change active item, scroll items), you need to change `props` that you pass to it
  Ideally, you keep state in a (flux/redux) store, and pass that state as props to this component. The callbacks should be used to manipulate the store which shall eventually change the props passed, and re-render the component with new changes

- The component will show scroll buttons (two buttons in front and end of carousel) if number of items in the carousel exceed the total number of items that can be displayed at a time
- Total number if items that can be displayed in the carousel at a time is determined by the width of the container in which this component is kept, and `itemWidth` prop
- Component reacts to change in size of its container such that there is never a partial item dispayed in the carousel. Carousel will shrink in size if the container width can't be filled with  "full" items. Please cehck the example for demonstration of this behavior and try resizing the window
- Previous scroll button is only displayed if there are items before `firstVisibleIndex`
- Next scroll button is only displayed if there are items which can be scrolled left
- `onItemActivate` will be given the `key` of the item that is clicked by the user
- `onItemsScroll` gets called when user clicks on next/previous scroll button. It gives **index** of the item which should become new `firstVisibleIndex`. This index' calculation depends on `scrollStepDistance` and total number of items displayed in the carousel
- Carousel performs no animations as of now during the transition (scroll)

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
git clone git@github.com:gajus/react-carousel.git
cd ./react-carousel/example
npm install
npm run dev
```
