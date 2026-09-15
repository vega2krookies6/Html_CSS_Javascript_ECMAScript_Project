import React, { Component } from 'react';

class MyComponent extends Component {
    render() {
        return (
            <div>
                <h2>클래스 형태의 컴포넌트</h2>
                <h3>Hello! {this.props.name} / {this.props.age}</h3>
            </div>
        );
    }
}

export default MyComponent;