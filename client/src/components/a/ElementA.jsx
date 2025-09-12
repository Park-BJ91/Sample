import React, { memo, useState, useCallback, createRef } from 'react';



export const PhoneInput = memo(function PhoneInput({ a, b, c, onChange }) {

    return (
        <div>
            <input name="a" type="text" value={a} onChange={onChange} />
            <input name="b" type="text" value={b} onChange={onChange} />
            <input name="c" type="text" value={c} onChange={onChange} />
        </div>
    );

});

export function ElementComponent(props) {

    const [input, setInput] = useState({ a: "", b: "", c: "" })
    const [textareaValue, setTextarea] = useState("")
    const [selected, setSelect] = useState(props.data.one)
    const [submitValue, setSubmit] = useState({ phone: "", textArea: textareaValue, selected: selected })

    const inputRef = createRef();

    const [multi, setMulti] = useState({ go: true, num: 2 })


    // const arr = Object.keys(props.data).map(key => ({ key, value: props.data[key] }));
    const arr = Object.entries(props.data).map(([key, value]) => ({ key, value }));

    const handleSubmit = (e) => {
        const total = `${input.a}-${input.b}-${input.c}`;

        console.log("Selected File - ", inputRef.current.files[0]);

        setSubmit(
            {
                phone: total,
                textArea: textareaValue,
                selected: selected
            }
        )
        console.log(submitValue)
        e.preventDefault();
    }

    const handleTextArea = (e) => {
        console.log("test", e.target);
        setTextarea(e.target.value);
    }

    const handleSelector = (e) => {
        const value = e.target.value;
        console.log("select: ", value)
        setSelect(value);
        console.log("hook select: ", selected)
    }

    const handleInput = useCallback((e) => {
        const { name, value } = e.target;
        let onlyNum = value.replace(/\D/g, "");

        const regx = /[^0-9]$/;
        if (regx.test(value)) {
            alert("test");
        }

        if (name === "a") onlyNum = onlyNum.slice(0, 3);
        if (name === "b" || name === "c") onlyNum = onlyNum.slice(0, 4);


        setInput((p) => ({ ...p, [name]: onlyNum }));

        if (name === "a" && onlyNum.length === 3) {
            document.getElementsByName("b")[0].focus();
        }
        if (name === "b" && onlyNum.length === 4) {
            document.getElementsByName("c")[0].focus();
        }

    }, []);

    const handleMulti = (e) => {
        const target = e.target
        const name = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setMulti({
            ...multi,
            [name]: value
        })

    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", margin: '150px' }}>

                    <PhoneInput a={input.a} b={input.b} c={input.c} onChange={handleInput} />

                    <div>
                        <textarea value={textareaValue} onChange={handleTextArea}></textarea>
                    </div>

                    <div>
                        <label>
                            Selector:
                            <select value={selected} onChange={handleSelector}>
                                <option>==============</option>
                                {arr.map((opt) => (
                                    <option key={opt.key} value={opt.value}>
                                        {opt.key}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div>
                        <input type='file' ref={inputRef}></input>
                    </div>

                    <div>

                        <label htmlFor='go'>Check</label>
                        <input name='go' type='checkbox' checked={multi.go} onChange={handleMulti} />
                        <p>HO</p>
                        <input name='num' type='number' value={multi.num} onChange={handleMulti} />
                    </div>



                    <button type='submit'>Submit</button>
                </div>
            </div>
        </form>
    )

}


