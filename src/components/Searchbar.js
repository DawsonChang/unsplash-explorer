import React from 'react';

class Searchbar extends React.Component {
    
    state = {
        inputText: ''
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.afterSubmit(this.state.inputText);
    }

    render() {
        const inputStyle = {
            height: "25px",
            width: "100%"
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <input 
                    type="text" 
                    style={ inputStyle }
                    value={ this.state.inputText }
                    onChange={(e) => this.setState({ inputText: e.target.value })}
                >
                </input>
            </form>
        );
    }
}

export default Searchbar;