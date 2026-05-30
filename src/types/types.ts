export type Monster = {
    id: number
    name: string
    description: string
    weaknesses: {
        element: string
        stars: number
        condition: string
    }[]
}

export type Props = {
    monster: Monster
    name: string
    icon: string
    onClick: () => void
    onClose: () => void
}

export type MonsterCardProps = {
  name: string
  icon: string
  onClick: () => void
}

export type MonsterDetailsProps = {
  monsterId: number
  onClose: () => void
}

export type Favorite = {
  id?: number
  user_id: number
  monster_id: number
}