const InputForToken = ({ value, setValue }) => {
    return (
        <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full text-black text-sm focus:outline-none p-2"
        />
    );
};

export default InputForToken;
