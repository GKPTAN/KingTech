import { useState } from "react";

export const useForm = (steps: React.ReactElement[]) => {
    const [currentStep, setCurrentStep] = useState(0);

    const changeStep = (i: number, e: React.FormEvent<HTMLFormElement>) => {
        if (e) {
            e.preventDefault();
        };

        if (i < 0 || i >= steps.length) {
            return;
        }
        setCurrentStep(i);
    };

    return {
        currentStep,
        currentComponent: steps[currentStep],
        changeStep,
        isLastStep: currentStep + 1 === steps.length ? true : false,
        isFirstStep: currentStep === 0 ? true : false,
    }
}