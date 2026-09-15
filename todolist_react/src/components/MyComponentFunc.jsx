import React, { useState } from 'react';

const MyComponentFunc = ({ name, age, children }) => {
    const [value, setValue] = useState(0);
    // const [message, setMessage] = useState("");
    // const [username, setUsername] = useState("");
    const [inputs, setInputs] = useState({
        message: '', username: ''
    });
    //비구조화 할당
    const { message, username } = inputs;

    //event handler 함수
    const handleChange = (e) => {

    }

    return (
        <div>
            <h2>함수 형태의 컴포넌트</h2>
            <h3>Hello! {name} / {age}</h3>
            {children}
            <p>상태변수 value = {value}</p>
            <button onClick={() => setValue(value + 1)}>증가</button>
            <p>상태변수 message = {message}</p>
            <input name="message" value={message} onChange={handleChange} />
            <br />
            <p>상태변수 username = {username}</p>
            <input name="username" value={username} onChange={handleChange} />
        </div>
    );
};

export default MyComponentFunc;