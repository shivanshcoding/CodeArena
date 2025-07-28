export function validateLinkedIn(url) {
  // Check if URL starts with https://www.linkedin.com
  if (!url) return false;
  
  // Normalize the URL to ensure it has https:// prefix
  let normalizedUrl = url;
  if (!url.startsWith('http')) {
    normalizedUrl = 'https://' + url;
  }
  
  const pattern = /^https:\/\/(www\.)?linkedin\.com\/(in|pub)\/[\w-]+\/?.*$/
  return pattern.test(normalizedUrl);
}
