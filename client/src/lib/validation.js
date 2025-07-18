export function validateLinkedIn(url) {
  const pattern = /^https:\/\/(www\.)?linkedin\.com\/.*$/
  return pattern.test(url)
}
