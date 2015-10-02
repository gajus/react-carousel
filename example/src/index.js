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
            activeItemId: '0',
            numberOfItems: 10,
            scrollStepDistance: 3,
            displayWindowSize: 5
        };
    }

    scrollToIndex (index) {
        this.setState({visibleIndex: index});
    }

    activateItem (id) {
        this.setState({activeItemId: id});
    }

    setNumberOfItems (event) {
        let number;

        number = parseInt(event.target.value) || 5;

        this.setState({
            numberOfItems: number,
            visibleIndex: 0
        });
    }

    setVisibleIndex (event) {
        let index;

        index = event.target.value || 0;
        index = parseInt(index);

        if(index < 0) {
            index = 0;
        }

        if (index > (this.state.numberOfItems - this.state.displayWindowSize)) {
            index = this.state.numberOfItems - this.state.displayWindowSize;
        }

        this.setState({
            visibleIndex: index
        })
    }

    setScrollStepDistance (event) {
        let distance;

        distance = parseInt(event.target.value) || this.state.scrollStepDistance;

        if (distance < 0) {
            distance = this.state.scrollStepDistance;
        }

        this.setState({
            scrollStepDistance: distance
        });
    }

    render () {
        let items;

        items = _.map(_.times(this.state.numberOfItems, (n) => n), (num) => {
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
                          height: 150,
                          background: '#99A9D8',
                          maxWidth: 550
                          }}>
             <Carousel
                 items={items}
                 visibleIndex={this.state.visibleIndex}
                 activeItemId={this.state.activeItemId}
                 scrollStepDistance={this.state.scrollStepDistance}
                 onItemActivate={this.activateItem.bind(this)}
                 onItemsScroll={this.scrollToIndex.bind(this)}
                 itemWidth={90}
             />

             <div className="controls">
                 <table>
                     <thead></thead>
                     <tbody>
                     <tr>
                         <td>Number of Items</td>
                         <td><input
                                 type="number"
                                 ref="numberOfItems"
                                 onChange={this.setNumberOfItems.bind(this)}
                                 defaultValue={this.state.numberOfItems} /></td>
                     </tr>
                     <tr>
                         <td>visibleIndex</td>
                         <td>
                             <input
                                 type="number"
                                 ref="visibleIndex"
                                 onChange={this.setVisibleIndex.bind(this)}
                                 defaultValue={this.state.visibleIndex}
                             /></td>
                     </tr>
                     <tr>
                         <td>scrollStepDistance</td>
                         <td>
                             <input
                                 type="number"
                                 ref="scrollStepDistance"
                                 onChange={this.setScrollStepDistance.bind(this)}
                                 defaultValue={this.state.scrollStepDistance}
                             /></td>
                     </tr>
                     </tbody>
                 </table>
             </div>
        </div>;
    }
}

App = Root;

ReactDOM.render(
    <App />
    , document.getElementById('app'));
