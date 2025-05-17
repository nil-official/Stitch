const StatusHeader = ({ success, message }) => {
    return (
        <div className={`p-4 md:p-6 ${success ? 'bg-success-50' : 'bg-error-50'}`}>
            <div className="flex items-center gap-4">
                {success ? (
                    <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
                <div>
                    <h3 className={`text-lg md:text-xl font-semibold ${success ? 'text-success-700' : 'text-error-700'}`}>
                        {success ? 'Order Placed' : 'Payment Failed'}
                    </h3>
                    <p className="text-sm md:text-base text-primary-600 mt-1">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default StatusHeader;