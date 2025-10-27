import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Mail, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COUNTRIES } from "@/utils/countries";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");

  // Password validation
  const validatePassword = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const passwordRequirements = validatePassword(password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      setLoading(true);

      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }

      if (isSignUp && !countryCode) {
        toast.error("Please select your country");
        return;
      }

      const redirectUrl = `${window.location.origin}/`;

      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              country_code: countryCode || null,
            },
          },
        });

        if (error) throw error;

        // Update profile with country code if user was created
        if (authData.user) {
          await supabase
            .from('profiles')
            .update({ country_code: countryCode || null })
            .eq('user_id', authData.user.id);
        }

        // Show verification message instead of navigating
        setShowVerificationMessage(true);
        setPendingVerificationEmail(email);
        setEmail("");
        setPassword("");
        setCountryCode("");
        toast.success("Account created! Please check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle email not confirmed error specifically
          if (error.message.includes("Email not confirmed")) {
            setShowVerificationMessage(true);
            setPendingVerificationEmail(email);
            toast.error("Please verify your email address before signing in. Check your inbox for the verification link.");
            throw new Error("Please verify your email address before signing in. Check your inbox for the verification link.");
          }
          throw error;
        }

        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.message === "Invalid login credentials") {
        toast.error("Invalid email or password");
      } else if (error.message.includes("verify your email")) {
        // Already handled above
      } else if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingVerificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `https://bukets.net/`,
        },
      });

      if (error) throw error;
      // Don't set loading false here - OAuth will redirect
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error(error.message || "Failed to sign in with Google. Please try again.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-md mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full space-y-5">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-3">
              <Trophy className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold">NBA Daily Quiz</h1>
            <p className="text-muted-foreground">Sign in to track your scores and compete on the leaderboard</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Sign in or create an account to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {showVerificationMessage ? (
                <Alert className="border-primary/50 bg-primary/5">
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="ml-2 space-y-3">
                    <div>
                      <p className="font-semibold mb-1">Check your email!</p>
                      <p className="text-sm">
                        We've sent a verification link to <span className="font-medium">{pendingVerificationEmail}</span>
                      </p>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Click the link in the email to verify your account and sign in.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Resend verification email"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowVerificationMessage(false);
                          setPendingVerificationEmail("");
                        }}
                      >
                        Back to sign in
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-3">
                    <p className="text-sm text-center text-muted-foreground">Quick sign in with</p>
                    <Button
                      variant="outline"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full h-11 touch-target"
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>
                </>
              )}

              {!showVerificationMessage && (
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                <TabsContent value="signin" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="h-12 py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailAuth(false)}
                      disabled={loading}
                      className="h-12 py-3"
                    />
                  </div>
                  <Button
                    className="w-full h-11 touch-target"
                    onClick={() => handleEmailAuth(false)}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="h-12 py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 py-3"
                    />
                    {password && (
                      <div className="text-sm space-y-1 pt-2">
                        <p className="text-muted-foreground font-medium mb-2">Password must contain:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            {passwordRequirements.minLength ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={passwordRequirements.minLength ? "text-green-500" : "text-muted-foreground"}>
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordRequirements.hasUpperCase ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={passwordRequirements.hasUpperCase ? "text-green-500" : "text-muted-foreground"}>
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordRequirements.hasLowerCase ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={passwordRequirements.hasLowerCase ? "text-green-500" : "text-muted-foreground"}>
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordRequirements.hasNumber ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={passwordRequirements.hasNumber ? "text-green-500" : "text-muted-foreground"}>
                              One number
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordRequirements.hasSpecialChar ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={passwordRequirements.hasSpecialChar ? "text-green-500" : "text-muted-foreground"}>
                              One special character (!@#$%^&*...)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={countryCode} onValueChange={setCountryCode} disabled={loading}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full h-11 touch-target"
                    onClick={() => handleEmailAuth(true)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailAuth(true)}
                    disabled={loading || !isPasswordValid || !countryCode}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
