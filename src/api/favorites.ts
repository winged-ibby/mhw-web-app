export async function addFavorite(userId: number, monsterId: number) {
  return fetch("http://localhost:3001/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, monster_id: monsterId })
  })
}

export async function removeFavorite(userId: number, monsterId: number) {
  return fetch(
    `http://localhost:3001/favorites?user_id=${userId}&monster_id=${monsterId}`,
    {
      method: "DELETE"
    }
  )
}
