import { useEffect } from 'react';

const RazorpayScriptLoader = () => {
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    return null;
};

export default RazorpayScriptLoader;