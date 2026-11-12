export interface CheckOptions {
  timeoutMs?: number;
}

export interface CheckResult {
  url: string;
  ok: boolean;
  status: number | null;
  durationMs: number;
  error?: string;
}

export async function checkEndpoint(
  input: string,
  options: CheckOptions = {}
): Promise<CheckResult> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const startedAt = performance.now();

  try {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Only http and https URLs are supported");
    }

    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow"
    });

    return {
      url: url.toString(),
      ok: response.ok,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt)
    };
  } catch (error) {
    return {
      url: input,
      ok: false,
      status: null,
      durationMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function checkEndpoints(
  urls: string[],
  options: CheckOptions = {}
): Promise<{
  checkedAt: string;
  summary: { total: number; up: number; down: number };
  results: CheckResult[];
}> {
  const results = await Promise.all(
    urls.map((url) => checkEndpoint(url, options))
  );

  const up = results.filter((result) => result.ok).length;

  return {
    checkedAt: new Date().toISOString(),
    summary: { total: results.length, up, down: results.length - up },
    results
  };
}
