import React, { useState } from 'react';

const MyComponentFunc = ({ name, age, children }) => {
    const [value, setValue] = useState(0);

    return (
        <div>
            <h2>함수 형태의 컴포넌트</h2>
            <h3>Hello! {name} / {age}</h3>
            {children}
            <p>상태변수 value = {value}</p>
            <button onClick={() => setValue(value + 1)}>증가</button>
        </div>
    );
};

export default MyComponentFunc;