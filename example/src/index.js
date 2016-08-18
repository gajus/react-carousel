/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from 'react-carousel';
import _ from 'lodash';
import './carousel.css';

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activeItemId: '1',
            itemMargin: 1,
            scrollStepDistance: 3,
            visibleIndex: 0
        };
    }

    handleScrollToIndex = (index) => {
        this.setState({visibleIndex: index});
    }

    handleActivateItem = (id) => {
        this.setState({activeItemId: id});
    }

    handleSetItemMargin = (event) => {
        let newMargin;

        newMargin = parseInt(event.target.value, 10);

        if (newMargin < 0) {
            newMargin = 0;
        }

        this.setState({itemMargin: newMargin});
        event.target.value = newMargin;
    }

    render () {
        let items;

        items = _.map(_.range(1, 15), (num) => {
            return <span
                key={String(num)}
                style={{
                    display: 'block',
                    fontSize: '32px',
                    marginTop: '20px',
                    textAlign: 'center',
                    width: '100%'
                }}
                   >{num}</span>;
        });

        return <div
            style={{
                fontFamily: 'sans-serif'
            }}
               >
            <h1>react-carousel demo</h1>
            <h3>Please go <a href='https://github.com/gajus/react-carousel'>here</a> for docs and source</h3>

            <div
                ref='wrapper'
                style={{
                    background: '#11516B',
                    height: 100,
                    maxWidth: 500,
                    minWidth: 200
                }}
            >

                <Carousel
                    activeItemId={this.state.activeItemId}
                    controlWidth={25}
                    firstVisibleIndex={this.state.visibleIndex}
                    itemMargin={this.state.itemMargin}
                    itemWidth={50}
                    items={items}
                    onItemActivate={this.handleActivateItem}
                    onItemsScroll={this.handleScrollToIndex}
                    scrollStepDistance={this.state.scrollStepDistance}
                />

                <div style={{margin: '30px 10px'}}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Item Margin: </td>
                                <td>
                                    <input
                                        defaultValue={this.state.itemMargin}
                                        onChange={this.handleSetItemMargin}
                                        ref='itemMargin'
                                        style={{
                                            border: '1px solid #222',
                                            borderRadius: 4,
                                            outline: 'none',
                                            padding: 10
                                        }}
                                        type='number'
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
