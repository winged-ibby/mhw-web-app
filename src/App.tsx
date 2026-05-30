import './App.css'
import { useState } from 'react'
import { useMonsters } from './hooks/customHook'
import { normalizeKey } from './utils/normalizaKeys'
import { icons } from './utils/icons'
import { MonsterCard } from './components/MonsterCard'
import { MonsterDetails } from './components/MonsterDetails'
import { useFavorites } from './hooks/customHook'

function App() {
  const [selectedMonsterId, setSelectedMonsterId] = useState<number | null>(null)
  const { monsters } = useMonsters();
  const [user, setUser] = useState<{ id: number; username: string } | null>(null)
  const { favorites, toggleFavorite } = useFavorites(user?.id ?? null)  
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  async function login(username: string, password: string) {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
    } else {
      alert(data.error)
    }
  }

  function logout() {
    setUser(null)
    setPassword("")
  }

  async function register(username: string, password: string) {
    const res = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
      setShowLogin(false)
    } else {
      alert(data.error)
    }
  }

  return (
    <>
      <header className="header">
        Monster Hunter World Compendium
          {user ? (
            <section className='user-section'>
              <span>Welcome {user.username}</span>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </section>
          ) : (
            <button 
              className="login-btn" 
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}
      </header>

      <div className='grid'>
        {[...monsters]
          .sort((a, b) => {
            if (!user) return a.name.localeCompare(b.name)

            const aFav = favorites.some(f => f.monster_id === a.id)
            const bFav = favorites.some(f => f.monster_id === b.id)

            // 1. group by favorite status
            if (aFav !== bFav) return aFav ? -1 : 1

            // 2. if same group, sort alphabetically
            return a.name.localeCompare(b.name)
          })
          .map(monster => {
            const cleanName = normalizeKey(monster.name)
            const icon = icons[cleanName]
            if (!icon) return null

            return (
              <MonsterCard
                key={monster.id}
                name={monster.name}
                icon={icon}
                monsterId={monster.id}
                isFavorite={favorites.some(f => f.monster_id === monster.id)}
                onClick={() => setSelectedMonsterId(monster.id)}
                onToggleFavorite={toggleFavorite}
              />
            )
          })
        }
      </div>
      
      {selectedMonsterId && (
        <MonsterDetails
          monsterId={selectedMonsterId}
          onClose={() => setSelectedMonsterId(null)}
        />
      )}

      <footer className="footer">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <a
          href="https://github.com/winged-ibby/"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>

      {showLogin && (
        <div className="login-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{authMode === "login" ? "Login" : "Create Account"}</h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="modal-actions">
              <button
                onClick={() => {
                  if (authMode === "login") {
                    login(username, password)
                  } else {
                    register(username, password)
                  }
                  setShowLogin(false)
                }}
              >
                {authMode === "login" ? "Login" : "Sign up"}
              </button>

              <button onClick={() => setShowLogin(false)}>
                Cancel
              </button>
            </div>

              <button
                className="switch-auth-btn"
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login"
                  ? "Create account"
                  : "Back to login"}
              </button>
            </div>
          </div>
      )}
    </>
  )
}

export default App
