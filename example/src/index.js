/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Carousel, {
    actions
} from '@applaudience/react-carousel';

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            visibleIndex: 0,
            activeItemId: '0',
            scrollStepDistance: 3,
            itemMargin: 0
        };
    }

    scrollToIndex (index) {
        this.setState({visibleIndex: index});
    }

    activateItem (id) {
        this.setState({activeItemId: id});
    }

    setItemMargin (event) {
        let newMargin;

        newMargin = parseInt(event.target.value, 10);

        if (newMargin < 0) {
            newMargin = 0;
        }

        if (newMargin > 5) {
            newMargin = 5;
        }

        this.setState({itemMargin: newMargin});
        event.target.value = newMargin;
    }

    render () {
        let items;

        items = _.map(_.range(1, 16), (num) => {
            return <span
            style={{marginTop: '20px',
                    fontSize: '32px',
                    display: 'block',
                    width: '100%',
                    textAlign: 'center'}}
            key={String(num)} >{num}</span>;
        });

        return <div
        ref="wrapper"
        style={{
            height: 100,
            background: '#99A9D8',
            maxWidth: 500,
            minWidth: 200
        }} >
        <Carousel
            items={items}
            firstVisibleIndex={this.state.visibleIndex}
            activeItemId={this.state.activeItemId}
            scrollStepDistance={this.state.scrollStepDistance}
            onItemActivate={this.activateItem.bind(this)}
            onItemsScroll={this.scrollToIndex.bind(this)}
            controlWidth={25}
            itemWidth={50}
            itemMargin={this.state.itemMargin}
        />

        <div style={{margin: '30px 10px'}}>
            <table>
                <tbody>
                    <tr>
                        <td>Item Margin: </td>
                        <td>
                            <input
                                ref="itemMargin"
                                type="number"
                                onChange={this.setItemMargin.bind(this)}
                                defaultValue={this.state.itemMargin} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
