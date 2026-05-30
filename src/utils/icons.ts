const modules = import.meta.glob('../assets/monsters/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export const icons = Object.fromEntries(
  Object.entries(modules).map(([path, value]) => {
    const name = path.split('/').pop()!.replace('.webp', '')
    return [name, value]
  })
)