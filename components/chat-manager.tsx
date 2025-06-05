"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Shield, Bot, Settings, Users, Zap } from "lucide-react"

export function ChatManager() {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      platform: "Twitch",
      user: "StreamFan123",
      message: "Great stream today! 🔥",
      timestamp: "12:34",
      isMod: false,
    },
    { id: 2, platform: "YouTube", user: "GamerPro", message: "Love this game!", timestamp: "12:35", isMod: true },
    {
      id: 3,
      platform: "Discord",
      user: "ChatMaster",
      message: "First time here, awesome content!",
      timestamp: "12:36",
      isMod: false,
    },
    {
      id: 4,
      platform: "Twitch",
      user: "RegularViewer",
      message: "When's the next stream?",
      timestamp: "12:37",
      isMod: false,
    },
  ])

  const [moderationSettings, setModerationSettings] = useState({
    autoMod: true,
    linkFilter: true,
    capsFilter: false,
    spamFilter: true,
    slowMode: false,
    followersOnly: false,
  })

  const [aiChatBot, setAiChatBot] = useState({
    enabled: true,
    autoRespond: true,
    personality: "friendly",
    responseDelay: 2,
  })

  const platforms = [
    { name: "Twitch", logo: "🟣", connected: true, chatCount: 45 },
    { name: "YouTube", logo: "🔴", connected: true, chatCount: 23 },
    { name: "Discord", logo: "🟦", connected: true, chatCount: 156 },
    { name: "TikTok", logo: "⚫", connected: false, chatCount: 0 },
  ]

  const generateAIResponse = async (message: string) => {
    // Simulate AI response using Grok integration
    const responses = [
      "Thanks for watching! 🎉",
      "Great question! Let me think about that...",
      "Welcome to the stream! Hope you enjoy!",
      "That's an interesting point! 🤔",
      "Thanks for the support! ❤️",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const addChatMessage = (platform: string, user: string, message: string) => {
    const newMessage = {
      id: Date.now(),
      platform,
      user,
      message,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      isMod: Math.random() < 0.1,
    }

    setChatMessages((prev) => [...prev.slice(-49), newMessage])

    // AI Auto-response
    if (aiChatBot.enabled && aiChatBot.autoRespond && Math.random() < 0.3) {
      setTimeout(async () => {
        const aiResponse = await generateAIResponse(message)
        const botMessage = {
          id: Date.now() + 1,
          platform,
          user: "StreamBot AI",
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
          isMod: true,
        }
        setChatMessages((prev) => [...prev.slice(-49), botMessage])
      }, aiChatBot.responseDelay * 1000)
    }
  }

  // Simulate incoming chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "This is amazing! 🚀",
        "How do you do that?",
        "First time watching, love it!",
        "Can you play my favorite song?",
        "Great setup! What's your specs?",
        "Been following for years! ❤️",
        "This game looks fun!",
        "What time do you usually stream?",
      ]

      const users = ["ChatUser", "StreamFan", "Viewer" + Math.floor(Math.random() * 1000), "RegularWatcher"]
      const activePlatforms = platforms.filter((p) => p.connected)

      if (activePlatforms.length > 0 && Math.random() < 0.4) {
        const platform = activePlatforms[Math.floor(Math.random() * activePlatforms.length)]
        const user = users[Math.floor(Math.random() * users.length)]
        const message = messages[Math.floor(Math.random() * messages.length)]

        addChatMessage(platform.name, user, message)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [platforms, aiChatBot])

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat Management Center
          </CardTitle>
          <CardDescription className="text-slate-300">
            Unified chat management across all streaming platforms with AI moderation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-md">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="ai-bot">AI Chat Bot</TabsTrigger>
          <TabsTrigger value="analytics">Chat Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Platform Status</h3>
              {platforms.map((platform, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{platform.logo}</span>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-sm text-slate-300">{platform.chatCount} messages</p>
                        </div>
                      </div>
                      <Badge variant={platform.connected ? "default" : "secondary"}>
                        {platform.connected ? "Connected" : "Offline"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Live Chat Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Live Chat Feed</h3>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Chat Settings
                </Button>
              </div>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-0">
                  <div className="h-96 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex-shrink-0">{platforms.find((p) => p.name === msg.platform)?.logo}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{msg.user}</span>
                            {msg.isMod && <Badge className="bg-green-600 text-xs">MOD</Badge>}
                            <span className="text-xs text-slate-400">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm mt-1 break-words">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-white/20">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message to all platforms..."
                        className="bg-white/20 border-white/30 text-white"
                      />
                      <Button className="bg-purple-600 hover:bg-purple-700">Send</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Auto Moderation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(moderationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setModerationSettings((prev) => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Moderation Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Timeout User</Button>
                <Button className="w-full bg-red-600 hover:bg-red-700">Ban User</Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Clear Chat</Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Slow Mode</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-bot" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Chat Bot Configuration
              </CardTitle>
              <CardDescription className="text-slate-300">
                Powered by Grok AI for intelligent chat interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Enable AI Chat Bot</span>
                    <Switch
                      checked={aiChatBot.enabled}
                      onCheckedChange={(checked) => setAiChatBot((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Auto Respond to Messages</span>
                    <Switch
                      checked={aiChatBot.autoRespond}
                      onCheckedChange={(checked) => setAiChatBot((prev) => ({ ...prev, autoRespond: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <span>Bot Personality</span>
                    <select
                      className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
                      value={aiChatBot.personality}
                      onChange={(e) => setAiChatBot((prev) => ({ ...prev, personality: e.target.value }))}
                    >
                      <option value="friendly">Friendly & Welcoming</option>
                      <option value="professional">Professional</option>
                      <option value="funny">Funny & Entertaining</option>
                      <option value="helpful">Helpful & Informative</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span>Response Delay (seconds)</span>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={aiChatBot.responseDelay}
                      onChange={(e) =>
                        setAiChatBot((prev) => ({ ...prev, responseDelay: Number.parseInt(e.target.value) }))
                      }
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">AI Bot Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Smart question answering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Welcome new followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span className="text-sm">Moderate inappropriate content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">Generate conversation starters</span>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">Test AI Bot</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">8,934</p>
                  <p className="text-sm text-slate-300">Total Messages</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-slate-300">Active Chatters</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">12.5</p>
                  <p className="text-sm text-slate-300">Messages/Minute</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
