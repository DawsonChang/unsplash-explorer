import React from 'react';

class ImageCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { spans: 0 };
    // init the react ref
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    // 放一個 "addEventListener" 監聽 "load"
    // 如果有任何變動，呼叫 setSpans
    this.imageRef.current.addEventListener('load', this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    // ImageList.css, grid-auto-rows: 5px
    // 這邊我們用 height / 10 看需要幾個 row，最後加 3 讓整體看起來平均一點
    
    // 這裡有個 bug: 在 chrome 中 grid 只能有 1000 個 rows 和 columns
    // 因此用這種方法 infinite scroll 最多 height 只有 1000 * 10px = 10000px
    // 目前還沒有方法解決(除非不用 grid)
    // https://github.com/rachelandrew/gridbugs/issues/28
    const spans = Math.ceil(height / 10) + 3;

    this.setState({ spans });
  };

  render() {
    const { description, urls } = this.props.image;

    return (
      // update css variable "grid-row-end: span x"
      <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <img ref={this.imageRef} alt={description} src={urls.regular} />
      </div>
    );
  }
}

export default ImageCard;
