"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { StreamDeck } from "@/components/stream-deck"
import { PlatformGrid } from "@/components/platform-grid"
import { MusicPlayer } from "@/components/music-player"
import { VideoManager } from "@/components/video-manager"
import { LiveStats } from "@/components/live-stats"
import { DraggableWindow } from "@/components/draggable-window"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Play,
  Square,
  Settings,
  BarChart3,
  Music,
  Video,
  MessageSquare,
  Monitor,
  Smartphone,
  Tablet,
  Plus,
  Heart,
  Mic,
  Headphones,
  Camera,
  Layout,
  Twitch,
  Youtube,
  Facebook,
  MessageCircle,
  Layers,
  Sliders,
  Save,
  Share2,
  Globe,
} from "lucide-react"

import { StreamPlaylist } from "@/components/stream-playlist"
import { StreamLayoutManager } from "@/components/stream-layout-manager"

interface Platform {
  id: string
  name: string
  logo: string
  icon: React.ReactNode
  viewers: number
  isLive: boolean
  chatMessages: number
  streamKeys: string[]
  activeKeyIndex: number
  audioSettings: {
    micEnabled: boolean
    micVolume: number
    outputEnabled: boolean
    outputVolume: number
  }
  videoSettings: {
    webcamEnabled: boolean
    webcamQuality: string
    streamQuality: string
    bitrate: number
    fps: number
  }
}

