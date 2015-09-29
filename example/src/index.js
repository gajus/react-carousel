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
import store from './store.js';

let App,
    selector;

selector = (immutableState) => {
    return {
        carousel: immutableState.get('carousel').toJS()
    };
};

class Root extends React.Component {
    render () {
        let items;
        let {
            dispatch,
            carousel
        } = this.props;

        items = _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (num) => {
            return <span
                       style={{marginTop: '20px',
                               fontSize: '32px',
                               display: 'block',
                               width: '100%',
                               textAlign: 'center'}}
                       key={num}
                   >{num}</span>;
        });

        return <Carousel
                   onItemActivate={(item) => { dispatch(actions.activateItem(item)); }}
                   onItemsScroll={(index) => { dispatch(actions.scrollToIndex(index)); }}
                   items={items}
                   {...carousel}
               />
    }
}

App = connect(selector)(Root);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('app'));
