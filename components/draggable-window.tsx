"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Minimize2,
  MessageCircle,
  Video,
  Maximize2,
  Mic,
  Volume2,
  VolumeX,
  VideoOff,
  Eye,
  EyeOff,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface DraggableWindowProps {
  title: string
  defaultPosition: { x: number; y: number }
  defaultSize: { width: number; height: number }
  platform: {
    id: string
    name: string
    logo: string
    viewers: number
    chatMessages: number
    audioSettings?: {
      micEnabled: boolean
      micVolume: number
      outputEnabled: boolean
      outputVolume: number
    }
    videoSettings?: {
      webcamEnabled: boolean
      webcamQuality: string
    }
  }
  type: "chat" | "video" | "combined"
  onAudioSettingsChange?: (platformId: string, settings: any) => void
  onVideoSettingsChange?: (platformId: string, settings: any) => void
}

export function DraggableWindow({
  title,
  defaultPosition,
  defaultSize,
  platform,
  type: initialType,
  onAudioSettingsChange,
  onVideoSettingsChange,
}: DraggableWindowProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [chatMessages, setChatMessages] = useState([
    { user: "StreamBot", message: `Welcome to ${platform.name}!`, time: "12:34" },
    { user: "Viewer123", message: "Great stream!", time: "12:35" },
    { user: "ChatMaster", message: "Love this platform!", time: "12:36" },
  ])
  const [showAudioControls, setShowAudioControls] = useState(false)
  const [showVideo, setShowVideo] = useState(initialType === "video" || initialType === "combined")
  const [showChat, setShowChat] = useState(initialType === "chat" || initialType === "combined")
  const [viewModeState, setViewModeState] = useState<"chat" | "video" | "split">("split")

  // Default audio/video settings if not provided
  const audioSettings = platform.audioSettings || {
    micEnabled: true,
    micVolume: 75,
    outputEnabled: true,
    outputVolume: 75,
  }

  const videoSettings = platform.videoSettings || {
    webcamEnabled: true,
    webcamQuality: "1080p60",
  }

  const windowRef = useRef<HTMLDivElement>(null)

  // Add these new state variables after the existing ones
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [resizeDirection, setResizeDirection] = useState("se")

  // Platform-specific emotes
  const platformEmotes = {
    twitch: ["Kappa", "PogChamp", "LUL", "BibleThump", "TriHard"],
    youtube: ["😂", "❤️", "👍", "🔥", "🎮"],
    facebook: ["😊", "👏", "😮", "❤️", "😆"],
    tiktok: ["🔥", "❤️", "✨", "😂", "👑"],
    discord: ["🎮", "👾", "🤖", "💻", "🎯"],
    kick: ["🚀", "🎯", "🏆", "💪", "🎮"],
  }

  const getRandomEmote = () => {
    const emotes = platformEmotes[platform.id as keyof typeof platformEmotes] || ["😀", "👍", "❤️", "🔥", "🎮"]
    return emotes[Math.floor(Math.random() * emotes.length)]
  }

  useEffect(() => {
    // Simulate real-time chat messages
    const interval = setInterval(() => {
      const messages = [
        `Amazing stream! ${getRandomEmote()}`,
        "Keep it up!",
        "First time here!",
        `Love the quality! ${getRandomEmote()}`,
        "When is the next stream?",
        `This is so cool! ${getRandomEmote()}`,
        "Can you turn on your camera?",
        "Video looks great!",
        "Audio is perfect!",
      ]
      const users = ["ChatUser", "StreamFan", "Viewer" + Math.floor(Math.random() * 1000)]

      if (Math.random() < 0.4) {
        const newMessage = {
          user: users[Math.floor(Math.random() * users.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        }
        setChatMessages((prev) => [...prev.slice(-20), newMessage])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [platform.id])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".drag-handle")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction = "se") => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // Allow movement anywhere on screen, including negative positions
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      let newX = position.x
      let newY = position.y

      // Handle different resize directions
      if (resizeDirection.includes("e")) newWidth = Math.max(250, resizeStart.width + deltaX)
      if (resizeDirection.includes("w")) {
        newWidth = Math.max(250, resizeStart.width - deltaX)
        newX = position.x + (resizeStart.width - newWidth)
      }
      if (resizeDirection.includes("s")) newHeight = Math.max(200, resizeStart.height + deltaY)
      if (resizeDirection.includes("n")) {
        newHeight = Math.max(200, resizeStart.height - deltaY)
        newY = position.y + (resizeStart.height - newHeight)
      }

      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  // Add touch event handlers after the existing mouse handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".drag-handle")) {
      const touch = e.touches[0]
      setIsTouchDragging(true)
      setTouchStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isTouchDragging) {
      e.preventDefault()
      const touch = e.touches[0]
      // Allow movement anywhere on screen for touch devices
      setPosition({
        x: touch.clientX - touchStart.x,
        y: touch.clientY - touchStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    setIsTouchDragging(false)
  }

  // Update the useEffect for event listeners to include touch events
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }

    if (isTouchDragging) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
      return () => {
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, isResizing, isTouchDragging])

  const toggleFullscreen = () => {
    if (size.width < window.innerWidth * 0.8) {
      // Expand
      setPosition({
        x: window.innerWidth * 0.1,
        y: window.innerHeight * 0.1,
      })
      setSize({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      })
    } else {
      // Restore
      setPosition(defaultPosition)
      setSize(defaultSize)
    }
  }

  // Audio/Video control functions
  const toggleMicrophone = () => {
    const newSettings = {
      ...audioSettings,
      micEnabled: !audioSettings.micEnabled,
    }

    if (onAudioSettingsChange) {
      onAudioSettingsChange(platform.id, newSettings)
    }
  }

  const setMicrophoneVolume = (volume: number) => {
    const newSettings = {
      ...audioSettings,
      micVolume: volume,
    }

    if (onAudioSettingsChange) {
      onAudioSettingsChange(platform.id, newSettings)
    }
  }

  const toggleOutput = () => {
    const newSettings = {
      ...audioSettings,
      outputEnabled: !audioSettings.outputEnabled,
    }

    if (onAudioSettingsChange) {
      onAudioSettingsChange(platform.id, newSettings)
    }
  }

  const setOutputVolume = (volume: number) => {
    const newSettings = {
      ...audioSettings,
      outputVolume: volume,
    }

    if (onAudioSettingsChange) {
      onAudioSettingsChange(platform.id, newSettings)
    }
  }

  const toggleWebcam = () => {
    const newSettings = {
      ...videoSettings,
      webcamEnabled: !videoSettings.webcamEnabled,
    }

    if (onVideoSettingsChange) {
      onVideoSettingsChange(platform.id, newSettings)
    }
  }

  const toggleVideoView = () => {
    setShowVideo(!showVideo)
    if (!showVideo && !showChat) {
      setShowChat(true)
    }
  }

  const toggleChatView = () => {
    setShowChat(!showChat)
    if (!showChat && !showVideo) {
      setShowVideo(true)
    }
  }

  const updateViewMode = (mode: "chat" | "video" | "split") => {
    setViewModeState(mode)
    switch (mode) {
      case "chat":
        setShowChat(true)
        setShowVideo(false)
        break
      case "video":
        setShowVideo(true)
        setShowChat(false)
        break
      case "split":
        setShowVideo(true)
        setShowChat(true)
        break
    }
  }

  if (!isVisible) return null

  return (
    <div
      ref={windowRef}
      className="fixed z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? "auto" : size.height,
        minWidth: 250,
        minHeight: isMinimized ? "auto" : 200,
      }}
    >
      <Card className="bg-gray-900/95 backdrop-blur-md border-gray-600 shadow-2xl h-full flex flex-col">
        {/* Update the CardHeader to include touch events */}
        <CardHeader
          className="pb-2 cursor-move drag-handle bg-gray-800/50 touch-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white text-sm">
              <MessageCircle className="h-4 w-4" />
              <span className="text-lg">{platform.logo}</span>
              {title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/50"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/50"
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPosition({ x: 50, y: 50 })
                  setSize(defaultSize)
                }}
                className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/50"
                title="Reset position and size"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Platform Stats and View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>👥 {platform.viewers.toLocaleString()}</span>
              <span>💬 {platform.chatMessages}</span>
              <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                LIVE
              </Badge>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={viewModeState === "chat" ? "default" : "ghost"}
                className={
                  viewModeState === "chat"
                    ? "h-6 px-2 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    : "h-6 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/50"
                }
                onClick={() => updateViewMode("chat")}
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={viewModeState === "split" ? "default" : "ghost"}
                className={
                  viewModeState === "split"
                    ? "h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    : "h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
                }
                onClick={() => updateViewMode("split")}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={viewModeState === "video" ? "default" : "ghost"}
                className={
                  viewModeState === "video"
                    ? "h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                    : "h-6 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-900/50"
                }
                onClick={() => updateViewMode("video")}
              >
                <Video className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Video Section */}
              {showVideo && (
                <div className={`${showChat ? "h-1/2" : "h-full"} bg-black flex flex-col border-b border-gray-700`}>
                  {/* Video Content */}
                  <div className="flex-1 flex items-center justify-center text-gray-400 relative">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{platform.logo}</div>
                      <div className="text-lg font-medium text-white">{platform.name}</div>
                      <div className="text-sm">{videoSettings.webcamEnabled ? "Live Stream" : "Webcam Disabled"}</div>
                      <Badge className="bg-red-600 mt-2 animate-pulse">BROADCASTING</Badge>
                    </div>

                    {/* Video Toggle Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-900/50 hover:bg-red-800/70 text-red-400 hover:text-red-300"
                      onClick={() => setShowVideo(false)}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Video Controls */}
                  <div className="bg-gray-900/80 p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className={
                            audioSettings.micEnabled
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          }
                          onClick={toggleMicrophone}
                        >
                          {audioSettings.micEnabled ? "🎤" : "🔇"}
                        </Button>
                        <Button
                          size="sm"
                          className={
                            videoSettings.webcamEnabled
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          }
                          onClick={toggleWebcam}
                        >
                          {videoSettings.webcamEnabled ? "📹" : <VideoOff className="h-4 w-4" />}
                        </Button>

                        {/* Quality Selector */}
                        <select
                          className="bg-gray-800 border border-gray-600 text-white text-xs px-2 py-1 rounded"
                          value={videoSettings.webcamQuality}
                          onChange={(e) => {
                            if (onVideoSettingsChange) {
                              onVideoSettingsChange(platform.id, {
                                ...videoSettings,
                                webcamQuality: e.target.value,
                              })
                            }
                          }}
                        >
                          <option value="260p30">260p</option>
                          <option value="360p30">360p</option>
                          <option value="480p30">480p</option>
                          <option value="720p30">720p</option>
                          <option value="720p60">720p60</option>
                          <option value="1080p30">1080p</option>
                          <option value="1080p60">1080p60</option>
                          <option value="1440p30">1440p</option>
                          <option value="1440p60">1440p60</option>
                          <option value="4k30">4K</option>
                          <option value="4k60">4K60</option>
                          <option value="8k30">8K</option>
                          <option value="8k60">8K60</option>
                        </select>
                      </div>
                      <div className="text-xs text-gray-400">
                        {videoSettings.webcamQuality} • {Math.floor(Math.random() * 60 + 30)} min
                      </div>
                      <Button
                        size="sm"
                        className={
                          showAudioControls
                            ? "text-xs bg-orange-600 hover:bg-orange-700 text-white"
                            : "text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }
                        onClick={() => setShowAudioControls(!showAudioControls)}
                      >
                        Audio
                      </Button>
                    </div>

                    {/* Audio Controls (expandable) */}
                    {showAudioControls && (
                      <div className="space-y-2 bg-gray-800/50 p-2 rounded-md">
                        {/* Microphone Volume */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mic className="h-3 w-3 text-blue-400" />
                              <span className="text-xs text-white">Mic</span>
                            </div>
                            <Switch checked={audioSettings.micEnabled} onCheckedChange={toggleMicrophone} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-8">{audioSettings.micVolume}%</span>
                            <Slider
                              value={[audioSettings.micVolume]}
                              min={0}
                              max={100}
                              step={1}
                              className="flex-1"
                              onValueChange={(value) => setMicrophoneVolume(value[0])}
                              disabled={!audioSettings.micEnabled}
                            />
                          </div>
                        </div>

                        {/* Output Volume */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {audioSettings.outputEnabled ? (
                                <Volume2 className="h-3 w-3 text-green-400" />
                              ) : (
                                <VolumeX className="h-3 w-3 text-red-400" />
                              )}
                              <span className="text-xs text-white">Output</span>
                            </div>
                            <Switch checked={audioSettings.outputEnabled} onCheckedChange={toggleOutput} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-8">{audioSettings.outputVolume}%</span>
                            <Slider
                              value={[audioSettings.outputVolume]}
                              min={0}
                              max={100}
                              step={1}
                              className="flex-1"
                              onValueChange={(value) => setOutputVolume(value[0])}
                              disabled={!audioSettings.outputEnabled}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Section */}
              {showChat && (
                <div className={`${showVideo ? "h-1/2" : "h-full"} flex flex-col`}>
                  {/* Chat Header with Video Toggle */}
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 border-b border-gray-700">
                    <span className="text-sm font-medium text-white">Chat</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={
                        showVideo
                          ? "h-6 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/50"
                          : "h-6 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-900/50"
                      }
                      onClick={toggleVideoView}
                    >
                      {showVideo ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {showVideo ? "Hide Video" : "Show Video"}
                    </Button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-purple-400">{msg.user}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <div className="text-sm text-white">{msg.message}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 border-t border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            const newMessage = {
                              user: "You",
                              message: e.currentTarget.value,
                              time: new Date().toLocaleTimeString("en-US", {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                            }
                            setChatMessages((prev) => [...prev.slice(-20), newMessage])
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Send
                      </Button>
                    </div>

                    {/* Emote Picker */}
                    <div className="mt-2 flex gap-1 overflow-x-auto py-1">
                      {(
                        platformEmotes[platform.id as keyof typeof platformEmotes] || ["😀", "👍", "❤️", "🔥", "🎮"]
                      ).map((emote, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="px-2 py-1 h-8 min-w-8 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/50"
                          onClick={() => {
                            const input = document.querySelector("input") as HTMLInputElement
                            if (input) {
                              input.value += ` ${emote} `
                              input.focus()
                            }
                          }}
                        >
                          {emote}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {/* Multiple Resize Handles */}
        {!isMinimized && (
          <>
            {/* Corner resize handles */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-600/50 hover:bg-blue-500 rounded-tl-sm"
              onMouseDown={handleResizeStart}
              title="Resize"
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize bg-blue-600/50 hover:bg-blue-500 rounded-bl-sm"
              onMouseDown={(e) => handleResizeStart(e, "ne")}
              title="Resize"
            />
            <div
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize bg-blue-600/50 hover:bg-blue-500 rounded-br-sm"
              onMouseDown={(e) => handleResizeStart(e, "nw")}
              title="Resize"
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-blue-600/50 hover:bg-blue-500 rounded-tr-sm"
              onMouseDown={(e) => handleResizeStart(e, "sw")}
              title="Resize"
            />

            {/* Edge resize handles */}
            <div
              className="absolute top-0 left-4 right-4 h-2 cursor-n-resize bg-blue-600/30 hover:bg-blue-500/50"
              onMouseDown={(e) => handleResizeStart(e, "n")}
              title="Resize vertically"
            />
            <div
              className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize bg-blue-600/30 hover:bg-blue-500/50"
              onMouseDown={(e) => handleResizeStart(e, "s")}
              title="Resize vertically"
            />
            <div
              className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize bg-blue-600/30 hover:bg-blue-500/50"
              onMouseDown={(e) => handleResizeStart(e, "w")}
              title="Resize horizontally"
            />
            <div
              className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize bg-blue-600/30 hover:bg-blue-500/50"
              onMouseDown={(e) => handleResizeStart(e, "e")}
              title="Resize horizontally"
            />
          </>
        )}
      </Card>
    </div>
  )
}