export default function Ustream4Free() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "twitch",
      name: "Twitch",
      logo: "🟣",
      icon: <Twitch className="h-4 w-4 text-purple-400" />,
      viewers: 1247,
      isLive: true,
      chatMessages: 89,
      streamKeys: ["", "", "", "", ""],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: true,
        micVolume: 75,
        outputEnabled: true,
        outputVolume: 80,
      },
      videoSettings: {
        webcamEnabled: true,
        webcamQuality: "1080p60",
        streamQuality: "1080p60",
        bitrate: 6000,
        fps: 60,
      },
    },
    {
      id: "youtube",
      name: "YouTube",
      logo: "🔴",
      icon: <Youtube className="h-4 w-4 text-red-500" />,
      viewers: 892,
      isLive: true,
      chatMessages: 56,
      streamKeys: ["", "", "", "", ""],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: true,
        micVolume: 70,
        outputEnabled: true,
        outputVolume: 75,
      },
      videoSettings: {
        webcamEnabled: true,
        webcamQuality: "1080p30",
        streamQuality: "1440p30",
        bitrate: 6000,
        fps: 30,
      },
    },
    {
      id: "facebook",
      name: "Facebook",
      logo: "🔵",
      icon: <Facebook className="h-4 w-4 text-blue-500" />,
      viewers: 0,
      isLive: false,
      chatMessages: 0,
      streamKeys: ["", "", "", "", ""],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: false,
        micVolume: 65,
        outputEnabled: true,
        outputVolume: 70,
      },
      videoSettings: {
        webcamEnabled: false,
        webcamQuality: "720p30",
        streamQuality: "720p30",
        bitrate: 2500,
        fps: 30,
      },
    },
    {
      id: "tiktok",
      name: "TikTok",
      logo: "⚫",
      icon: <Video className="h-4 w-4 text-black bg-white rounded-full p-0.5" />,
      viewers: 2156,
      isLive: true,
      chatMessages: 134,
      streamKeys: ["", "", "", "", ""],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: true,
        micVolume: 85,
        outputEnabled: true,
        outputVolume: 85,
      },
      videoSettings: {
        webcamEnabled: true,
        webcamQuality: "720p60",
        streamQuality: "4k30",
        bitrate: 13000,
        fps: 30,
      },
    },
    {
      id: "discord",
      name: "Discord",
      logo: "🟦",
      icon: <MessageCircle className="h-4 w-4 text-indigo-400" />,
      viewers: 45,
      isLive: true,
      chatMessages: 23,
      streamKeys: ["", "", "", "", ""],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: true,
        micVolume: 80,
        outputEnabled: true,
        outputVolume: 90,
      },
      videoSettings: {
        webcamEnabled: true,
        webcamQuality: "1080p60",
        streamQuality: "1080p60",
        bitrate: 6000,
        fps: 60,
      },
    },
    {
      id: "kick",
      name: "Kick",
      logo: "🟢",
      icon: <Video className="h-4 w-4 text-green-500" />,
      viewers: 0,
      isLive: false,
      chatMessages: 0,
      streamKeys: ["", "", "", "", ""],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: false,
        micVolume: 60,
        outputEnabled: false,
        outputVolume: 60,
      },
      videoSettings: {
        webcamEnabled: false,
        webcamQuality: "720p30",
        streamQuality: "720p30",
        bitrate: 2500,
        fps: 30,
      },
    },
  ])

  const [totalStats, setTotalStats] = useState({
    totalViewers: 0,
    activePlatforms: 0,
    totalMessages: 0,
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [showAddPlatformModal, setShowAddPlatformModal] = useState(false)
  const [newPlatformName, setNewPlatformName] = useState("")

  const [currentMedia, setCurrentMedia] = useState<any>(null)
  const [showLayoutManager, setShowLayoutManager] = useState(false)
  const [activeTab, setActiveTab] = useState("stream")

  // Real-time updates via WebSocket (simulated for now)
  useEffect(() => {
    // In a real implementation, this would connect to a WebSocket server
    // for real-time statistics from actual streaming platforms
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate viewer count changes
      setPlatforms((prev) =>
        prev.map((platform) => ({
          ...platform,
          viewers: platform.isLive ? platform.viewers + Math.floor(Math.random() * 10 - 5) : 0,
          chatMessages: platform.isLive ? platform.chatMessages + Math.floor(Math.random() * 3) : 0,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Calculate total stats
  useEffect(() => {
    const stats = platforms.reduce(
      (acc, platform) => ({
        totalViewers: acc.totalViewers + (platform.isLive ? Math.max(0, platform.viewers) : 0),
        activePlatforms: acc.activePlatforms + (platform.isLive ? 1 : 0),
        totalMessages: acc.totalMessages + platform.chatMessages,
      }),
      { totalViewers: 0, activePlatforms: 0, totalMessages: 0 },
    )

    setTotalStats(stats)
  }, [platforms])

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      if (width < 768) setDeviceType("mobile")
      else if (width < 1024) setDeviceType("tablet")
      else setDeviceType("desktop")
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming)
    // Update platform live status
    setPlatforms((prev) =>
      prev.map((platform) => ({
        ...platform,
        isLive: !isStreaming ? true : Math.random() > 0.3,
      })),
    )
  }

  const addNewPlatform = () => {
    setShowAddPlatformModal(true)
  }

  const createNewPlatform = () => {
    if (newPlatformName.trim()) {
      const newPlatform: Platform = {
        id: `custom-${Date.now()}`,
        name: newPlatformName.trim(),
        logo: "🌐",
        icon: <Globe className="h-4 w-4 text-blue-400" />,
        viewers: 0,
        isLive: false,
        chatMessages: 0,
        streamKeys: ["", "", "", "", ""],
        activeKeyIndex: 0,
        audioSettings: {
          micEnabled: false,
          micVolume: 50,
          outputEnabled: false,
          outputVolume: 50,
        },
        videoSettings: {
          webcamEnabled: false,
          webcamQuality: "720p30",
          streamQuality: "720p30",
          bitrate: 2500,
          fps: 30,
        },
      }

      setPlatforms([...platforms, newPlatform])
      setNewPlatformName("")
      setShowAddPlatformModal(false)
    }
  }

  const removePlatform = (platformId: string) => {
    // Only allow removal of custom platforms (those with IDs starting with "custom-")
    if (platformId.startsWith("custom-")) {
      setPlatforms(platforms.filter((p) => p.id !== platformId))
    }
  }

  // Audio/Video settings change handlers
  const handleAudioSettingsChange = (platformId: string, newSettings: any) => {
    setPlatforms((prev) =>
      prev.map((platform) =>
        platform.id === platformId
          ? {
              ...platform,
              audioSettings: newSettings,
            }
          : platform,
      ),
    )
  }

  const handleVideoSettingsChange = (platformId: string, newSettings: any) => {
    setPlatforms((prev) =>
      prev.map((platform) =>
        platform.id === platformId
          ? {
              ...platform,
              videoSettings: newSettings,
            }
          : platform,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/images/ustream-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className="relative z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Ustream4Free.com
              </h1>
              <Badge variant={isStreaming ? "destructive" : "secondary"} className="text-sm">
                {isStreaming ? "🔴 LIVE" : "⚫ OFFLINE"}
              </Badge>
            </div>

            {/* Device Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                {deviceType === "desktop" && <Monitor className="h-4 w-4" />}
                {deviceType === "tablet" && <Tablet className="h-4 w-4" />}
                {deviceType === "mobile" && <Smartphone className="h-4 w-4" />}
                <span className="capitalize">{deviceType}</span>
              </div>
              <div className="text-xs text-gray-400">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-3 border-b border-gray-800 pb-2">
            <Button
              size="sm"
              variant={activeTab === "stream" ? "default" : "ghost"}
              className={
                activeTab === "stream"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "text-purple-400 hover:text-purple-300 hover:bg-purple-900/50"
              }
              onClick={() => setActiveTab("stream")}
            >
              <Video className="h-4 w-4 mr-2" />
              Stream
            </Button>
            <Button
              size="sm"
              variant={activeTab === "audio" ? "default" : "ghost"}
              className={
                activeTab === "audio"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
              }
              onClick={() => setActiveTab("audio")}
            >
              <Mic className="h-4 w-4 mr-2" />
              Audio
            </Button>
            <Button
              size="sm"
              variant={activeTab === "video" ? "default" : "ghost"}
              className={
                activeTab === "video"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "text-green-400 hover:text-green-300 hover:bg-green-900/50"
              }
              onClick={() => setActiveTab("video")}
            >
              <Camera className="h-4 w-4 mr-2" />
              Video
            </Button>
            <Button
              size="sm"
              variant={activeTab === "layout" ? "default" : "ghost"}
              className={
                activeTab === "layout"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "text-orange-400 hover:text-orange-300 hover:bg-orange-900/50"
              }
              onClick={() => {
                setActiveTab("layout")
                setShowLayoutManager(true)
              }}
            >
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </Button>
            <Button
              size="sm"
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className={
                activeTab === "analytics"
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/50"
              }
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              size="sm"
              variant={activeTab === "chat" ? "default" : "ghost"}
              className={
                activeTab === "chat"
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "text-pink-400 hover:text-pink-300 hover:bg-pink-900/50"
              }
              onClick={() => setActiveTab("chat")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              size="sm"
              variant={activeTab === "settings" ? "default" : "ghost"}
              className={
                activeTab === "settings"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              size="sm"
              onClick={toggleStreaming}
              className={
                isStreaming ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              {isStreaming ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </Button>

            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => console.log("Microphone toggled")}
            >
              <Mic className="h-4 w-4 mr-1" />
              Microphone
            </Button>

            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => console.log("Audio output toggled")}
            >
              <Headphones className="h-4 w-4 mr-1" />
              Audio Output
            </Button>

            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => console.log("Webcam toggled")}
            >
              <Camera className="h-4 w-4 mr-1" />
              Webcam
            </Button>

            <Button
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => setActiveTab("music")}
            >
              <Music className="h-4 w-4 mr-1" />
              Music Player
            </Button>

            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => console.log("Scenes opened")}
            >
              <Layers className="h-4 w-4 mr-1" />
              Scenes
            </Button>

            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => console.log("Audio mixer opened")}
            >
              <Sliders className="h-4 w-4 mr-1" />
              Audio Mixer
            </Button>

            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => console.log("Recording started")}
            >
              <Save className="h-4 w-4 mr-1" />
              Record
            </Button>

            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => console.log("Share options opened")}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>

            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={addNewPlatform}>
              <Plus className="h-4 w-4 mr-1" />
              Add Platform
            </Button>
          </div>

          {/* Platform Quick Access */}
          <div className="flex flex-wrap gap-2 mt-3">
            {platforms.map((platform) => (
              <Button
                key={platform.id}
                size="sm"
                variant={platform.isLive ? "default" : "outline"}
                className={
                  platform.isLive
                    ? platform.id === "twitch"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : platform.id === "youtube"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : platform.id === "facebook"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : platform.id === "tiktok"
                            ? "bg-black hover:bg-gray-900 text-white"
                            : platform.id === "discord"
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : platform.id === "kick"
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-600 hover:bg-gray-700 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                }
                onClick={() => {
                  setPlatforms((prev) => prev.map((p) => (p.id === platform.id ? { ...p, isLive: !p.isLive } : p)))
                }}
              >
                {platform.icon}
                <span className="ml-1">{platform.name}</span>
                {platform.isLive && <span className="ml-1 animate-pulse">●</span>}
                <Badge variant="outline" className="ml-2 text-xs border-purple-500 text-purple-400">
                  {platform.videoSettings.streamQuality}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        {/* Live Statistics Bar */}
        <LiveStats stats={totalStats} isStreaming={isStreaming} />

        {/* Stream Deck */}
        <StreamDeck isStreaming={isStreaming} onToggleStream={toggleStreaming} />

        {/* Platform Grid */}
        <PlatformGrid
          platforms={platforms}
          setPlatforms={setPlatforms}
          deviceType={deviceType}
          onRemovePlatform={removePlatform}
        />

        {/* Music Player */}
        <MusicPlayer />

        {/* Video Manager */}
        <VideoManager />

        {/* Combined Chat+Video Windows for Live Platforms */}
        {platforms
          .filter((p) => p.isLive)
          .map((platform, index) => (
            <DraggableWindow
              key={`combined-${platform.id}`}
              title={`${platform.name} Chat & Video`}
              defaultPosition={{ x: 50 + index * 30, y: 100 + index * 30 }}
              defaultSize={{ width: 400, height: 500 }}
              platform={platform}
              type="combined"
              onAudioSettingsChange={handleAudioSettingsChange}
              onVideoSettingsChange={handleVideoSettingsChange}
            />
          ))}

        {/* Stream Playlist */}
        <StreamPlaylist onMediaChange={setCurrentMedia} isStreamingToLayout={isStreaming} />

        {/* Stream Layout Manager */}
        {showLayoutManager && (
          <StreamLayoutManager
            onLayoutChange={(elements) => {
              console.log("Layout updated:", elements)
            }}
          />
        )}
      </main>

      {/* Donation Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDonateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg text-white"
        >
          <Heart className="h-4 w-4 mr-2" />
          Support Ustream4Free
        </Button>
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Support Ustream4Free</h2>
            <p className="text-gray-300 mb-6">
              Ustream4Free is completely free for everyone! Your donation helps us keep the servers running and develop
              new features.
            </p>
            <div className="space-y-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  window.open(`https://www.paypal.com/paypalme/nyallday82`, "_blank")
                }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Donate via PayPal
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setShowDonateModal(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Platform Modal */}
      {showAddPlatformModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Platform</h2>
            <p className="text-gray-300 mb-6">Enter a name for your custom streaming platform.</p>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Platform name (e.g., Custom RTMP, Local Server)"
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                onKeyPress={(e) => e.key === "Enter" && createNewPlatform()}
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={createNewPlatform}
                  disabled={!newPlatformName.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Platform
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    setShowAddPlatformModal(false)
                    setNewPlatformName("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* AI Maintenance Indicator */}
      <div className="fixed bottom-4 left-4 z-50">
        <Card className="bg-blue-900/90 backdrop-blur-md border-blue-700 p-3">
          <div className="flex items-center gap-2 text-blue-200 text-sm">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI maintenance active - Optimizing performance</span>
          </div>
        </Card>
      </div>

      {/* Mobile Optimization Notice */}
      {deviceType === "mobile" && (
        <div className="fixed bottom-16 left-4 right-4 z-50">
          <Card className="bg-blue-900/90 backdrop-blur-md border-blue-700 p-3">
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Smartphone className="h-4 w-4" />
              <span>Mobile optimized interface active</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
