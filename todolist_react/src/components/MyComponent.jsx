import React, { Component } from 'react';

class MyComponent extends Component {
    //상태객체
    state = {
        value: 0,
        message: '',
        username: ''
    };
    
    //event handler 함수
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };


    //Component 메서드 재정의
    render() {
        const { name, age } = this.props; 
        const { value, message, username } = this.state;
        const { handleChange } = this;

        return (
            <div>
                <h2>클래스 형태의 컴포넌트</h2>
                <h3>Hello! {name} / {age}</h3>
                <p>상태변수 value = {value}</p>
                <button onClick={() => this.setState({
                    value: value + 1
                })}>증가</button> 
                
                <p>상태변수 message = {message}</p>
                <input name="message" value={message} onChange={handleChange} />
                <br />
                <p>상태변수 username = {username}</p>
                <input name="username" value={username} onChange={handleChange} />
            </div>
        );
    }//render
}

export default MyComponent;