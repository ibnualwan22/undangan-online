import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
      let action: string | undefined;
          try {
                const body = await request.json();
                      action = body?.action;
                          } catch { /* ignore */ }

                              if (!action) {
                                    return NextResponse.json({ error: "Missing 'action'" }, { status: 400 });
                                        }

                                            const limits = {
                                                  login:    { limit: 5, window: 15 * 60 * 1000 },
                                                        register: { limit: 3, window: 60 * 60 * 1000 },
                                                            } as const;

                                                                const config = limits[action as keyof typeof limits];
                                                                    if (!config) {
                                                                          return NextResponse.json({ error: "Invalid action" }, { status: 400 });
                                                                              }

                                                                                  const fwd = request.headers.get("x-forwarded-for");
                                                                                      const ip =
                                                                                            fwd?.split(",")[0]?.trim() ||
                                                                                                  request.headers.get("x-real-ip") ||
                                                                                                        request.ip ||
                                                                                                              "127.0.0.1";

                                                                                                                  const identifier = `${action}:${ip}`;
                                                                                                                      const result = await rateLimit(identifier, config.limit, config.window);

                                                                                                                          const headers = getRateLimitHeaders(result);

                                                                                                                              if (!result.success) {
                                                                                                                                    return NextResponse.json(
                                                                                                                                            { error: "Rate limit exceeded. Please try again later.", resetTime: result.reset },
                                                                                                                                                    { status: 429, headers },
                                                                                                                                                          );
                                                                                                                                                              }

                                                                                                                                                                  return NextResponse.json({ success: true }, { status: 200, headers });
                                                                                                                                                                    } catch (error) {
                                                                                                                                                                        console.error("Rate limit API error:", error);
                                                                                                                                                                            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
                                                                                                                                                                              }
                                                                                                                                                                              }

                                                                                                                                                                              export function GET() {
                                                                                                                                                                                return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
                                                                                                                                                                                }
                                                                                                                                                                                export function OPTIONS() {
                                                                                                                                                                                  return NextResponse.json({ ok: true }, { status: 200 });
                                                                                                                                                                                  }
