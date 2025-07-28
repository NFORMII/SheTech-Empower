import api from "../api/axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "../components/LanguageSelector";
import { RoleSelector } from "../components/RoleSelector";
import { AuthForm } from "../components/AuthForm";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
enum OnboardingStep {
  LANGUAGE,
  ROLE,
  AUTH,
}
const Welcome: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.LANGUAGE);
  const [language, setLanguage] = useState<string>("en");
  const [role, setRole] = useState<string>("");
  const [authType, setAuthType] = useState<"login" | "signup">("signup");
  const { t } = useTranslation();

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setStep(OnboardingStep.ROLE);
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(OnboardingStep.AUTH);
  };
  const handleBackClick = () => {
    if (step === OnboardingStep.ROLE) {
      setStep(OnboardingStep.LANGUAGE);
    } else if (step === OnboardingStep.AUTH) {
      setStep(OnboardingStep.ROLE);
    }
  };
  const [authError, setAuthError] = useState<string>("");

  const handleAuthSubmit = async (data: any) => {
    try {
      setAuthError("");

      if (authType === "signup") {
        const response = await api.post("/accounts/register/", {
          full_name: data.name,
          email: data.email,
          password: data.password,
          role: role,
        });

        if (!response.data.token || !response.data.user) {
          throw new Error("Invalid response from server");
        }

        localStorage.setItem("token", response.data.token);
        login(response.data.token, response.data.user);

        const userRole = response.data.user.role;
        if (userRole === "mentor") {
          navigate("/mentor");
        } else if (userRole === "donor") {
          navigate("/donor");
        } else {
          navigate("/dashboard");
        }
      } else {
        const response = await api.post("/accounts/login/", {
          email: data.email,
          password: data.password,
        });

        if (!response.data.token || !response.data.user) {
          throw new Error("Invalid response from server");
        }

        localStorage.setItem("token", response.data.token);
        login(response.data.token, response.data.user);

        // Use the role from the response, not the locally selected role
        const userRole = response.data.user.role;
        if (userRole === "mentor") {
          navigate("/mentor");
        } else if (userRole === "donor") {
          navigate("/donor");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Auth failed:", error);
      setAuthError(
        error.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    }
  };

  const renderStep = () => {
    switch (step) {
      case OnboardingStep.LANGUAGE:
        return (
          <LanguageSelector
            onSelectLanguage={handleLanguageSelect}
            selectedLanguage={language}
          />
        );
      case OnboardingStep.ROLE:
        return (
          <RoleSelector onSelectRole={handleRoleSelect} selectedRole={role} />
        );
      case OnboardingStep.AUTH:
        return (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-montserrat font-bold text-gray-800">
                {/* {authType === 'login' ? 'Welcome Back' : 'Join SheTech Empower'} */}
                {authType === "login"
                  ? t("auth.login_title")
                  : t("auth.signup_title")}
              </h2>
              <p className="mt-2 text-gray-600">
                {authType === "login"
                  ? t("auth.login_subtitle")
                  : t("auth.signup_subtitle")}
                {/* {authType === 'login' ? 'Sign in to continue your journey' : 'Create an account to start your journey'} */}
              </p>
            </div>
            {authError && (
              <div className="text-red-600 text-sm text-center mb-4">
                {authError}
              </div>
            )}
            <AuthForm type={authType} onSubmit={handleAuthSubmit} />
            <div className="text-center">
              <button
                onClick={() =>
                  setAuthType(authType === "login" ? "signup" : "login")
                }
                className="text-primary hover:underline"
              >
                {authType === "login"
                  ? t("auth.switch_to_signup")
                  : t("auth.switch_to_login")}
              </button>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Optional: show nothing while redirecting
  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex flex-col">
      {/* Header with logo */}
      <header className="w-full p-4 flex justify-center">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-primary">
            SheTech Empower
          </h1>
          <p className="text-gray-600 mt-1">
            {t("tagline")}
            {/* Heal. Learn. Grow. Thrive. */}
          </p>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          {/* Healing illustration */}
          <div className="flex justify-center mb-6">
            <img
              src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Women supporting each other"
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
          {/* Trauma-informed welcome message */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-montserrat font-medium text-gray-800">
              {t("welcome.heading")}
              {/* A safe space for healing and growth */}
            </h2>
            <p className="mt-2 text-gray-600">
              {t("welcome.subtitle")}
              {/* Every journey begins with a single step. You are not alone. */}
            </p>
          </div>
          {/* Step content */}
          {renderStep()}
        </div>
        {/* Back button */}
        {step !== OnboardingStep.LANGUAGE && (
          <Button variant="outline" onClick={handleBackClick}>
            Back
          </Button>
        )}
      </main>
      {/* Footer */}
      <footer className="w-full p-4 text-center text-gray-500 text-sm">
        &copy; 2023 SheTech Empower Platform
      </footer>
    </div>
  );
};
export default Welcome;
