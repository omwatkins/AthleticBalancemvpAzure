export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public isOperational = true,
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleApiError = (error: unknown): Response => {
  console.error("[v0] API Error:", error)

  if (error instanceof AppError) {
    return Response.json({ error: error.message }, { status: error.statusCode })
  }

  if (error instanceof Error) {
    return Response.json({ error: "An unexpected error occurred" }, { status: 500 })
  }

  return Response.json({ error: "Unknown error occurred" }, { status: 500 })
}

export const validateRequired = (value: unknown, fieldName: string): string => {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`${fieldName} is required`, 400)
  }
  return value.trim()
}
