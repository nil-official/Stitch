import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaWhatsapp, FaEnvelope, FaClipboard, FaCheck } from "react-icons/fa";
import { X } from "lucide-react";

const SharePopup = ({ isOpen, onClose, product }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const productUrl = window.location.href;
    const shareMessage = `Check this out\n${product.brand} ${product.title}\n${productUrl}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialLinks = [
        {
            name: "Facebook",
            icon: <FaFacebook size={20} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
        },
        {
            name: "X",
            icon: <FaXTwitter size={20} />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`
        },
        {
            name: "Email",
            icon: <FaEnvelope size={20} />,
            url: `mailto:?subject=Check this product&body=${encodeURIComponent(shareMessage)}`
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp size={20} />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-sm p-6 m-4 relative">

                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-base md:text-lg font-semibold text-gray-900'>Share this product</h2>
                    <button
                        onClick={onClose}
                    >
                        <X className='w-5 h-5 md:w-6 md:h-6 text-primary-800' />
                    </button>
                </div>

                <div className="flex flex-wrap gap-4">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-800 hover:bg-primary-200 transition-all duration-300"
                            title={link.name}
                        >
                            {link.icon}
                        </a>
                    ))}

                    {/* Copy link button */}
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-800 hover:bg-primary-200 transition-all duration-300"
                        title={copied ? "Copied!" : "Copy link"}
                    >
                        {copied ? <FaCheck size={18} /> : <FaClipboard size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SharePopup;