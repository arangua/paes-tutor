/**
 * Global teardown for Vitest
 * Forces process exit after tests complete to prevent hanging in CI
 * This is needed because some handles (timers, connections) may not be cleaned up
 */
export default async function globalTeardown() {
  // In CI, force exit after a short delay to allow coverage to be written
  if (process.env.CI) {
    console.log('[globalTeardown] CI detected, scheduling forced exit...')
    setTimeout(() => {
      console.log('[globalTeardown] Forcing process exit')
      process.exit(0)
    }, 5000) // 5 seconds to allow coverage files to be written
  }
}
