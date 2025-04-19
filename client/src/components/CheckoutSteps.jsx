import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        { id: 0, name: 'Cart', link: '/user/cart' },
        { id: 1, name: 'Address', link: '/checkout/shipping' },
        { id: 2, name: 'Summary', link: '/checkout/summary' },
        { id: 3, name: 'Payment', link: '/checkout/payment' }
    ];

    return (
        <div className="w-full">
            <div className="hidden sm:block">
                <nav aria-label="Progress">
                    <ol className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <li key={step.id} className={`relative ${index < steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                <div className="flex items-center">
                                    {step.id < activeStep ? (
                                        <>
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700">
                                                <Check className="w-5 h-5 text-white" aria-hidden="true" />
                                            </div>
                                            <Link to={step.link} className="ml-3 text-sm font-medium text-gray-700">
                                                {step.name}
                                            </Link>
                                        </>
                                    ) : step.id === activeStep ? (
                                        <>
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-gray-700 bg-white">
                                                <span className="text-gray-700 font-medium">{step.id + 1}</span>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">{step.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                                                <span className="text-gray-500">{step.id + 1}</span>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-500">{step.name}</span>
                                        </>
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden sm:block absolute top-4 left-0 w-full">
                                        <div className="h-0.5 bg-gray-200" style={{ marginLeft: '2rem', marginRight: '1rem' }}>
                                            <div
                                                className={`h-0.5 ${step.id < activeStep ? 'bg-gray-700' : 'bg-gray-200'}`}
                                                style={{ width: step.id < activeStep ? '100%' : '0%' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Mobile view */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between mt-2">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center ${step.id === activeStep
                                ? 'text-gray-700 font-medium'
                                : step.id < activeStep
                                    ? 'text-gray-700'
                                    : 'text-gray-400'
                                }`}
                        >
                            <div className={`
                h-8 w-8 flex items-center justify-center rounded-full mb-1
                ${step.id < activeStep
                                    ? 'bg-gray-700 text-white'
                                    : step.id === activeStep
                                        ? 'border-2 border-gray-700 bg-white'
                                        : 'border-2 border-gray-300 bg-white'
                                }
              `}>
                                {step.id < activeStep ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span>{step.id + 1}</span>
                                )}
                            </div>
                            <span className="text-xs">{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;