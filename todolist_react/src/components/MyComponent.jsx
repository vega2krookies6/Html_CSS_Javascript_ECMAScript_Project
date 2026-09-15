import React, { Component } from 'react';

class MyComponent extends Component {
    //상태객체
    state = {
        value: 0,
        message: '',
        username: ''
    };

    render() {
        const { name, age } = this.props; 
        const { value, message, username } = this.state;

        return (
            <div>
                <h2>클래스 형태의 컴포넌트</h2>
                <h3>Hello! {name} / {age}</h3>
                <p>상태변수 value = {value}</p>
                <button onClick={() => this.setState({
                    value: value + 1
                })}>증가</button> 
                
                <p>상태변수 message = {message}</p>
                <input name="message" value={message} />
                <br />
                <p>상태변수 username = {username}</p>
                <input name="username" value={username} />
            </div>
        );
    }
}

export default MyComponent;