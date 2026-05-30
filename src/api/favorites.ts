export async function addFavorite(userId: number, monsterId: number) {
  return fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, monster_id: monsterId })
  })
}

export async function removeFavorite(userId: number, monsterId: number) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/favorites?user_id=${userId}&monster_id=${monsterId}`,
    {
      method: "DELETE"
    }
  )
}
