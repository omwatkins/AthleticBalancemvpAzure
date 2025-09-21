export async function GET() {
  try {
    return new Response(
      JSON.stringify({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          apiKeysConfigured: {
            primary: !!process.env.OPENAI_API_KEY,
            secondary: !!process.env.OPENAI_API_KEY_SECONDARY,
          },
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    )
  }
}
