import React, { useState } from "react"

export default (initialValues) => {
    const [values, setValues] = useState(initialValues || {});

    const handleChange = evt => {
        const target = evt.target;

        setValues({
            ...values,
            [target.name]: evt.target.value
        });
    }

    return [
        values,
        handleChange
    ]
}