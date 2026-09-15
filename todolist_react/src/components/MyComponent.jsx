import React, { Component } from 'react';

class MyComponent extends Component {
    //상태객체
    state = {
        value: 0
    };

    render() {
        const { name, age } = this.props; 
        const { value } = this.state;
        return (
            <div>
                <h2>클래스 형태의 컴포넌트</h2>
                <h3>Hello! {name} / {age}</h3>
                <p>상태변수 value = {value}</p>
                <button onClick={() => this.setState({
                    value: value + 1
                })}>증가</button>
            </div>
        );
    }
}

export default MyComponent;