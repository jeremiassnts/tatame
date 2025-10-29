import React, { createContext, ReactNode, useContext, useState } from "react";
import { UserType } from "../constants/user-type";

interface SignUpProviderProps {
  children: ReactNode;
}
export interface SignUpContextType<T> {
  form: Partial<T> | undefined;
  currentStep: number;
  userType: UserType | undefined;
  handleUpdateForm: (newForm: Partial<T>) => void;
  handleUpdateCurrentStep: (newStep: number) => void;
  handleUpdateUserType: (newUserType: UserType) => void;
  stepsCount: number;
  handleUpdateStepsCount: (newStepsCount: number) => void;
}
export const SignUpContext = createContext({} as SignUpContextType<any>);
export function useSignUpContext<T>() {
  return useContext(SignUpContext) as SignUpContextType<T>;
}
export default function SignUpProvider<T>({ children }: SignUpProviderProps) {
  const [form, setForm] = useState<Partial<T> | undefined>();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType | undefined>();
  const [stepsCount, setStepsCount] = useState(0);

  function handleUpdateForm(newForm: Partial<T>) {
    setForm((form) => {
      return {
        ...form,
        ...newForm,
      };
    });
  }

  function handleUpdateCurrentStep(newStep: number) {
    setCurrentStep(newStep);
  }

  function handleUpdateUserType(newUserType: UserType) {
    setUserType(newUserType);
  }

  function handleUpdateStepsCount(newStepsCount: number) {
    setStepsCount(newStepsCount);
  }

  return (
    <SignUpContext.Provider
      value={{
        form,
        handleUpdateForm,
        currentStep,
        userType,
        handleUpdateCurrentStep,
        handleUpdateUserType,
        stepsCount,
        handleUpdateStepsCount,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}
