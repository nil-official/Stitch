import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const steps = [
    { id: 1, name: 'Cart', path: '/checkout/cart' },
    { id: 2, name: 'Shipping', path: '/checkout/shipping' },
    { id: 3, name: 'Summary', path: '/checkout/summary' },
    { id: 4, name: 'Payment', path: '/checkout/payment' }
];

const CheckoutSteps = ({ currentStep, disabledSteps = [], className = '' }) => {
    const getStepStatus = (stepId) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    };

    const isStepDisabled = (stepId) => {
        return disabledSteps.includes(stepId);
    };

    const renderStepCircle = (step) => {
        const status = getStepStatus(step.id);

        let bgColor = 'bg-primary-200';
        let textColor = 'text-primary-400';
        let hoverColor = '';

        if (status === 'completed' || status === 'current') {
            bgColor = 'bg-primary-700';
            textColor = 'text-white';
            hoverColor = 'hover:bg-primary-800';
        }

        return (
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${bgColor} ${textColor} ${hoverColor} flex items-center justify-center transition-all duration-300`}>
                {step.id}
            </div>
        );
    };

    const renderStepName = (step) => {
        const status = getStepStatus(step.id);

        let textColor = 'text-primary-400';
        let hoverColor = '';

        if (status === 'completed' || status === 'current') {
            textColor = 'text-primary-700';
            hoverColor = 'hover:text-primary-800';
        }

        return (
            <span className={`ml-2 text-xl ${textColor} ${hoverColor} transition-all duration-300`}>
                {step.name}
            </span>
        );
    };

    const renderDivider = (index) => {
        if (index < steps.length - 1) {
            let dividerColor = 'text-primary-400';

            if (index < currentStep - 1) {
                dividerColor = 'text-primary-700';
            }

            return (
                <ChevronRight
                    size={16}
                    className={`hidden sm:block ${dividerColor} transition-all duration-300`}
                />
            );
        }
        return null;
    };

    const renderStep = (step, index) => {
        const StepWrapper = isStepDisabled(step.id)
            ? ({ children }) => <div className="flex items-center">{children}</div>
            : ({ children }) => (
                <Link
                    to={step.path}
                    className="flex items-center"
                >
                    {children}
                </Link>
            );

        return (
            <React.Fragment key={step.id}>
                <StepWrapper>
                    {renderStepCircle(step)}
                    {renderStepName(step)}
                </StepWrapper>
                {renderDivider(index)}
            </React.Fragment>
        );
    };

    return (
        <div className={`hidden lg:block ${className}`}>
            <div className="flex justify-between items-center">
                <div className="flex-1 px-2 md:px-6">
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4">
                        {steps.map((step, index) => renderStep(step, index))}
                    </div>
                </div>

                <div className="w-5">
                    {/* Spacer for layout balance */}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;