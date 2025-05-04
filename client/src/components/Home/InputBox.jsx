const InputBox = ({ label, name, type, placeholder, value, onChange }) => {
    return (
        <div className="flex flex-col">
            <label className="font-semibold text-lg text-white mb-1">{label}</label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full p-2 border border-white/40 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/80 focus:outline-none focus:border-white transition-all
                [&::-webkit-inner-spin-button]:appearance-none 
                [&::-webkit-outer-spin-button]:appearance-none"
            />
        </div>
    )
};

export default InputBox;