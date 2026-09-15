import React from 'react';

const MyComponentFunc = ({ name, age }) => {
    return (
        <div>
            <h2>함수 형태의 컴포넌트</h2>
            <h3>Hello! {name} / {age}</h3>
        </div>
    );
};

export default MyComponentFunc;