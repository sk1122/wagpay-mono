const InputForToken = ({ value, setValue }) => {
    return (
        <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-[#4D4D8D]  text-sm focus:outline-none  px-2 py-3 bg-transparent text-center"
            placeholder="Enter Amount"
        />
    );
};

export default InputForToken;
