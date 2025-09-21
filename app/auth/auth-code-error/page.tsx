import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <Card className="bg-slate-800 border-slate-700 rounded-2xl max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-white">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-400">
            There was an issue with the authentication process. Please try signing in again.
          </p>
          <Button asChild className="bg-lime-400 text-slate-900 hover:bg-lime-300">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
