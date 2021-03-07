/**
 * Determine the differences between two arrays
 * @param {Map} a
 * @param {Map} b
 */
module.exports.Difference = (a, b) => {
  const differences = []

  a.keys.forEach((value) => {
    if (!b.has(value)) { differences.push(value) }
  })

  return differences
}
