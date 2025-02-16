import { useEffect, useState } from "react";

const Filters = ({ filter, types, setProperty, setfn }) => {

    const handler = (e) => {
        const selectedColor = e.target.value;
        console.log("property:", selectedColor);
        setfn(prevState => {
            // If already selected, remove it from the array; otherwise, add it
            if (prevState.includes(selectedColor)) {
                return prevState.filter(color => color !== selectedColor);
            } else {
                return [...prevState, selectedColor];
            }
        });
    };



    // console.log(filter);
    // const [isCheck, setIsCheck] = useState(false);
    // const handler = (e) => {
    //     setIsCheck(!isCheck);
    //     console.log("property", e.target.value);

    //     if (!isCheck) {
    //         setfn(e.target.value)
    //     } else setfn('');
    // }

    // useEffect(() => {
    //     console.log("state: ", isCheck);
    // }, [isCheck])

    return (
        <div>
            <div className="p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg tracking-wider border-4 border-transparent">
                {filter}
            </div>
            <div>
                {types.map((categoryName, i) => (
                    <div key={i} className="text-center top-20 flex flex-row justify-between items-start rounded-lg p-2 w-full">
                        <h3 className="flex gap-2">
                            <input className="w-3" type="checkbox" value={categoryName} onClick={(e) => handler(e)} />
                            {categoryName}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Filters;