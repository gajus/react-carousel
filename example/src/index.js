/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider,
    connect
} from 'react-redux';
import Carousel, {
    actions
} from '@applaudience/react-carousel';

let App,
    selector;

selector = (immutableState) => {
    return {

    };
};

class Root extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            visibleIndex: 0,
            activeItemId: '0'
        };
    }

    scrollToIndex (index) {
        this.setState({visibleIndex: index});
    }

    activateItem (id) {
        this.setState({activeItemId: id});
    }

    render () {
        let items,
            carousel;

        carousel = this.state;

        items = _.map([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (num) => {
            return <span
                       style={{marginTop: '20px',
                               fontSize: '32px',
                               display: 'block',
                               width: '100%',
                               textAlign: 'center'}}
                       key={'' + num}
                   >{num}</span>;
        });

        return <div
                   ref="wrapper"
               style={{
                      height: 100,
                      minWidth: 1200,
                      maxWidth: 1500
                      }}>
            <Carousel
                onItemActivate={this.activateItem.bind(this)}
                onItemsScroll={this.scrollToIndex.bind(this)}
                items={items}
                visibleIndex={carousel.visibleIndex}
                activeItemId={carousel.activeItemId}
            />
        </div>;
    }
}

App = Root;

ReactDOM.render(
    <App />
    , document.getElementById('app'));
