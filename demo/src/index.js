import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from 'react-carousel';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      scrollStepDistance: 3,
      visibleIndex: 0
    };
  }

  handleScrollToIndex = (index) => {
    this.setState({
      visibleIndex: index
    });
  }

  render () {
    const data = new Array(15).fill(null);

    const items = data.map((velue, index) => {
      return <div
        key={String(index)}
        style={{
          border: '1px solid #00f',
          boxSizing: 'border-box',
          display: 'block',
          fontSize: '32px',
          height: '100px',
          lineHeight: '100px',
          textAlign: 'center'
        }}>{index}</div>;
    });

    return <div>
      <h1>react-carousel demo</h1>
      <h3>Please go <a href='https://github.com/gajus/react-carousel'>here</a> for docs and source.</h3>

      <div
        style={{
          background: '#eee',
          height: 100,
          width: 500
        }}
      >
        <Carousel
          controlWidth={25}
          firstVisibleIndex={this.state.visibleIndex}
          items={items}
          itemWidth={50}
          maxWidth={500}
          onItemScroll={this.handleScrollToIndex}
          scrollStepDistance={this.state.scrollStepDistance}
          />
      </div>
    </div>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
