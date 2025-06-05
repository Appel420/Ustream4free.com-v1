"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Square,
  Mic,
  Video,
  Monitor,
  Music,
  Zap,
  Settings,
  ImageIcon,
  Volume2,
  VolumeX,
  MessageCircle,
  Bell,
  Gift,
  Heart,
  Smile,
  Camera,
  Maximize,
  Minimize,
  RefreshCw,
  Layers,
  Scissors,
  Coffee,
  Cpu,
  Database,
  Download,
  Upload,
  Eye,
  EyeOff,
  Filter,
  Flag,
  Flame,
  Gamepad2,
  Headphones,
  Layout,
  Lightbulb,
  Link,
  List,
  Lock,
  Map,
  Megaphone,
  Palette,
  Pencil,
  PictureInPicture,
  Rocket,
  Share2,
  Shield,
  Sparkles,
  Star,
  Sticker,
  Timer,
  Trophy,
  Tv2,
  Wand2,
  Waves,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StreamDeckProps {
  isStreaming: boolean
  onToggleStream: () => void
}

// Define all available actions for the stream deck
const availableActions = [
  { key: "stream", icon: Play, label: "Go Live", description: "Start/Stop streaming" },
  { key: "mic", icon: Mic, label: "Microphone", description: "Toggle microphone" },
  { key: "camera", icon: Video, label: "Camera", description: "Toggle camera" },
  { key: "screen", icon: Monitor, label: "Screen Share", description: "Share your screen" },
  { key: "music", icon: Music, label: "Music", description: "Control music player" },
  { key: "effects", icon: Zap, label: "Effects", description: "Toggle visual effects" },
  { key: "scene1", icon: ImageIcon, label: "Scene 1", description: "Switch to scene 1" },
  { key: "scene2", icon: ImageIcon, label: "Scene 2", description: "Switch to scene 2" },
  { key: "scene3", icon: ImageIcon, label: "Scene 3", description: "Switch to scene 3" },
  { key: "volume_up", icon: Volume2, label: "Volume Up", description: "Increase volume" },
  { key: "volume_down", icon: VolumeX, label: "Volume Down", description: "Decrease volume" },
  { key: "chat", icon: MessageCircle, label: "Chat Mode", description: "Focus on chat" },
  { key: "alert", icon: Bell, label: "Alert", description: "Show an alert" },
  { key: "donation", icon: Gift, label: "Donation", description: "Show donation info" },
  { key: "like", icon: Heart, label: "Like Animation", description: "Show like animation" },
  { key: "emote", icon: Smile, label: "Emote Mode", description: "Emote-only chat" },
  { key: "snapshot", icon: Camera, label: "Snapshot", description: "Take a screenshot" },
  { key: "fullscreen", icon: Maximize, label: "Fullscreen", description: "Toggle fullscreen" },
  { key: "minimize", icon: Minimize, label: "Minimize", description: "Minimize windows" },
  { key: "refresh", icon: RefreshCw, label: "Refresh", description: "Refresh sources" },
  { key: "layers", icon: Layers, label: "Layers", description: "Manage layers" },
  { key: "cut", icon: Scissors, label: "Cut Scene", description: "Cut to next scene" },
  { key: "break", icon: Coffee, label: "Break", description: "Show break screen" },
  { key: "performance", icon: Cpu, label: "Performance", description: "Show performance stats" },
  { key: "save", icon: Database, label: "Save", description: "Save current settings" },
  { key: "download", icon: Download, label: "Download", description: "Download recording" },
  { key: "upload", icon: Upload, label: "Upload", description: "Upload media" },
  { key: "visibility", icon: Eye, label: "Visibility", description: "Toggle element visibility" },
  { key: "hide", icon: EyeOff, label: "Hide", description: "Hide elements" },
  { key: "filter", icon: Filter, label: "Filter", description: "Apply video filter" },
  { key: "flag", icon: Flag, label: "Flag", description: "Flag content" },
  { key: "highlight", icon: Flame, label: "Highlight", description: "Create highlight" },
  { key: "game", icon: Gamepad2, label: "Game Mode", description: "Optimize for gaming" },
  { key: "audio", icon: Headphones, label: "Audio", description: "Audio settings" },
  { key: "layout", icon: Layout, label: "Layout", description: "Change layout" },
  { key: "light", icon: Lightbulb, label: "Lighting", description: "Adjust lighting" },
  { key: "link", icon: Link, label: "Link", description: "Share link in chat" },
  { key: "list", icon: List, label: "List", description: "Show list" },
  { key: "lock", icon: Lock, label: "Lock", description: "Lock settings" },
  { key: "map", icon: Map, label: "Map", description: "Show map" },
  { key: "announce", icon: Megaphone, label: "Announce", description: "Make announcement" },
  { key: "theme", icon: Palette, label: "Theme", description: "Change theme" },
  { key: "edit", icon: Pencil, label: "Edit Mode", description: "Enter edit mode" },
  { key: "pip", icon: PictureInPicture, label: "PiP", description: "Picture in Picture" },
  { key: "boost", icon: Rocket, label: "Boost", description: "Boost stream quality" },
  { key: "share", icon: Share2, label: "Share", description: "Share stream" },
  { key: "protect", icon: Shield, label: "Protect", description: "Enable protection" },
  { key: "special", icon: Sparkles, label: "Special Effect", description: "Trigger special effect" },
  { key: "favorite", icon: Star, label: "Favorite", description: "Add to favorites" },
  { key: "sticker", icon: Sticker, label: "Sticker", description: "Show sticker" },
  { key: "timer", icon: Timer, label: "Timer", description: "Start/stop timer" },
  { key: "achievement", icon: Trophy, label: "Achievement", description: "Show achievement" },
  { key: "broadcast", icon: Tv2, label: "Broadcast", description: "Broadcast settings" },
  { key: "magic", icon: Wand2, label: "Magic Effect", description: "Apply magic effect" },
  { key: "audio_wave", icon: Waves, label: "Audio Wave", description: "Show audio visualizer" },
]

