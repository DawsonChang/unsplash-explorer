import React from 'react';

import unsplash from '../api/unsplash';
import Searchbar from './Searchbar';
import ImageList from './ImageList';
import NavBar from './NavBar';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { images: [], page: 1, query: null, per_page: 10 };
        // 新增一個 ref
        this.lazyRef = React.createRef();
        // options root 為 viewport 最下方的一塊 div 區域
        const options = {
            root: this.lazyRef.current,
            rootMargin: "0px",
            threshold: 0
        }
        // 新增一個 Observer
        // 滾動到最底端的時候可以使用 lazy loading 功能
        // 在下方 componentDidUpdate 內使用
        this.observer = new IntersectionObserver(this.callbackLazy, options);
      }

    // 第一次搜尋後呼叫此函數
    afterSubmit = async (inputText) => {
        const { page, per_page } = this.state;
        const response = await unsplash.get('/search/photos', {
            params: { query: inputText, page, per_page }
        });
        this.setState({ images: response.data.results, query: inputText, page: page + 1 });
    }

    // 本體在 constructor
    callbackLazy = (entries, observer) => {
        entries.forEach(async entry => {
            // 當此圖片進入 viewport 時才載入圖片
            if (!entry.isIntersecting) return

            // 每次滾動到目標時 呼叫 unsplash API, 並且 page + 1 
            const { images, query, page, per_page } = this.state;
            const response = await unsplash.get('/search/photos', {
                params: { query, page, per_page }
            });
            this.setState({ images: [...images, ...response.data.results], page: page + 1 });
            // 停止觀察此圖片
            observer.unobserve(entry.target)
          })
    }


    componentDidUpdate() {
        // 只要 page 1～6頁 (共50張圖)
        // 因此 page 超過 6 就不會再觀察 lazyRef
        // 確保 grid row 數量不會超過 1000
        if (this.state.page < 6) {
            // 延遲 1 秒，讓圖片讀取完後才設置新的 Observer
            // 因為讀取瞬間圖片還沒跑出來的時候，lazyRef 會出現在 viewport 最上方
            // 這樣可以避免連續讀取
            setTimeout(() => {
                this.observer.observe(this.lazyRef.current);
            }, 1000);
        }
    }
    
    render() {
        const searchBarStyle = {
            margin: "100px auto 50px auto",
            width: "60%"
        }

        // default: 不顯示 lazyloading 區域
        // 如果有第一筆搜尋之後才開啟 lazyloading and infinite scroll
        const lazyLoading = (images) => {
            if (images.length === 0) {
                return <div></div>;
            }
            return <div ref={this.lazyRef}></div>;
        };
        
        return (
            <div>
                <NavBar/>
                <div style={ searchBarStyle }>
                    <Searchbar afterSubmit={ this.afterSubmit }/>
                </div>
                <div style={{margin: "20px auto"}}>
                    <ImageList images={this.state.images} />
                </div>
                <div>{lazyLoading(this.state.images)}</div>
            </div>
        );
    }
}

export default App;