const BadgeButton = ({ icon, text }) => {
    return (
        <>
            <div className="drop-shadow-sm px-3 py-1 flex bg[#191926] bg-slate-900 items-center mx-2 ">
                {icon}
                <p className="ml-2">{text}</p>
            </div>
        </>
    );
};

export default BadgeButton;
