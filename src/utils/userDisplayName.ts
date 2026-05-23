export function getUserDisplayName(
  metadata: Record<string, unknown> | undefined,
  email: string | undefined,
): string {
  const fullName = metadata?.full_name
  if (typeof fullName === 'string' && fullName.trim()) {
    return fullName.trim()
  }

  const givenName = metadata?.given_name
  const familyName = metadata?.family_name
  if (typeof givenName === 'string' && givenName.trim()) {
    const last =
      typeof familyName === 'string' && familyName.trim() ? ` ${familyName.trim()}` : ''
    return `${givenName.trim()}${last}`
  }

  if (email) return email.split('@')[0]
  return ''
}
