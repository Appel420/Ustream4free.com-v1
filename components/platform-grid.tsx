"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Key,
  Globe,
  Users,
  MessageCircle,
  Eye,
  TrendingUp,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Settings,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Platform {
  id: string
  name: string
  logo: string
  icon?: React.ReactNode
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

interface PlatformGridProps {
  platforms: Platform[]
  setPlatforms: (platforms: Platform[]) => void
  deviceType: "desktop" | "tablet" | "mobile"
}

// Stream quality options with comprehensive range from 260p to 8K
const STREAM_QUALITIES = [
  { value: "260p15", label: "260p @ 15fps", width: 460, height: 260, bitrate: 300, fps: 15 },
  { value: "260p30", label: "260p @ 30fps", width: 460, height: 260, bitrate: 400, fps: 30 },
  { value: "360p15", label: "360p @ 15fps", width: 640, height: 360, bitrate: 600, fps: 15 },
  { value: "360p30", label: "360p @ 30fps", width: 640, height: 360, bitrate: 800, fps: 30 },
  { value: "360p60", label: "360p @ 60fps", width: 640, height: 360, bitrate: 1200, fps: 60 },
  { value: "480p15", label: "480p @ 15fps", width: 854, height: 480, bitrate: 800, fps: 15 },
  { value: "480p30", label: "480p @ 30fps", width: 854, height: 480, bitrate: 1200, fps: 30 },
  { value: "480p60", label: "480p @ 60fps", width: 854, height: 480, bitrate: 2000, fps: 60 },
  { value: "540p30", label: "540p @ 30fps", width: 960, height: 540, bitrate: 1800, fps: 30 },
  { value: "540p60", label: "540p @ 60fps", width: 960, height: 540, bitrate: 2800, fps: 60 },
  { value: "720p15", label: "720p @ 15fps", width: 1280, height: 720, bitrate: 1500, fps: 15 },
  { value: "720p30", label: "720p @ 30fps", width: 1280, height: 720, bitrate: 2500, fps: 30 },
  { value: "720p60", label: "720p @ 60fps", width: 1280, height: 720, bitrate: 4500, fps: 60 },
  { value: "900p30", label: "900p @ 30fps", width: 1600, height: 900, bitrate: 3500, fps: 30 },
  { value: "900p60", label: "900p @ 60fps", width: 1600, height: 900, bitrate: 5500, fps: 60 },
  { value: "1080p15", label: "1080p @ 15fps", width: 1920, height: 1080, bitrate: 2500, fps: 15 },
  { value: "1080p30", label: "1080p @ 30fps", width: 1920, height: 1080, bitrate: 4500, fps: 30 },
  { value: "1080p60", label: "1080p @ 60fps", width: 1920, height: 1080, bitrate: 6000, fps: 60 },
  { value: "1080p120", label: "1080p @ 120fps", width: 1920, height: 1080, bitrate: 10000, fps: 120 },
  { value: "1200p30", label: "1200p @ 30fps", width: 1920, height: 1200, bitrate: 5000, fps: 30 },
  { value: "1200p60", label: "1200p @ 60fps", width: 1920, height: 1200, bitrate: 7000, fps: 60 },
  { value: "1440p15", label: "1440p @ 15fps", width: 2560, height: 1440, bitrate: 4000, fps: 15 },
  { value: "1440p30", label: "1440p @ 30fps", width: 2560, height: 1440, bitrate: 6000, fps: 30 },
  { value: "1440p60", label: "1440p @ 60fps", width: 2560, height: 1440, bitrate: 9000, fps: 60 },
  { value: "1440p120", label: "1440p @ 120fps", width: 2560, height: 1440, bitrate: 15000, fps: 120 },
  { value: "1800p30", label: "1800p @ 30fps", width: 3200, height: 1800, bitrate: 8000, fps: 30 },
  { value: "1800p60", label: "1800p @ 60fps", width: 3200, height: 1800, bitrate: 12000, fps: 60 },
  { value: "4k15", label: "4K @ 15fps", width: 3840, height: 2160, bitrate: 8000, fps: 15 },
  { value: "4k30", label: "4K @ 30fps", width: 3840, height: 2160, bitrate: 13000, fps: 30 },
  { value: "4k60", label: "4K @ 60fps", width: 3840, height: 2160, bitrate: 20000, fps: 60 },
  { value: "4k120", label: "4K @ 120fps", width: 3840, height: 2160, bitrate: 35000, fps: 120 },
  { value: "5k30", label: "5K @ 30fps", width: 5120, height: 2880, bitrate: 18000, fps: 30 },
  { value: "5k60", label: "5K @ 60fps", width: 5120, height: 2880, bitrate: 28000, fps: 60 },
  { value: "6k30", label: "6K @ 30fps", width: 6144, height: 3456, bitrate: 25000, fps: 30 },
  { value: "6k60", label: "6K @ 60fps", width: 6144, height: 3456, bitrate: 40000, fps: 60 },
  { value: "8k15", label: "8K @ 15fps", width: 7680, height: 4320, bitrate: 20000, fps: 15 },
  { value: "8k30", label: "8K @ 30fps", width: 7680, height: 4320, bitrate: 25000, fps: 30 },
  { value: "8k60", label: "8K @ 60fps", width: 7680, height: 4320, bitrate: 50000, fps: 60 },
  { value: "8k120", label: "8K @ 120fps", width: 7680, height: 4320, bitrate: 80000, fps: 120 },
]

const WEBCAM_QUALITIES = [
  { value: "260p15", label: "260p @ 15fps" },
  { value: "260p30", label: "260p @ 30fps" },
  { value: "360p15", label: "360p @ 15fps" },
  { value: "360p30", label: "360p @ 30fps" },
  { value: "360p60", label: "360p @ 60fps" },
  { value: "480p15", label: "480p @ 15fps" },
  { value: "480p30", label: "480p @ 30fps" },
  { value: "480p60", label: "480p @ 60fps" },
  { value: "540p30", label: "540p @ 30fps" },
  { value: "540p60", label: "540p @ 60fps" },
  { value: "720p15", label: "720p @ 15fps" },
  { value: "720p30", label: "720p @ 30fps" },
  { value: "720p60", label: "720p @ 60fps" },
  { value: "900p30", label: "900p @ 30fps" },
  { value: "900p60", label: "900p @ 60fps" },
  { value: "1080p15", label: "1080p @ 15fps" },
  { value: "1080p30", label: "1080p @ 30fps" },
  { value: "1080p60", label: "1080p @ 60fps" },
  { value: "1080p120", label: "1080p @ 120fps" },
  { value: "1200p30", label: "1200p @ 30fps" },
  { value: "1200p60", label: "1200p @ 60fps" },
  { value: "1440p15", label: "1440p @ 15fps" },
  { value: "1440p30", label: "1440p @ 30fps" },
  { value: "1440p60", label: "1440p @ 60fps" },
  { value: "1440p120", label: "1440p @ 120fps" },
  { value: "1800p30", label: "1800p @ 30fps" },
  { value: "1800p60", label: "1800p @ 60fps" },
  { value: "4k15", label: "4K @ 15fps" },
  { value: "4k30", label: "4K @ 30fps" },
  { value: "4k60", label: "4K @ 60fps" },
  { value: "4k120", label: "4K @ 120fps" },
  { value: "5k30", label: "5K @ 30fps" },
  { value: "5k60", label: "5K @ 60fps" },
  { value: "6k30", label: "6K @ 30fps" },
  { value: "6k60", label: "6K @ 60fps" },
  { value: "8k15", label: "8K @ 15fps" },
  { value: "8k30", label: "8K @ 30fps" },
  { value: "8k60", label: "8K @ 60fps" },
  { value: "8k120", label: "8K @ 120fps" },
]

export function PlatformGrid({ platforms, setPlatforms, deviceType }: PlatformGridProps) {
  const [popoutWindows, setPopoutWindows] = useState<Map<string, Window>>(new Map())

  const togglePlatform = (platformId: string) => {
    setPlatforms(platforms.map((p) => (p.id === platformId ? { ...p, isLive: !p.isLive } : p)))
  }

  const updateStreamKey = (platformId: string, keyIndex: number, value: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              streamKeys: p.streamKeys.map((key, idx) => (idx === keyIndex ? value : key)),
            }
          : p,
      ),
    )
  }

  const setActiveStreamKey = (platformId: string, keyIndex: number) => {
    setPlatforms(platforms.map((p) => (p.id === platformId ? { ...p, activeKeyIndex: keyIndex } : p)))
  }

  // Audio/Video control functions
  const toggleMicrophone = (platformId: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              audioSettings: {
                ...p.audioSettings,
                micEnabled: !p.audioSettings.micEnabled,
              },
            }
          : p,
      ),
    )
  }

  const setMicrophoneVolume = (platformId: string, volume: number) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              audioSettings: {
                ...p.audioSettings,
                micVolume: volume,
              },
            }
          : p,
      ),
    )
  }

  const toggleOutput = (platformId: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              audioSettings: {
                ...p.audioSettings,
                outputEnabled: !p.audioSettings.outputEnabled,
              },
            }
          : p,
      ),
    )
  }

  const setOutputVolume = (platformId: string, volume: number) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              audioSettings: {
                ...p.audioSettings,
                outputVolume: volume,
              },
            }
          : p,
      ),
    )
  }

  const toggleWebcam = (platformId: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              videoSettings: {
                ...p.videoSettings,
                webcamEnabled: !p.videoSettings.webcamEnabled,
              },
            }
          : p,
      ),
    )
  }

  const setWebcamQuality = (platformId: string, quality: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              videoSettings: {
                ...p.videoSettings,
                webcamQuality: quality,
              },
            }
          : p,
      ),
    )
  }

  const setStreamQuality = (platformId: string, quality: string) => {
    const qualityData = STREAM_QUALITIES.find((q) => q.value === quality)
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              videoSettings: {
                ...p.videoSettings,
                streamQuality: quality,
                bitrate: qualityData?.bitrate || p.videoSettings.bitrate,
                fps: qualityData?.fps || p.videoSettings.fps,
              },
            }
          : p,
      ),
    )
  }

  const setBitrate = (platformId: string, bitrate: number) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              videoSettings: {
                ...p.videoSettings,
                bitrate: bitrate,
              },
            }
          : p,
      ),
    )
  }

  const setFPS = (platformId: string, fps: number) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              videoSettings: {
                ...p.videoSettings,
                fps: fps,
              },
            }
          : p,
      ),
    )
  }

  const popOutPlatform = (platform: Platform) => {
    const existingPopup = popoutWindows.get(platform.id)
    if (existingPopup && !existingPopup.closed) {
      existingPopup.focus()
      return
    }

    const width = deviceType === "mobile" ? window.innerWidth : 1200
    const height = deviceType === "mobile" ? window.innerHeight : 800
    const left = deviceType === "mobile" ? 0 : Math.max(0, (screen.width - width) / 2)
    const top = deviceType === "mobile" ? 0 : Math.max(0, (screen.height - height) / 2)

    const popup = window.open(
      "",
      `${platform.id}-ustream4free`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )

    if (popup) {
      setPopoutWindows((prev) => new Map(prev.set(platform.id, popup)))

      popup.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${platform.name} - Ustream4Free.com</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              color: #fff;
              height: 100vh;
              overflow: hidden;
            }
            .header {
              background: rgba(0,0,0,0.9);
              padding: 15px 20px;
              border-bottom: 1px solid #333;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .platform-info {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo { font-size: 24px; }
            .platform-name { font-size: 20px; font-weight: bold; }
            .live-badge {
              background: #ef4444;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            .stats {
              display: flex;
              gap: 20px;
              font-size: 14px;
            }
            .stat {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .quality-info {
              background: rgba(139, 92, 246, 0.2);
              padding: 8px 12px;
              border-radius: 8px;
              font-size: 12px;
              border: 1px solid #8b5cf6;
            }
            .container {
              display: grid;
              grid-template-columns: 2fr 1fr;
              height: calc(100vh - 70px);
              gap: 1px;
              background: #333;
            }
            .video-section {
              background: #000;
              display: flex;
              flex-direction: column;
            }
            .video-content {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #666;
              position: relative;
            }
            .video-overlay {
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
              background: rgba(0,0,0,0.8);
              padding: 15px;
              border-radius: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .controls {
              display: flex;
              gap: 10px;
            }
            .control-btn {
              padding: 8px 16px;
              background: #6366f1;
              border: none;
              border-radius: 6px;
              color: #fff;
              cursor: pointer;
              font-size: 12px;
              transition: all 0.2s;
            }
            .control-btn:hover { background: #4f46e5; transform: translateY(-1px); }
            .control-btn.active { background: #22c55e; }
            .control-btn.mic { background: #3b82f6; }
            .control-btn.cam { background: #f59e0b; }
            .control-btn.screen { background: #8b5cf6; }
            .control-btn.record { background: #ef4444; }
            .quality-selector {
              position: absolute;
              top: 20px;
              left: 20px;
              background: rgba(0,0,0,0.8);
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #8b5cf6;
            }
            .quality-select {
              background: #1a1a1a;
              border: 1px solid #8b5cf6;
              color: #fff;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 12px;
            }
            .chat-section {
              background: #1a1a1a;
              display: flex;
              flex-direction: column;
            }
            .chat-header {
              padding: 15px 20px;
              border-bottom: 1px solid #333;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #8b5cf6;
            }
            .chat-messages {
              flex: 1;
              padding: 15px;
              overflow-y: auto;
              min-height: 0;
            }
            .chat-message {
              margin-bottom: 12px;
              padding: 10px 15px;
              background: rgba(139, 92, 246, 0.1);
              border-radius: 8px;
              font-size: 14px;
              line-height: 1.4;
              border-left: 3px solid #8b5cf6;
            }
            .chat-input-area {
              padding: 15px 20px;
              border-top: 1px solid #333;
              display: flex;
              gap: 10px;
            }
            .chat-input {
              flex: 1;
              padding: 12px 16px;
              border: 1px solid #333;
              border-radius: 25px;
              background: rgba(255,255,255,0.1);
              color: #fff;
              outline: none;
              font-size: 14px;
            }
            .chat-input::placeholder { color: rgba(255,255,255,0.5); }
            .send-btn {
              padding: 12px 24px;
              background: #8b5cf6;
              border: none;
              border-radius: 25px;
              color: #fff;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.2s;
            }
            .send-btn:hover { background: #7c3aed; transform: translateY(-1px); }
            .real-time-indicator {
              position: absolute;
              top: 20px;
              right: 20px;
              background: rgba(34, 197, 94, 0.9);
              padding: 8px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .pulse-dot {
              width: 8px;
              height: 8px;
              background: #fff;
              border-radius: 50%;
              animation: pulse 1s infinite;
            }
            @media (max-width: 768px) {
              .container { grid-template-columns: 1fr; grid-template-rows: 2fr 1fr; }
              .header { flex-direction: column; gap: 10px; text-align: center; }
              .stats { justify-content: center; }
              .quality-selector { position: relative; margin-bottom: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="platform-info">
              <span class="logo">${platform.logo}</span>
              <span class="platform-name">${platform.name}</span>
              <span class="live-badge">● LIVE</span>
              <span style="font-size: 12px; color: #888;">Ustream4Free.com</span>
            </div>
            <div class="stats">
              <div class="stat">
                <span>👥</span>
                <span id="viewer-count">${platform.viewers.toLocaleString()}</span>
              </div>
              <div class="stat">
                <span>💬</span>
                <span id="chat-count">${platform.chatMessages}</span>
              </div>
              <div class="quality-info">
                <div>Stream: ${platform.videoSettings.streamQuality}</div>
                <div>Bitrate: ${platform.videoSettings.bitrate} kbps</div>
              </div>
            </div>
          </div>
          
          <div class="container" id="container">
            <div class="video-section" id="video-section">
              <div class="video-content" id="video-content">
                <div class="quality-selector">
                  <div style="margin-bottom: 5px; font-size: 12px; color: #8b5cf6;">Stream Quality:</div>
                  <select class="quality-select" id="stream-quality" onchange="changeStreamQuality(this.value)">
                    ${STREAM_QUALITIES.map(
                      (q) =>
                        `<option value="${q.value}" ${q.value === platform.videoSettings.streamQuality ? "selected" : ""}>${q.label}</option>`,
                    ).join("")}
                  </select>
                  <div style="margin-top: 5px; font-size: 10px; color: #888;">
                    Bitrate: <span id="current-bitrate">${platform.videoSettings.bitrate}</span> kbps
                  </div>
                </div>
                
                <div class="real-time-indicator">
                  <div class="pulse-dot"></div>
                  LIVE
                </div>
                <div id="webcam-display" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                  <div style="text-center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">${platform.logo}</div>
                    <div style="font-size: 24px; margin-bottom: 10px;">${platform.name}</div>
                    <div style="font-size: 16px; color: #8b5cf6;">${platform.videoSettings.webcamEnabled ? "Live Stream Active" : "Webcam Disabled"}</div>
                    <div style="font-size: 14px; color: #888; margin-top: 10px;">
                      ${platform.videoSettings.streamQuality} • ${platform.videoSettings.bitrate} kbps • ${platform.videoSettings.fps} fps
                    </div>
                  </div>
                </div>
                <div class="video-overlay">
                  <div>
                    <div style="font-size: 14px; margin-bottom: 5px;">Webcam: ${platform.videoSettings.webcamQuality}</div>
                    <div style="font-size: 12px; color: #888;">Stream: ${platform.videoSettings.streamQuality} • Uptime: ${Math.floor(Math.random() * 120 + 30)} min</div>
                  </div>
                  <div class="controls">
                    <button class="control-btn mic ${platform.audioSettings.micEnabled ? "active" : ""}" onclick="toggleMic()">🎤 Mic</button>
                    <button class="control-btn cam ${platform.videoSettings.webcamEnabled ? "active" : ""}" onclick="toggleCamera()">📹 Cam</button>
                    <button class="control-btn screen" onclick="toggleScreen()">🖥️ Screen</button>
                    <button class="control-btn record" onclick="toggleRecord()">⏺️ Record</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-section" id="chat-section">
              <div class="chat-header">
                <span>💬 Live Chat</span>
                <span style="font-size: 12px; color: #fff;" id="chat-status">Connected</span>
              </div>
              <div class="chat-messages" id="chat-messages">
                <div class="chat-message">
                  <strong>StreamBot:</strong> Welcome to ${platform.name} on Ustream4Free! 🎉
                </div>
                <div class="chat-message">
                  <strong>Viewer123:</strong> Amazing ${platform.videoSettings.streamQuality} quality! <span class="emote">🔥</span>
                </div>
                <div class="chat-message">
                  <strong>ProStreamer:</strong> ${platform.videoSettings.bitrate} kbps looks perfect!
                </div>
              </div>
              <div class="chat-input-area">
                <input 
                  type="text" 
                  class="chat-input" 
                  placeholder="Type a message..." 
                  id="chat-input"
                  maxlength="500"
                >
                <button class="send-btn" onclick="sendMessage()">Send</button>
              </div>
            </div>
          </div>
          
          <script>
            let currentStreamQuality = '${platform.videoSettings.streamQuality}';
            let currentBitrate = ${platform.videoSettings.bitrate};
            
            const qualityData = {
              ${STREAM_QUALITIES.map((q) => `'${q.value}': { bitrate: ${q.bitrate}, fps: ${q.fps}, width: ${q.width}, height: ${q.height} }`).join(",\n              ")}
            };
            
            function changeStreamQuality(quality) {
              currentStreamQuality = quality;
              const data = qualityData[quality];
              currentBitrate = data.bitrate;
              
              document.getElementById('current-bitrate').textContent = data.bitrate;
              
              // Update display
              const webcamDisplay = document.getElementById('webcam-display');
              webcamDisplay.innerHTML = \`
                <div style="text-center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">${platform.logo}</div>
                  <div style="font-size: 24px; margin-bottom: 10px;">${platform.name}</div>
                  <div style="font-size: 16px; color: #8b5cf6;">Live Stream Active</div>
                  <div style="font-size: 14px; color: #888; margin-top: 10px;">
                    \${quality} • \${data.bitrate} kbps • \${data.fps} fps
                  </div>
                  <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    Resolution: \${data.width}x\${data.height}
                  </div>
                </div>
              \`;
              
              // Update overlay
              const overlay = document.querySelector('.video-overlay > div');
              overlay.innerHTML = \`
                <div style="font-size: 14px; margin-bottom: 5px;">Webcam: ${platform.videoSettings.webcamQuality}</div>
                <div style="font-size: 12px; color: #888;">Stream: \${quality} • Uptime: ${Math.floor(Math.random() * 120 + 30)} min</div>
              \`;
              
              // Send message to parent window
              window.opener?.postMessage({
                type: 'setStreamQuality',
                platformId: '${platform.id}',
                quality: quality,
                bitrate: data.bitrate,
                fps: data.fps
              }, '*');
            }
            
            // Rest of the existing JavaScript code...
            let micOn = ${platform.audioSettings.micEnabled};
            let cameraOn = ${platform.videoSettings.webcamEnabled};
            let screenSharing = false;
            let recording = false;
            
            function toggleMic() {
              micOn = !micOn;
              const btns = document.querySelectorAll('.control-btn.mic');
              btns.forEach(btn => {
                btn.className = micOn ? 'control-btn mic active' : 'control-btn mic';
              });
              
              window.opener?.postMessage({
                type: 'toggleMic',
                platformId: '${platform.id}',
                value: micOn
              }, '*');
            }
            
            function toggleCamera() {
              cameraOn = !cameraOn;
              const btn = document.querySelector('.controls .control-btn.cam');
              btn.className = cameraOn ? 'control-btn cam active' : 'control-btn cam';
              
              window.opener?.postMessage({
                type: 'toggleWebcam',
                platformId: '${platform.id}',
                value: cameraOn
              }, '*');
            }
            
            function toggleScreen() {
              screenSharing = !screenSharing;
              const btn = document.querySelector('.controls .control-btn.screen');
              btn.textContent = screenSharing ? '🖥️ Stop' : '🖥️ Screen';
              btn.className = screenSharing ? 'control-btn screen active' : 'control-btn screen';
            }
            
            function toggleRecord() {
              recording = !recording;
              const btn = document.querySelector('.controls .control-btn.record');
              btn.textContent = recording ? '⏹️ Stop' : '⏺️ Record';
              btn.className = recording ? 'control-btn record active' : 'control-btn record';
            }
            
            function sendMessage() {
              const input = document.getElementById('chat-input');
              const message = input.value.trim();
              if (message) {
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                messageDiv.innerHTML = '<strong>You:</strong> ' + message;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                input.value = '';
                
                const chatCount = document.getElementById('chat-count');
                chatCount.textContent = parseInt(chatCount.textContent) + 1;
              }
            }
            
            document.getElementById('chat-input').addEventListener('keypress', function(e) {
              if (e.key === 'Enter') sendMessage();
            });
            
            // Simulate real-time updates
            setInterval(() => {
              const viewerCount = document.getElementById('viewer-count');
              const currentViewers = parseInt(viewerCount.textContent.replace(/,/g, ''));
              const newViewers = Math.max(0, currentViewers + Math.floor(Math.random() * 10 - 5));
              viewerCount.textContent = newViewers.toLocaleString();
              
              // Simulate quality-based chat messages
              if (Math.random() < 0.3) {
                const qualityMessages = [
                  \`Amazing \${currentStreamQuality} quality! 🔥\`,
                  \`\${currentBitrate} kbps looks perfect!\`,
                  'Stream quality is incredible!',
                  'Love the high resolution!',
                  'Crystal clear video!'
                ];
                const users = ['QualityFan', 'StreamViewer', 'TechExpert'];
                
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                const user = users[Math.floor(Math.random() * users.length)];
                const message = qualityMessages[Math.floor(Math.random() * qualityMessages.length)];
                messageDiv.innerHTML = '<strong>' + user + ':</strong> ' + message;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                if (chatMessages.children.length > 50) {
                  chatMessages.removeChild(chatMessages.firstChild);
                }
              }
            }, 4000);
          </script>
        </body>
        </html>
      `)

      popup.document.close()
      popup.focus()

      window.addEventListener("message", (event) => {
        if (event.source === popup) {
          const { type, platformId, value, quality, bitrate, fps } = event.data

          switch (type) {
            case "toggleMic":
              toggleMicrophone(platformId)
              break
            case "toggleWebcam":
              toggleWebcam(platformId)
              break
            case "toggleOutput":
              toggleOutput(platformId)
              break
            case "setMicVolume":
              setMicrophoneVolume(platformId, value)
              break
            case "setOutputVolume":
              setOutputVolume(platformId, value)
              break
            case "setStreamQuality":
              setStreamQuality(platformId, quality)
              break
          }
        }
      })
    }
  }

  const gridCols = deviceType === "mobile" ? "grid-cols-1" : deviceType === "tablet" ? "grid-cols-2" : "grid-cols-3"

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {platforms.map((platform) => (
        <Card
          key={platform.id}
          className={`bg-gray-900/90 backdrop-blur-md border-gray-700 hover:border-gray-600 transition-all duration-200 ${
            platform.id === "twitch"
              ? "border-purple-700/30"
              : platform.id === "youtube"
                ? "border-red-700/30"
                : platform.id === "facebook"
                  ? "border-blue-700/30"
                  : platform.id === "tiktok"
                    ? "border-gray-700/30"
                    : platform.id === "discord"
                      ? "border-indigo-700/30"
                      : platform.id === "kick"
                        ? "border-green-700/30"
                        : ""
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl flex items-center justify-center w-8 h-8">
                  {platform.icon || <Globe className="h-5 w-5 text-gray-400" />}
                </div>
                <div>
                  <CardTitle className="text-lg text-white">{platform.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={platform.isLive ? "destructive" : "secondary"} className="text-xs">
                      {platform.isLive ? "🔴 LIVE" : "⚫ OFFLINE"}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                      {platform.videoSettings.streamQuality}
                    </Badge>
                  </div>
                </div>
              </div>
              <Switch checked={platform.isLive} onCheckedChange={() => togglePlatform(platform.id)} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="quality" className="w-full">
              <TabsList className="w-full bg-gray-800/50">
                <TabsTrigger value="quality" className="flex-1 text-xs">
                  Quality
                </TabsTrigger>
                <TabsTrigger value="keys" className="flex-1 text-xs">
                  Keys
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex-1 text-xs">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex-1 text-xs">
                  A/V
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quality" className="mt-2 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Stream Quality</span>
                  </div>
                  <Select
                    value={platform.videoSettings.streamQuality}
                    onValueChange={(value) => setStreamQuality(platform.id, value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {STREAM_QUALITIES.map((quality) => (
                        <SelectItem key={quality.value} value={quality.value} className="text-white hover:bg-gray-700">
                          <div className="flex flex-col">
                            <span>{quality.label}</span>
                            <span className="text-xs text-gray-400">
                              {quality.bitrate} kbps • {quality.width}x{quality.height}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium text-white">Webcam Quality</span>
                  </div>
                  <Select
                    value={platform.videoSettings.webcamQuality}
                    onValueChange={(value) => setWebcamQuality(platform.id, value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {WEBCAM_QUALITIES.map((quality) => (
                        <SelectItem key={quality.value} value={quality.value} className="text-white hover:bg-gray-700">
                          {quality.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Bitrate</span>
                    <span className="text-xs text-purple-400">{platform.videoSettings.bitrate} kbps</span>
                  </div>
                  <Slider
                    value={[platform.videoSettings.bitrate]}
                    onValueChange={(value) => setBitrate(platform.id, value[0])}
                    min={300}
                    max={80000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Frame Rate</span>
                    <span className="text-xs text-blue-400">{platform.videoSettings.fps} fps</span>
                  </div>
                  <Slider
                    value={[platform.videoSettings.fps]}
                    onValueChange={(value) => setFPS(platform.id, value[0])}
                    min={15}
                    max={120}
                    step={15}
                    className="w-full"
                  />
                </div>

                <div className="bg-gray-800/30 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-2">Current Settings:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Resolution:</span>
                      <div className="text-white font-medium">
                        {STREAM_QUALITIES.find((q) => q.value === platform.videoSettings.streamQuality)?.width}x
                        {STREAM_QUALITIES.find((q) => q.value === platform.videoSettings.streamQuality)?.height}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Bitrate:</span>
                      <div className="text-purple-400 font-medium">{platform.videoSettings.bitrate} kbps</div>
                    </div>
                    <div>
                      <span className="text-gray-400">FPS:</span>
                      <div className="text-blue-400 font-medium">{platform.videoSettings.fps}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Webcam:</span>
                      <div className="text-orange-400 font-medium">{platform.videoSettings.webcamQuality}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keys" className="mt-2 space-y-2">
                <div className="text-xs text-gray-400 mb-2">Configure stream keys for {platform.name}</div>
                {platform.streamKeys.slice(0, 3).map((key, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-1 h-6 rounded-full ${platform.activeKeyIndex === index ? "bg-green-500" : "bg-gray-700"}`}
                    ></div>
                    <Input
                      type="text"
                      placeholder={`Stream Key ${index + 1}`}
                      value={key}
                      onChange={(e) => updateStreamKey(platform.id, index, e.target.value)}
                      className="flex-1 bg-gray-800/50 border-gray-700 text-white text-xs h-8"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-gray-700 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setActiveStreamKey(platform.id, index)}
                    >
                      <Key className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="text-xs text-gray-400 mt-1">Active Key: {platform.activeKeyIndex + 1}</div>
              </TabsContent>

              <TabsContent value="stats" className="mt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800/50 p-2 rounded flex items-center gap-2">
                    <Users className="h-3 w-3 text-blue-400" />
                    <div>
                      <div className="text-gray-400">Viewers</div>
                      <div className="text-white font-bold">{platform.viewers.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded flex items-center gap-2">
                    <MessageCircle className="h-3 w-3 text-green-400" />
                    <div>
                      <div className="text-gray-400">Messages</div>
                      <div className="text-white font-bold">{platform.chatMessages}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded flex items-center gap-2">
                    <Eye className="h-3 w-3 text-purple-400" />
                    <div>
                      <div className="text-gray-400">Uptime</div>
                      <div className="text-white font-bold">{Math.floor(Math.random() * 120 + 30)}m</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-orange-400" />
                    <div>
                      <div className="text-gray-400">Bitrate</div>
                      <div className="text-white font-bold">{platform.videoSettings.bitrate}k</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="mt-2 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {platform.audioSettings.micEnabled ? (
                        <Volume2 className="h-4 w-4 text-blue-400" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-300">Microphone</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-6 px-2 text-xs border-gray-700 ${
                        platform.audioSettings.micEnabled
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                      onClick={() => toggleMicrophone(platform.id)}
                    >
                      {platform.audioSettings.micEnabled ? "ON" : "OFF"}
                    </Button>
                  </div>
                  <Slider
                    value={[platform.audioSettings.micVolume]}
                    onValueChange={(value) => setMicrophoneVolume(platform.id, value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 text-center">{platform.audioSettings.micVolume}%</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {platform.audioSettings.outputEnabled ? (
                        <Volume2 className="h-4 w-4 text-purple-400" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-300">Output</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-6 px-2 text-xs border-gray-700 ${
                        platform.audioSettings.outputEnabled
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                      onClick={() => toggleOutput(platform.id)}
                    >
                      {platform.audioSettings.outputEnabled ? "ON" : "OFF"}
                    </Button>
                  </div>
                  <Slider
                    value={[platform.audioSettings.outputVolume]}
                    onValueChange={(value) => setOutputVolume(platform.id, value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 text-center">{platform.audioSettings.outputVolume}%</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {platform.videoSettings.webcamEnabled ? (
                        <Video className="h-4 w-4 text-orange-400" />
                      ) : (
                        <VideoOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-300">Webcam</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-6 px-2 text-xs border-gray-700 ${
                        platform.videoSettings.webcamEnabled
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                      onClick={() => toggleWebcam(platform.id)}
                    >
                      {platform.videoSettings.webcamEnabled ? "ON" : "OFF"}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    Quality: {platform.videoSettings.webcamQuality}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={() => popOutPlatform(platform)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              size="sm"
            >
              🚀 Pop Out Window
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
