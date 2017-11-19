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
          flexGrow: 1,
          fontSize: '32px',
          height: '100px',
          lineHeight: '100px',
          textAlign: 'center'
        }}>{index}</div>;
    });

    return <div>
      <h1>react-carousel demo</h1>
      <p>Resize the screen to constraint the container of the carousel.</p>
      <p>Documentation is available at <a href='https://github.com/gajus/react-carousel'>https://github.com/gajus/react-carousel</a>.</p>

      <Carousel
        controlWidth={25}
        firstVisibleIndex={this.state.visibleIndex}
        itemMargin={10}
        itemWidth={50}
        onItemScroll={this.handleScrollToIndex}
        scrollStepDistance={this.state.scrollStepDistance}

        // eslint-disable-next-line react/forbid-component-props
        style={{
          background: '#eee',
          height: 100,
          maxWidth: 1000
        }}
      >
        {items}
      </Carousel>
    </div>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
