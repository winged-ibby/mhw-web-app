import { useEffect, useState } from 'react'
import type { Monster } from '../types/types'
import type { Favorite } from '../types/types'
import getMonsters from '../api/monsters'

export function useMonsters() {
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getMonsters()
        setMonsters(data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { monsters, loading, error }
}

export function useFavorites(userId: number | null) {  
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchFavorites() {
    if (!userId) {             
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`http://localhost:3001/favorites/${userId}`)
      const data = await res.json()
      setFavorites(data)
    } catch (err) {
      console.error("Failed to fetch favorites:", err)
    } finally {
      setLoading(false)
    }
  }

  async function addFavorite(monsterId: number) {
    if (!userId) return         
    await fetch("http://localhost:3001/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, monster_id: monsterId })
    })
    await fetchFavorites()
  }

  async function removeFavorite(monsterId: number) {
    if (!userId) return         
    await fetch(
      `http://localhost:3001/favorites?user_id=${userId}&monster_id=${monsterId}`,
      { method: "DELETE" }
    )
    await fetchFavorites()
  }

  async function toggleFavorite(monsterId: number) {
    if (!userId) return         
    const isAlreadyFavorite = favorites.some(f => f.monster_id === monsterId)
    if (isAlreadyFavorite) {
      await removeFavorite(monsterId)
    } else {
      await addFavorite(monsterId)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [userId])

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites
  }
}