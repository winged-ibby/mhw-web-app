import './MonsterCard.css'
import type { MonsterCardProps } from "../types/types"

type Props = MonsterCardProps & {
  isFavorite?: boolean
  monsterId: number
  onClick: () => void
  onToggleFavorite?: (monsterId: number) => void
}

export function MonsterCard({
  name,
  icon,
  onClick,
  isFavorite,
  monsterId,
  onToggleFavorite
}: Props) {

  function handleStarClick(e: React.MouseEvent) {
    e.stopPropagation()

    if (onToggleFavorite) {
      onToggleFavorite(monsterId)
    }
  }

  return (
    <div className="card" onClick={onClick}>
      
      {onToggleFavorite &&(
        <button className="star-btn" 
          onClick={handleStarClick}
          disabled={onToggleFavorite == null}
        >
          {isFavorite ? "⭐" : "☆"}
        </button>
      )}

      <img src={icon} alt={name} />
      <p>{name}</p>
    </div>
  )
}