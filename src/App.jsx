import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { ArrowLeft, Camera, Clock3, Disc3, Download, ListMusic, Music2, Pause, Play, RotateCw, Search, Share2, Video, Wifi, WifiOff, X } from 'lucide-react'
import './App.css'

const canonicalAlbums = [
  'I Brought You My Bullets, You Brought Me Your Love',
  'Life on the Murder Scene',
  'Three Cheers for Sweet Revenge',
  'The Black Parade',
  'The Black Parade Is Dead!',
  'Danger Days: The True Lives of the Fabulous Killjoys',
  'Conventional Weapons',
  'May Death Never Stop You',
  'The Foundations of Decay',
]

function isOfficialAlbum(album, title = '') {
  if (trackAlbumOverrides[title]) return true
  const name = (album || '').toLowerCase()
  if (!name || name === 'null' || name.includes('unknown')) return false
  if (name.includes('three cheers')) return true
  if (name.includes('i brought you') || name === 'my chemical romance') return true
  if (name.includes('life on') && name.includes('murder scene')) return true
  if (name.includes('black parade')) return true
  if (name.includes('danger days')) return true
  if (name.includes('conventional weapons')) return true
  if (/\bnumber (one|two|three|four|five)\b/.test(name)) return true
  if (name.includes('may death never stop you')) return true
  if (name.includes('foundations of decay')) return true
  return false
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return null
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

const trackAlbumOverrides = {
  'The End.': 'The Black Parade',
  'Dead!': 'The Black Parade',
  'This Is How I Disappear': 'The Black Parade',
  'The Sharpest Lives': 'The Black Parade',
  'Welcome to the Black Parade': 'The Black Parade',
  'I Don\'t Love You': 'The Black Parade',
  'House of Wolves': 'The Black Parade',
  'Cancer': 'The Black Parade',
  'Mama': 'The Black Parade',
  'Sleep': 'The Black Parade',
  'Teenagers': 'The Black Parade',
  'Disenchanted': 'The Black Parade',
  'Famous Last Words': 'The Black Parade',
  'Blood': 'The Black Parade',
  'The Black Parade': 'The Black Parade',
  'I Am Not Afraid to Keep on Living': 'The Black Parade',
  'Na Na Na (Na Na Na Na Na Na Na Na Na)': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Bulletproof Heart': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'SING': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Planetary (GO!)': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'The Only Hope for Me Is You': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Party Poison': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Save Yourself, I\'ll Hold Them Back': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'S/C/A/R/E/C/R/O/W': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Summertime': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'DESTROYA': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'The Kids from Yesterday': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Goodnite, Dr. Death': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Vampire Money': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'vampire money': 'Danger Days: The True Lives of the Fabulous Killjoys',
  'Helena': 'Three Cheers for Sweet Revenge',
  'Give \'Em Hell, Kid': 'Three Cheers for Sweet Revenge',
  'To the End': 'Three Cheers for Sweet Revenge',
  'You Know What They Do to Guys Like Us in Prison': 'Three Cheers for Sweet Revenge',
  'I\'m Not Okay (I Promise)': 'Three Cheers for Sweet Revenge',
  'The Ghost of You': 'Three Cheers for Sweet Revenge',
  'The Jetset Life Is Gonna Kill You': 'Three Cheers for Sweet Revenge',
  'Interlude': 'Three Cheers for Sweet Revenge',
  'Thank You for the Venom': 'Three Cheers for Sweet Revenge',
  'Hang \'Em High': 'Three Cheers for Sweet Revenge',
  'It\'s Not a Fashion Statement, It\'s a Fucking Deathwish': 'Three Cheers for Sweet Revenge',
  'Cemetery Drive': 'Three Cheers for Sweet Revenge',
  'I Never Told You What I Do for a Living': 'Three Cheers for Sweet Revenge',
  'Romance': 'I Brought You My Bullets, You Brought Me Your Love',
  'Honey, This Mirror Isn\'t Big Enough for the Two of Us': 'I Brought You My Bullets, You Brought Me Your Love',
  'Vampires Will Never Hurt You': 'I Brought You My Bullets, You Brought Me Your Love',
  'Drowning Lessons': 'I Brought You My Bullets, You Brought Me Your Love',
  'Our Lady of Sorrows': 'I Brought You My Bullets, You Brought Me Your Love',
  'Headfirst for Halos': 'I Brought You My Bullets, You Brought Me Your Love',
  'Skylines and Turnstiles': 'I Brought You My Bullets, You Brought Me Your Love',
  'Early Sunsets Over Monroeville': 'I Brought You My Bullets, You Brought Me Your Love',
  'This Is the Best Day Ever': 'I Brought You My Bullets, You Brought Me Your Love',
  'Cubicles': 'I Brought You My Bullets, You Brought Me Your Love',
  'Demolition Lovers': 'I Brought You My Bullets, You Brought Me Your Love',
}

function getCanonicalAlbum(album, title = '') {
  if (trackAlbumOverrides[title]) return trackAlbumOverrides[title]
  const name = album || 'Unknown Album'
  const lower = name.toLowerCase()
  if (lower.includes('i brought you')) return 'I Brought You My Bullets, You Brought Me Your Love'
  if (lower.includes('life on') && lower.includes('murder scene')) return 'Life on the Murder Scene'
  if (lower.includes('three cheers')) return 'Three Cheers for Sweet Revenge'
  if (lower.includes('black parade is dead')) return 'The Black Parade Is Dead!'
  if (lower.includes('black parade')) return 'The Black Parade'
  if (lower.includes('danger days')) return 'Danger Days: The True Lives of the Fabulous Killjoys'
  if (lower.includes('conventional weapons') || /\bnumber (one|two|three|four|five)\b/.test(lower)) return 'Conventional Weapons'
  if (lower.includes('may death never stop you')) return 'May Death Never Stop You'
  if (lower.includes('foundations of decay')) return 'The Foundations of Decay'
  if (lower === 'my chemical romance') return 'I Brought You My Bullets, You Brought Me Your Love'
  return name
}

function getCoverStyle(album, index = 0) {
  const palette = [
    ['#111827', '#7f1d1d', '#ef4444'],
    ['#18181b', '#3f3f46', '#a1a1aa'],
    ['#071a18', '#166534', '#84cc16'],
    ['#1c1917', '#78350f', '#f59e0b'],
    ['#111827', '#312e81', '#a78bfa'],
  ]
  const seed = [...album].reduce((sum, char) => sum + char.charCodeAt(0), index)
  return palette[seed % palette.length]
}

function CoverArt({ album, size = 'card', index = 0 }) {
  const [dark, mid, accent] = getCoverStyle(album, index)
  const words = album.split(/[\s/:]+/).filter(Boolean)
  const initials = words.slice(0, 3).map((word) => word[0]).join('').toUpperCase()
  const coverMap = {
    'Three Cheers for Sweet Revenge': 'covers/three-cheers.jpg',
    'The Black Parade': 'covers/black-parade.jpg',
    'Danger Days: The True Lives of the Fabulous Killjoys': 'covers/danger-days.jpg',
    'I Brought You My Bullets, You Brought Me Your Love': 'covers/bullets.jpg',
    'May Death Never Stop You': 'covers/may-death.jpg',
    'Life on the Murder Scene': 'covers/life-on-the-murder-scene.jpg',
    'The Black Parade Is Dead!': 'covers/black-parade-is-dead.jpg',
    'Conventional Weapons': 'covers/conventional-weapons.jpg',
    'The Foundations of Decay': 'covers/foundations-of-decay.jpg',
  }
  const coverImage = coverMap[album]
  return (
    <div
      className={`cover-art cover-${size}`}
      style={{
        '--cover-dark': dark,
        '--cover-mid': mid,
        '--cover-accent': accent,
      }}
      aria-label={`${album} cover`}
      role="img"
    >
      {coverImage ? (
        <img className="cover-image" src={`${import.meta.env.BASE_URL}${coverImage}`} alt={`${album} cover`} />
      ) : (
        <>
          <span className="cover-noise" />
          <span className="cover-orbit" />
          <span className="cover-title">{album}</span>
          <span className="cover-initials">{initials}</span>
          <span className="cover-artist">MY CHEMICAL ROMANCE</span>
        </>
      )}
    </div>
  )
}

function getLyricSnippet(lyrics, query) {
  if (!query.trim()) return ''
  const lines = lyrics.split('\n').filter((line) => line.trim())
  const lowerQuery = query.toLowerCase()
  const direct = lines.find((line) => line.toLowerCase().includes(lowerQuery))
  if (direct) return direct.trim()
  const term = lowerQuery.split(/\s+/).find((word) => word.length > 2)
  return term ? lines.find((line) => line.toLowerCase().includes(term))?.trim() || '' : ''
}

function InstallButton({ isInstalled, installPrompt, onInstall }) {
  if (isInstalled) return null
  return (
    <button className="install-button" type="button" onClick={onInstall}>
      <Download size={15} />
      <span>{installPrompt ? 'INSTALL APP' : 'ADD TO HOME'}</span>
    </button>
  )
}

function InstallHelpDialog({ platform, onClose }) {
  if (!platform) return null

  const instructions = {
    ios: (
      <>
        <p>Install with Safari:</p>
        <ol>
          <li>Open this site in <strong>Safari</strong>. If you are in another app, use Share and choose Open in Safari.</li>
          <li>Tap <Share2 size={15} /> <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</li>
          <li>Tap <strong>Add</strong> to finish.</li>
        </ol>
      </>
    ),
    android: (
      <>
        <p>Install with Chrome:</p>
        <ol>
          <li>Open Chrome's <strong>⋮</strong> menu.</li>
          <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
          <li>Confirm the prompt.</li>
        </ol>
        <p className="install-help-note">If neither option appears, update Chrome and reopen this HTTPS site.</p>
      </>
    ),
    desktop: (
      <>
        <p>Install with Chrome or Edge:</p>
        <ol>
          <li>Look for the install icon at the right side of the address bar, or open the browser menu.</li>
          <li>Choose <strong>Install MCR Offline Lyrics</strong> or <strong>Apps → Install this site as an app</strong>.</li>
          <li>Confirm the prompt.</li>
        </ol>
        <p className="install-help-note">If there is no install option, open this link in an up-to-date Chrome or Edge window.</p>
      </>
    ),
  }

  return (
    <div className="install-sheet-backdrop" role="presentation" onClick={onClose}>
      <section className="install-sheet" role="dialog" aria-modal="true" aria-label="Install MCR Lyrics" onClick={(event) => event.stopPropagation()}>
        <button className="install-sheet-close" type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="install-sheet-icon"><Download size={22} /></div>
        <h2>Install MCR Lyrics</h2>
        {instructions[platform]}
      </section>
    </div>
  )
}

function PerformanceRecorder({ song, onClose }) {
  const videoRef = useRef(null)
  const lyricsRef = useRef(null)
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const downloadUrlRef = useRef('')
  const [cameraReady, setCameraReady] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [recordingTime, setRecordingTime] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [recordingType, setRecordingType] = useState('')
  const [error, setError] = useState('')
  const [orientationMessage, setOrientationMessage] = useState('')
  const [isLandscape, setIsLandscape] = useState(() => window.matchMedia('(orientation: landscape)').matches)

  useEffect(() => {
    const orientationQuery = window.matchMedia('(orientation: landscape)')
    const updateOrientation = () => setIsLandscape(orientationQuery.matches)
    orientationQuery.addEventListener('change', updateOrientation)
    return () => orientationQuery.removeEventListener('change', updateOrientation)
  }, [])

  useEffect(() => {
    if (!cameraReady || !videoRef.current || !streamRef.current) return
    videoRef.current.srcObject = streamRef.current
    videoRef.current.play().catch(() => {})
  }, [cameraReady])

  useEffect(() => {
    if (!autoScroll) return undefined
    const timer = window.setInterval(() => {
      if (!lyricsRef.current) return
      lyricsRef.current.scrollTop += scrollSpeed * 0.18
      if (lyricsRef.current.scrollTop + lyricsRef.current.clientHeight >= lyricsRef.current.scrollHeight - 1) {
        setAutoScroll(false)
      }
    }, 40)
    return () => window.clearInterval(timer)
  }, [autoScroll, scrollSpeed])

  useEffect(() => {
    if (!isRecording) return undefined
    const timer = window.setInterval(() => setRecordingTime((time) => time + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isRecording])

  useEffect(() => () => {
    if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
  }, [])

  const startCamera = async () => {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Camera recording is not supported in this browser. Try the latest Safari or Chrome over HTTPS.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      })
      streamRef.current = stream
      setCameraReady(true)
    } catch (cameraError) {
      setError(cameraError.name === 'NotAllowedError'
        ? 'Allow camera and microphone access in your browser settings, then try again.'
        : 'Could not start the camera. Close other camera apps and try again.')
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return
    setError('')
    setRecordingTime(0)
    chunksRef.current = []
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    downloadUrlRef.current = ''
    setDownloadUrl('')
    const supportedTypes = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp8,opus', 'video/webm']
    const mimeType = supportedTypes.find((type) => MediaRecorder.isTypeSupported(type))
    try {
      const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const type = recorder.mimeType || mimeType || 'video/webm'
        const clip = new Blob(chunksRef.current, { type })
        const url = URL.createObjectURL(clip)
        downloadUrlRef.current = url
        setDownloadUrl(url)
        setRecordingType(type.includes('mp4') ? 'mp4' : 'webm')
        setIsRecording(false)
      }
      recorder.start(1000)
      setIsRecording(true)
    } catch {
      setError('Recording could not start on this browser. Try a current version of Safari or Chrome.')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const requestLandscape = async () => {
    setOrientationMessage('')
    if (window.screen.orientation?.lock) {
      try {
        await window.screen.orientation.lock('landscape')
        return
      } catch {
        setOrientationMessage('Rotate your phone sideways to use the landscape layout.')
        return
      }
    }
    setOrientationMessage('Rotate your phone sideways to use the landscape layout.')
  }

  const formatRecordingTime = (time) => `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`

  return (
    <main className="performance-mode">
      <header className="performance-header">
        <button className="icon-button" type="button" onClick={onClose} disabled={isRecording} aria-label="Back to lyrics"><ArrowLeft size={20} /></button>
        <div className="performance-brand"><Video size={16} /><span>PERFORMANCE MODE</span></div>
        <button className="orientation-button" type="button" onClick={requestLandscape} aria-label="Rotate to landscape">
          <RotateCw size={15} /><span>{isLandscape ? 'LANDSCAPE' : 'ROTATE PHONE'}</span>
        </button>
        {isRecording && <span className="recording-timer"><i />{formatRecordingTime(recordingTime)}</span>}
      </header>

      <section className="performance-content">
        {orientationMessage && <p className="orientation-message" role="status">{orientationMessage}</p>}
        <div className="performance-title">
          <p>CAMERA + TELEPROMPTER</p>
          <h1>{song.title}</h1>
          <span>{getCanonicalAlbum(song.album, song.title)}</span>
        </div>

        <div className="performance-layout">
          <section className="camera-panel">
            <div className={`camera-preview ${cameraReady ? 'ready' : ''}`}>
              {cameraReady ? (
                <video ref={videoRef} autoPlay muted playsInline />
              ) : (
                <div className="camera-placeholder">
                  <Camera size={30} />
                  <span>Your front camera preview will appear here</span>
                </div>
              )}
              {isRecording && <span className="recording-indicator"><i /> REC {formatRecordingTime(recordingTime)}</span>}
            </div>
            <div className="record-controls">
              {!cameraReady ? (
                <button className="record-button" type="button" onClick={startCamera}><Camera size={17} />ENABLE CAMERA</button>
              ) : isRecording ? (
                <button className="record-button stop" type="button" onClick={stopRecording}><span className="stop-square" />STOP RECORDING</button>
              ) : (
                <button className="record-button" type="button" onClick={startRecording}><span className="record-dot" />{downloadUrl ? 'RECORD AGAIN' : 'START RECORDING'}</button>
              )}
              {downloadUrl && (
                <a className="download-recording" href={downloadUrl} download={`mcr-${song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${recordingType}`}>
                  <Download size={15} />SAVE VIDEO
                </a>
              )}
            </div>
            {error && <p className="camera-error" role="alert">{error}</p>}
            <p className="recording-note">Lyrics stay visible as your prompt. Your saved clip contains camera and microphone audio.</p>
          </section>

          <section className="prompter-panel">
            <div className="prompter-toolbar">
              <span>LYRICS</span>
              <button type="button" onClick={() => setAutoScroll((active) => !active)} aria-pressed={autoScroll}>
                {autoScroll ? <Pause size={15} /> : <Play size={15} />}
                {autoScroll ? 'PAUSE SCROLL' : 'AUTO-SCROLL'}
              </button>
            </div>
            <label className="scroll-speed">
              <span>SCROLL SPEED</span>
              <input type="range" min="1" max="8" value={scrollSpeed} onChange={(event) => setScrollSpeed(Number(event.target.value))} />
            </label>
            <div className="prompter-lyrics" ref={lyricsRef}>
              {(song.lyrics || 'Lyrics unavailable').split('\n').map((line, index) =>
                line.trim() ? <p key={index}>{line}</p> : <br key={index} />,
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [songs, setSongs] = useState([])
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState('albums')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [selectedSong, setSelectedSong] = useState(null)
  const [performanceMode, setPerformanceMode] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [loadError, setLoadError] = useState('')
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installHelpPlatform, setInstallHelpPlatform] = useState(null)
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
  )

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const handleInstalled = () => {
      setInstallPrompt(null)
      setInstallHelpPlatform(null)
      setIsInstalled(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (installPrompt) {
      const promptEvent = installPrompt
      setInstallPrompt(null)
      try {
        await promptEvent.prompt()
        const choice = await promptEvent.userChoice
        if (choice?.outcome === 'accepted') setIsInstalled(true)
      } catch {
        const userAgent = window.navigator.userAgent
        const isIos = /iphone|ipad|ipod/i.test(userAgent)
          || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
        setInstallHelpPlatform(isIos ? 'ios' : /android/i.test(userAgent) ? 'android' : 'desktop')
      }
      return
    }
    const userAgent = window.navigator.userAgent
    const isIos = /iphone|ipad|ipod/i.test(userAgent)
      || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
    setInstallHelpPlatform(isIos ? 'ios' : /android/i.test(userAgent) ? 'android' : 'desktop')
  }

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/mcr-lyrics-complete.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load lyrics (${response.status})`)
        return response.json()
      })
      .then(setSongs)
      .catch((error) => setLoadError(error.message))
  }, [])

  useEffect(() => {
    if (!selectedSong) return undefined
    let wakeLock
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen')
        } catch {
          wakeLock = undefined
        }
      }
    }
    requestWakeLock()
    return () => wakeLock?.release()
  }, [selectedSong])

  const fuse = useMemo(
    () =>
      new Fuse(songs, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'lyrics', weight: 0.35 },
          { name: 'album', weight: 0.15 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        includeMatches: true,
      }),
    [songs],
  )

  const albumGroups = useMemo(() => {
    const groups = {}
    songs.forEach((song) => {
      if (!isOfficialAlbum(song.album, song.title)) return
      const album = getCanonicalAlbum(song.album, song.title)
      if (!groups[album]) groups[album] = []
      const normalizedTitle = (song.title || '').trim().toLowerCase()
      if (!groups[album].some((item) => (item.title || '').trim().toLowerCase() === normalizedTitle)) {
        groups[album].push(song)
      }
    })
    return Object.entries(groups).sort(([albumA], [albumB]) => {
      const indexA = canonicalAlbums.indexOf(albumA)
      const indexB = canonicalAlbums.indexOf(albumB)
      if (indexA === -1 && indexB === -1) return albumA.localeCompare(albumB)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [songs])

  const searchResults = useMemo(
    () => (query.trim() ? fuse.search(query).map((result) => result.item) : []),
    [fuse, query],
  )

  const librarySongs = useMemo(() => {
    const unique = []
    songs.forEach((song) => {
      if (!isOfficialAlbum(song.album, song.title)) return
      const key = (song.title || '').trim().toLowerCase()
      if (!unique.some((item) => (item.title || '').trim().toLowerCase() === key)) unique.push(song)
    })
    return unique.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  }, [songs])

  if (selectedSong) {
    if (performanceMode) {
      return <PerformanceRecorder song={selectedSong} onClose={() => setPerformanceMode(false)} />
    }
    return (
      <main className="reader">
        <header className="reader-header">
          <button className="icon-button" type="button" onClick={() => setSelectedSong(null)} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <InstallButton isInstalled={isInstalled} installPrompt={installPrompt} onInstall={handleInstall} />
          <div className={`status-badge ${isOnline ? '' : 'offline'}`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </div>
        </header>
        <article className="lyrics-reader">
          <div className="reader-kicker">{selectedSong.album}</div>
          <h1>{selectedSong.title}</h1>
          {formatDuration(selectedSong.duration) && (
            <div className="reader-duration"><Clock3 size={15} />{formatDuration(selectedSong.duration)}</div>
          )}
          <button className="performance-launch" type="button" onClick={() => setPerformanceMode(true)}>
            <Video size={17} /> RECORD WITH LYRICS
          </button>
          <div className="lyrics">
            {(selectedSong.lyrics || 'Lyrics unavailable').split('\n').map((line, index) =>
              line.trim() ? <p key={index}>{line}</p> : <br key={index} />,
            )}
          </div>
        </article>
        <InstallHelpDialog platform={installHelpPlatform} onClose={() => setInstallHelpPlatform(null)} />
      </main>
    )
  }

  if (selectedAlbum) {
    const [albumName, albumSongs] = selectedAlbum
    return (
      <main className="album-page">
        <header className="topbar compact">
          <button className="icon-button" type="button" onClick={() => setSelectedAlbum(null)} aria-label="Back to albums">
            <ArrowLeft size={20} />
          </button>
          <InstallButton isInstalled={isInstalled} installPrompt={installPrompt} onInstall={handleInstall} />
          <div className={`status-badge ${isOnline ? '' : 'offline'}`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </div>
        </header>
        <section className="album-hero">
          <CoverArt album={albumName} size="hero" index={[...albumName].reduce((sum, char) => sum + char.charCodeAt(0), 0)} />
          <div className="album-hero-copy">
            <p>ALBUM</p>
            <h1>{albumName}</h1>
            <span>{albumSongs.length} {albumSongs.length === 1 ? 'TRACK' : 'TRACKS'} · MY CHEMICAL ROMANCE</span>
          </div>
        </section>
        <section className="track-section">
          <div className="section-label"><span>TRACKS</span><span>{albumSongs.length}</span></div>
          {albumSongs.map((song, index) => (
            <button className="track-row" type="button" key={song.id || `${song.title}-${index}`} onClick={() => setSelectedSong(song)}>
              <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="track-name">{song.title}</span>
              {formatDuration(song.duration) && <span className="track-time">{formatDuration(song.duration)}</span>}
            </button>
          ))}
        </section>
        <InstallHelpDialog platform={installHelpPlatform} onClose={() => setInstallHelpPlatform(null)} />
      </main>
    )
  }

  return (
    <main className="library">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Music2 size={20} /></div>
          <div><span>MCR</span><small>Lyrics Archive</small></div>
        </div>
        <div className={`status-badge ${isOnline ? '' : 'offline'}`}>
          {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </div>
        <InstallButton isInstalled={isInstalled} installPrompt={installPrompt} onInstall={handleInstall} />
      </header>

      <section className="jakarta-hero" aria-label="My Chemical Romance live in Jakarta illustration">
        <div className="jakarta-copy">
          <p>THE BLACK PARADE</p>
          <h1>LIVE IN <strong>JAKARTA</strong></h1>
          <span>MY CHEMICAL ROMANCE · LYRIC ARCHIVE</span>
        </div>
        <svg className="jakarta-art" viewBox="0 0 520 240" role="img" aria-label="Red Jakarta concert skyline">
          <circle className="sun" cx="365" cy="86" r="58" />
          <g className="birds">
            <path d="M76 70c10-9 20-9 30 0 10-9 20-9 30 0" />
            <path d="M145 45c7-6 14-6 21 0 7-6 14-6 21 0" />
          </g>
          <g className="skyline">
            <rect x="20" y="172" width="55" height="68" />
            <rect x="82" y="142" width="74" height="98" />
            <rect x="164" y="182" width="52" height="58" />
            <rect x="224" y="128" width="68" height="112" />
            <rect x="300" y="158" width="58" height="82" />
            <rect x="366" y="118" width="76" height="122" />
            <rect x="450" y="178" width="50" height="62" />
            <path d="M258 128v-36l10-12 10 12v36M400 118V82l10-12 10 12v36" />
          </g>
          <g className="stage">
            <path d="M72 218h360l22 22H50z" />
            <path d="M118 218l16-94h17l-9 94M384 218l-16-94h-17l9 94" />
            <rect x="132" y="112" width="238" height="8" />
          </g>
          <g className="crowd">
            <circle cx="116" cy="238" r="18" /><circle cx="154" cy="230" r="22" />
            <circle cx="198" cy="236" r="20" /><circle cx="242" cy="228" r="24" />
            <circle cx="286" cy="236" r="20" /><circle cx="330" cy="230" r="22" />
            <circle cx="374" cy="238" r="18" /><circle cx="414" cy="232" r="20" />
          </g>
        </svg>
      </section>

      <section className="library-heading">
        <p>COMPLETE DISCOGRAPHY</p>
        <h1>{query ? 'Search' : viewMode === 'library' ? 'Library' : 'Albums'}</h1>
      </section>

      <section className="search-wrap">
        <Search size={18} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search songs, lyrics, or albums"
          aria-label="Search lyrics"
        />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}
      </section>

      {loadError && <div className="load-error">{loadError}</div>}

      {query ? (
        <section className="search-results">
          <div className="result-count">{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}</div>
          {searchResults.map((song) => (
            <button className="result-row" type="button" key={song.id || song.title} onClick={() => setSelectedSong(song)}>
              <div>
                <h3>{song.title}</h3>
                <p>{song.album}</p>
                {getLyricSnippet(song.lyrics || '', query) && <span>{getLyricSnippet(song.lyrics || '', query)}</span>}
              </div>
              {formatDuration(song.duration) && <time>{formatDuration(song.duration)}</time>}
            </button>
          ))}
        </section>
      ) : viewMode === 'library' ? (
        <section className="search-results library-view" aria-label="All tracks">
          <div className="result-count">{librarySongs.length} tracks</div>
          {librarySongs.map((song) => (
            <button className="result-row" type="button" key={song.id || song.title} onClick={() => setSelectedSong(song)}>
              <div>
                <h3>{song.title}</h3>
                <p>{getCanonicalAlbum(song.album, song.title)}</p>
              </div>
              {formatDuration(song.duration) && <time>{formatDuration(song.duration)}</time>}
            </button>
          ))}
        </section>
      ) : (
        <section className="album-grid" aria-label="Albums">
          {albumGroups.map(([album, tracks], index) => (
            <button className="album-card" type="button" key={album} onClick={() => setSelectedAlbum([album, tracks])}>
              <CoverArt album={album} index={index} />
              <div className="album-card-copy">
                <h2>{album}</h2>
                <p>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</p>
              </div>
            </button>
          ))}
        </section>
      )}

      <footer className="credits">
        <span>LYRICS DATA</span>
        <a href="https://lrclib.net/" target="_blank" rel="noreferrer">LRCLIB</a>
        <p>Thanks to LRCLIB and its contributors for making lyrics data available.</p>
      </footer>

      <nav className="mobile-nav" aria-label="Primary navigation">
        <button type="button" className={!query && viewMode === 'albums' ? 'active' : ''} onClick={() => { setQuery(''); setViewMode('albums') }}><Disc3 size={20} /><span>Albums</span></button>
        <button type="button" className={query ? 'active' : ''} onClick={() => { setViewMode('search'); document.querySelector('.search-wrap input')?.focus() }}><Search size={20} /><span>Search</span></button>
        <button type="button" className={!query && viewMode === 'library' ? 'active' : ''} onClick={() => { setQuery(''); setViewMode('library'); setSelectedAlbum(null) }}><ListMusic size={20} /><span>Library</span></button>
      </nav>

      <InstallHelpDialog platform={installHelpPlatform} onClose={() => setInstallHelpPlatform(null)} />
    </main>
  )
}

export default App
