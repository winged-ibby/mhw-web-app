import './MonsterDetails.css'
import type { MonsterDetailsProps, Monster } from "../types/types"
import { useEffect, useState } from "react"

export function MonsterDetails({ monsterId, onClose }: MonsterDetailsProps) {
  const [fullMonster, setFullMonster] = useState<Monster | null>(null)

  useEffect(() => {
    fetch(`http://localhost:3001/monsters/${monsterId}`)
      .then(res => res.json())
      .then(data => setFullMonster(data))
  }, [monsterId])

  if (!fullMonster) {
    return (
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="monster-modal-overlay" onClick={onClose}>
      <div className="monster-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{fullMonster.name}</h2>
        <p>{fullMonster.description}</p>

        <h3>Weaknesses</h3>

        <ul>
          {fullMonster.weaknesses?.length ? (
            fullMonster.weaknesses.map((w) => (
              <li key={`${w.element}-${w.condition || 'base'}`}>
                <strong>{w.element}</strong>{" "}
                {"*".repeat(w.stars)}
                {w.condition ? ` (${w.condition})` : ""}
              </li>
            ))
          ) : (
            <li>No weakness data available</li>
          )}
        </ul>
      </div>
    </div>
  )
}