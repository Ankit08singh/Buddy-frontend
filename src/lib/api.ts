import type { SentimentResult, TrendEntry, FlightRisk, Engagement } from "@/types";

const BASE_URL = "http://localhost:5000";

export async function sendMessage(
  userId: string,
  message: string
): Promise<{ reply: string; sentiment: SentimentResult }> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, Message: message }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Chat request failed (${res.status}): ${body}`);
  }
  return res.json();
}

export async function getVibeTrend(
  userId: string
): Promise<{
  trends: TrendEntry[];
  flightRisk: FlightRisk;
  engagement: Engagement;
}> {
  const res = await fetch(`${BASE_URL}/api/trend/${encodeURIComponent(userId)}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Trend request failed (${res.status}): ${body}`);
  }
  return res.json();
}
