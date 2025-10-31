import { MainNav } from "@/components/navigation/main-nav"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <LoginForm />
      </div>
    </div>
  )
}
