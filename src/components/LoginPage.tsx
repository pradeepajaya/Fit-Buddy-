import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import * as Icons from "react-feather";
import * as Yup from "yup";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login, forgotPassword } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [forgotMsg, setForgotMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    try {
      // Validate form
      await loginSchema.validate(formData, { abortEarly: false });

      setIsLoading(true);
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setApiError(result.error || "Login failed");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path as keyof FormErrors] = err.message;
          }
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Icons.Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your wellness journey
          </p>
        </div>

        {apiError && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <Icons.AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {apiError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <Icons.EyeOff className="w-5 h-5" />
                ) : (
                  <Icons.Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="text-right -mt-2">
            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setForgotMsg("");
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.Loader className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Icons.LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Demo Credentials:
          </p>
          <p className="text-sm text-blue-700">Email: demo@fitbuddy.com</p>
          <p className="text-sm text-blue-700">Password: demo123</p>
          <p className="text-xs text-blue-600 mt-2">
            Or register to create a new account
          </p>
        </div>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgot} onOpenChange={setShowForgot}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icons.Unlock className="w-5 h-5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {forgotMsg && (
              <Alert className="bg-green-50 border-green-200">
                <Icons.CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {forgotMsg}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="forgotEmail">Email</Label>
              <Input
                id="forgotEmail"
                type="email"
                placeholder="Enter your account email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forgotNewPass">New Password</Label>
              <Input
                id="forgotNewPass"
                type="password"
                placeholder="New password"
                value={forgotNewPass}
                onChange={(e) => setForgotNewPass(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forgotConfirm">Confirm New Password</Label>
              <Input
                id="forgotConfirm"
                type="password"
                placeholder="Confirm new password"
                value={forgotConfirm}
                onChange={(e) => setForgotConfirm(e.target.value)}
              />
            </div>
            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                setForgotMsg("");
                if (!forgotEmail) {
                  setForgotMsg("Please enter your email");
                  return;
                }
                if (!forgotNewPass || forgotNewPass.length < 6) {
                  setForgotMsg("Password must be at least 6 characters");
                  return;
                }
                if (forgotNewPass !== forgotConfirm) {
                  setForgotMsg("Passwords do not match");
                  return;
                }
                const res = await forgotPassword(forgotEmail, forgotNewPass);
                if (res.success) {
                  setForgotMsg("Password has been reset. You can sign in now.");
                } else {
                  setForgotMsg(res.error || "Failed to reset password");
                }
              }}
            >
              Send Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