export function StreamDeck({ isStreaming, onToggleStream }: StreamDeckProps) {
  // Default deck configuration with 6 buttons
  const [deckButtons, setDeckButtons] = useState([
    {
      key: "stream",
      icon: isStreaming ? Square : Play,
      label: isStreaming ? "Stop Stream" : "Go Live",
      active: isStreaming,
      color: isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
      action: onToggleStream,
    },
    {
      key: "mic",
      icon: Mic,
      label: "Microphone",
      active: true,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => toggleDeckButton(1),
    },
    {
      key: "camera",
      icon: Video,
      label: "Camera",
      active: true,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => toggleDeckButton(2),
    },
    {
      key: "screen",
      icon: Monitor,
      label: "Screen Share",
      active: false,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => toggleDeckButton(3),
    },
    {
      key: "music",
      icon: Music,
      label: "Music Player",
      active: false,
      color: "bg-pink-600 hover:bg-pink-700",
      action: () => toggleDeckButton(4),
    },
    {
      key: "effects",
      icon: Zap,
      label: "Visual Effects",
      active: false,
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: () => toggleDeckButton(5),
    },
  ])

  const toggleDeckButton = (index: number) => {
    setDeckButtons((prev) => {
      const newButtons = [...prev]
      newButtons[index] = {
        ...newButtons[index],
        active: !newButtons[index].active,
        color: newButtons[index].active
          ? "bg-gray-600 hover:bg-gray-700"
          : index === 1
            ? "bg-blue-600 hover:bg-blue-700"
            : index === 2
              ? "bg-purple-600 hover:bg-purple-700"
              : index === 3
                ? "bg-green-600 hover:bg-green-700"
                : index === 4
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-yellow-600 hover:bg-yellow-700",
      }
      return newButtons
    })
  }

  const changeButtonAction = (buttonIndex: number, actionKey: string) => {
    const action = availableActions.find((a) => a.key === actionKey)
    if (!action) return

    setDeckButtons((prev) => {
      const newButtons = [...prev]
      newButtons[buttonIndex] = {
        ...newButtons[buttonIndex],
        key: action.key,
        icon: action.icon,
        label: action.label,
        action: () => toggleDeckButton(buttonIndex),
      }
      return newButtons
    })
  }

  return (
    <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Stream Deck</h3>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            Customizable • 6 Buttons
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {deckButtons.map((button, index) => {
            const IconComponent = button.icon
            return (
              <Popover key={`${button.key}-${index}`}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Button
                      onClick={button.action}
                      className={`${button.color} h-20 w-full flex flex-col items-center justify-center gap-1 transition-all duration-200 transform hover:scale-105 text-white`}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-xs font-medium text-center leading-tight px-1">{button.label}</span>
                      {button.active && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 bg-gray-900 border-gray-700">
                  <div className="p-3 border-b border-gray-800">
                    <h4 className="font-medium text-white">Change Button Action</h4>
                    <p className="text-xs text-gray-400">Select from 50 available actions</p>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {availableActions.map((action) => {
                        const ActionIcon = action.icon
                        return (
                          <Button
                            key={action.key}
                            variant="ghost"
                            className="justify-start px-2 py-1 h-auto"
                            onClick={() => changeButtonAction(index, action.key)}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            <div className="text-left">
                              <div className="text-sm">{action.label}</div>
                              <div className="text-xs text-gray-400">{action.description}</div>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400">AI OPTIMIZED</div>
            <div className="text-xs text-gray-400">Performance</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-400">50</div>
            <div className="text-xs text-gray-400">Available Actions</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-lg font-bold text-purple-400">{isStreaming ? "LIVE" : "OFFLINE"}</div>
            <div className="text-xs text-gray-400">Stream Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
