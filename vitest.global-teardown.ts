import { execSync } from "node:child_process"

export default async function globalTeardown() {
  if (process.env.CI !== "true") return

  // 1) Dar un respiro corto para que se escriba el lcov (si aplica)
  await new Promise((r) => setTimeout(r, 1500))

  // 2) Si esbuild quedó vivo, lo matamos (causa típica del hang)
  try {
    execSync("pkill -f esbuild || true", { stdio: "ignore" })
  } catch {
    // ignore
  }

  // 3) Log simple de diagnóstico (por si siguiera colgado)
  try {
    // eslint-disable-next-line no-console
    console.log("[ci] active handles:", (process as any)._getActiveHandles?.()?.length ?? "n/a")
    // eslint-disable-next-line no-console
    console.log("[ci] active requests:", (process as any)._getActiveRequests?.()?.length ?? "n/a")
  } catch {
    // ignore
  }
}
