import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { BiLogoGoogle } from "react-icons/bi";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; 
import { Card, CardHeader, CardContent, CardFooter } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";

export default function AuthPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (mode) => {
    try {
      if (mode === "signup") {
        if (form.password !== form.confirm) {
          alert("Passwords do not match");
          return;
        }
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#9eede5] p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <Tabs defaultValue="login" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>

          {/* Login Tab */}
          <TabsContent value="login">
            <CardContent className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" onClick={() => handleSubmit("login")}>Login</Button>
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleLogin}>
                <BiLogoGoogle size={20} /> Continue with Google
              </Button>
            </CardFooter>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <CardContent className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Confirm Password"
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" onClick={() => handleSubmit("signup")}>Create Account</Button>
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleLogin}>
                <BiLogoGoogle size={20} /> Continue with Google
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </section>
  );
}
