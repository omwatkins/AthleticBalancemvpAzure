"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, ExternalLink } from "lucide-react"

export default function EnvSetup() {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Environment Setup - DUAL API KEYS CONFIGURATION
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            <strong>Security Warning:</strong> Never share your API keys publicly or commit them to version control.
            Always use environment variables to keep your keys secure.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-semibold">Dual Assistant Setup Steps:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Create a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root
            </li>
            <li>
              Add your PRIMARY OpenAI API key (for Execution Assistant):{" "}
              <code className="bg-muted px-1 rounded">OPENAI_API_KEY=your_primary_api_key_here</code>
            </li>
            <li>
              Add your SECONDARY OpenAI API key (for Reflection Assistant):{" "}
              <code className="bg-muted px-1 rounded">OPENAI_API_KEY_SECONDARY=your_secondary_api_key_here</code>
            </li>
            <li>
              Get API keys from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                OpenAI Platform <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              Add <code className="bg-muted px-1 rounded">.env.local</code> to your{" "}
              <code className="bg-muted px-1 rounded">.gitignore</code> file
            </li>
            <li>Restart your development server</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-semibold text-blue-800 mb-1">Dual API Key Benefits:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use different OpenAI accounts for execution and reflection</li>
            <li>• Separate billing and usage tracking</li>
            <li>• Enhanced redundancy and reliability</li>
            <li>• Different rate limits for each assistant</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h5 className="font-semibold text-yellow-800 mb-1">Configuration Options:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • <strong>Same API Key:</strong> Use the same key for both (set both to same value)
            </li>
            <li>
              • <strong>Different API Keys:</strong> Use separate keys for different accounts
            </li>
            <li>
              • <strong>Fallback:</strong> Secondary key will fallback to primary if not set
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h5 className="font-semibold text-gray-800 mb-1">Example .env.local file:</h5>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
            {`# Primary API Key (Execution Assistant)
OPENAI_API_KEY=sk-proj-abc123...

# Secondary API Key (Reflection Assistant) 
OPENAI_API_KEY_SECONDARY=sk-proj-def456...

# Optional: Assistant IDs (if different from defaults)
EXECUTION_ASSISTANT_ID=asst_hUC1KmMkIOKOx9OhE2P5GRBa
REFLECTION_ASSISTANT_ID=asst_10A35sa3kEsM7jS1EvdYAmBm`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
