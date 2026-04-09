/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import type { CartSteps } from "@/types/steps";

interface UseFormReturn {
    currentStep: CartSteps;
    currentComponent: React.ReactElement;
    changeStep: (i: number, e?: React.FormEvent<HTMLFormElement>) => void;
    isLastStep: boolean;
    isFirstStep: boolean;
}

export const useForm = (steps: React.ReactElement[]): UseFormReturn => {
    const [currentStep, setCurrentStep] = useState(0);

    const changeStep = (i: number, e?: React.FormEvent<HTMLFormElement>) => {
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
        currentComponent: steps[currentStep] ?? <></>,
        changeStep,
        isLastStep: currentStep + 1 === steps.length ? true : false,
        isFirstStep: currentStep === 0 ? true : false,
    }
}