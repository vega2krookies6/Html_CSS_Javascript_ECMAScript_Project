import React, { useState } from 'react';

const MyComponentFunc = ({ name, age, children }) => {
    const [value, setValue] = useState(0);
    
    return (
        <div>
            <h2>함수 형태의 컴포넌트</h2>
            <h3>Hello! {name} / {age}</h3>
            {children}
        </div>
    );
};

export default MyComponentFunc;