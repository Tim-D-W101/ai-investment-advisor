import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type PortfolioHolding = {
  ticker: string;
  name: string;
  type: string;
  allocation_percent: number;
  reasoning: string;
};

export type PortfolioRecommendation = {
  portfolio: PortfolioHolding[];
  summary: string;
};

export async function getPortfolioRecommendation(profile: {
  profile_type: string;
  age_range: string;
  horizon: string;
  monthly_amount: string;
  goal: string;
}): Promise<PortfolioRecommendation> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: `You are a JSE-focused investment educator for South African retail investors. You provide clear, plain-language portfolio guidance in ZAR. Always include 1 cash/money market component, 1–2 ETFs, 2–4 JSE-listed stocks, and optionally 1 global ETF for diversification. This is educational information only, not regulated financial advice. Return ONLY valid JSON in this exact format: {"portfolio": [{"ticker": "STX40", "name": "Satrix Top 40 ETF", "type": "ETF", "allocation_percent": 30, "reasoning": "Plain-language reason in 1-2 sentences"}], "summary": "2-sentence overview of the strategy"}`,
    messages: [
      {
        role: "user",
        content: `Profile: ${profile.profile_type} investor, age ${profile.age_range}, investment horizon ${profile.horizon}, monthly investment amount ${profile.monthly_amount}, primary goal: ${profile.goal}. Generate a portfolio.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON even if Claude wraps it in markdown code fences
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in Claude response");

  return JSON.parse(jsonMatch[0]) as PortfolioRecommendation;
}

export async function explainStock(ticker: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Explain the stock or ETF with ticker "${ticker}" in exactly 3 plain-language sentences for a first-time South African investor. Cover: what the company/fund does, why it might belong in a portfolio, and one key risk. Keep it simple and jargon-free.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
