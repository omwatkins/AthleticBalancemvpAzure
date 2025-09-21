import { notFound } from "next/navigation"
import { getCoachBySlug } from "@/lib/coaches"
import ClientChat from "@/components/client-chat"

type Props = { params: { coachId: string } }

export async function generateMetadata({ params }: Props) {
  const coach = getCoachBySlug(params.coachId)
  return {
    title: coach ? `${coach.name} • Session` : "Coach • Session",
  }
}

export default function CoachSessionPage({ params }: Props) {
  const coach = getCoachBySlug(params.coachId)
  if (!coach) return notFound()

  return (
    <main className="h-[100dvh] flex flex-col bg-background">
      <ClientChat coachSlug={params.coachId} coachName={coach.name} />
    </main>
  )
}
