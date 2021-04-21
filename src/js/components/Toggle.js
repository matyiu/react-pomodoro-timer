import React, { useState } from 'react';

export default ({ onChange, value, name, id }) => {
    const [ toggle, setToggle ] = useState(value || false);

    const handleChange = () => {
        setToggle(!toggle);
        onChange({target: {
            value: !toggle,
            name
        }});
    }

    return (
        <div className="toggle" onClick={handleChange} 
            name={name} id={id} data-checked={toggle}>
            <div className="toggle-body"></div>
            <div className="toggle-circle"></div>
        </div>
    );
}