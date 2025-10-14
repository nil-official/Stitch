import { useState } from "react";
import { Send } from "lucide-react";
import SharePopup from "./SharePopup";

const ShareButton = ({ product }) => {
    const productUrl = window.location.href;
    const [isOpen, setIsOpen] = useState(false);

    const handleShare = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={handleShare}
                className="p-3 bg-white text-primary-800 shadow-md rounded-full"
            >
                <Send size={20} />
            </button>

            <SharePopup
                isOpen={isOpen}
                onClose={handleClose}
                product={product}
            />
        </>
    );
};

export default ShareButton;