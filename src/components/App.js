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
        const options = {
            root: this.lazyRef.current,
            rootMargin: "0px",
            threshold: 0
        }
        // 在 constructor 新增一個 observer
        // 在下方 componentDidUpdate 內使用
        this.observer = new IntersectionObserver(this.callbackLazy, options);
      }

    afterSubmit = async (inputText) => {
        const { page, per_page } = this.state;
        const response = await unsplash.get('/search/photos', {
            params: { query: inputText, page, per_page }
        });
        this.setState({ images: response.data.results, query: inputText, page: page + 1 });
    }

    callbackLazy = (entries, observer) => {
        entries.forEach(async entry => {
            // 當此圖片進入 viewport 時才載入圖片
            if (!entry.isIntersecting) return

            // 滾動到最底端的時候 lazy loading, 用 Observer 實作
            // 每次滾動時 page + 1 
            
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
        // 只要 page 1～6頁 （共50張圖）
        if (this.state.page < 6) {
            setTimeout(() => {
                this.observer.observe(this.lazyRef.current);
            }, 1000);
        }
    }
    
    render() {
        const bodyStyle = {
            margin: "0px 10% 50px 10%"
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
                <NavBar />
                <div style={{ padding: "50px 10px", textAlign: "center", maxHeight: "100%" }}>
                    <div style={ bodyStyle }>
                        <Searchbar afterSubmit={ this.afterSubmit }/>
                    </div>
                    <ImageList images={this.state.images} />
                </div>
                <div>{lazyLoading(this.state.images)}</div>
            </div>
        );
    }
    
}

export default App;