// Simulate a flaky API around otherwise an otherwise synchronous `f()`.
const flakify = <T>(f: () => T): Promise<T> =>
  new Promise((resolve, reject) =>
    // We'll always take 200 * (1d10 + 1) ms to respond
    window.setTimeout(() => {
      try {
        // And ~20% of the time we'll fail
        if (Math.random() < 0.2) {
          throw new Error("Failed arbitrarily")
        }

        resolve(f())
      } catch (e) {
        return reject(e)
      }
    }, 200 + Math.random() * 2000)
  )

const SAVE_LOCATION = "__counterValue"

export const save = (counter: number): Promise<void> =>
  flakify(() => {
    localStorage.setItem(SAVE_LOCATION, String(counter))
  })

export const load = (): Promise<number> =>
  flakify(() => {
    return parseInt(localStorage.getItem(SAVE_LOCATION) || "", 10) || 0
  })
