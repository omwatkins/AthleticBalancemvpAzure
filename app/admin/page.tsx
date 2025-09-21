"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Settings, ImageIcon, Zap } from "lucide-react"
import Link from "next/link"

interface ImageSettings {
  model: string
  size: string
  quality: string
  style: string
  enabled: boolean
  baseStyle: string
  detectionSensitivity: string
}

export default function AdminPage() {
  const [saving, setSaving] = useState(false)
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    model: "dall-e-3",
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    enabled: true,
    baseStyle:
      "Athletic Balance signature style: high-contrast matte; clean background; accurate sport technique; clear labels (A,B,C / 1,2,3) and arrows; no dense text blocks; youth-appropriate; inclusive; modern; visually motivating.",
    detectionSensitivity: "medium",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // Load settings from localStorage
    const saved = localStorage.getItem("imageGenerationSettings")
    if (saved) {
      setImageSettings({ ...imageSettings, ...JSON.parse(saved) })
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem("imageGenerationSettings", JSON.stringify(imageSettings))
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="h-8 w-8 text-lime-400" />
              Admin Settings
            </h1>
            <p className="text-slate-400">Control image generation and system settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Image Generation Settings */}
          <Card className="bg-slate-800 border-slate-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <ImageIcon className="h-6 w-6 text-lime-400" />
                Image Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Enable Image Generation</Label>
                  <p className="text-slate-400 text-sm">Allow coaches to generate visual content</p>
                </div>
                <Switch
                  checked={imageSettings.enabled}
                  onCheckedChange={(checked) => setImageSettings((prev) => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="text-white font-medium">DALL-E Model</Label>
                <Select
                  value={imageSettings.model}
                  onValueChange={(value) => setImageSettings((prev) => ({ ...prev, model: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="dall-e-2">DALL-E 2 (Faster, Lower Cost)</SelectItem>
                    <SelectItem value="dall-e-3">DALL-E 3 (Higher Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Size */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Image Size</Label>
                <Select
                  value={imageSettings.size}
                  onValueChange={(value) => setImageSettings((prev) => ({ ...prev, size: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="256x256">256×256 (Small)</SelectItem>
                    <SelectItem value="512x512">512×512 (Medium)</SelectItem>
                    <SelectItem value="1024x1024">1024×1024 (Large, Square)</SelectItem>
                    <SelectItem value="1792x1024">1792×1024 (Wide)</SelectItem>
                    <SelectItem value="1024x1792">1024×1792 (Tall)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Image Quality</Label>
                <Select
                  value={imageSettings.quality}
                  onValueChange={(value) => setImageSettings((prev) => ({ ...prev, quality: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="standard">Standard Quality</SelectItem>
                    <SelectItem value="hd">HD Quality (Higher Cost)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Image Style</Label>
                <Select
                  value={imageSettings.style}
                  onValueChange={(value) => setImageSettings((prev) => ({ ...prev, style: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="vivid">Vivid (More Creative)</SelectItem>
                    <SelectItem value="natural">Natural (More Realistic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Detection Sensitivity */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Detection Sensitivity</Label>
                <p className="text-slate-400 text-sm">How easily should coaches trigger image generation?</p>
                <Select
                  value={imageSettings.detectionSensitivity}
                  onValueChange={(value) => setImageSettings((prev) => ({ ...prev, detectionSensitivity: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="low">Low (Only explicit requests)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced detection)</SelectItem>
                    <SelectItem value="high">High (Generate often)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Base Style Prompt */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Base Style Prompt</Label>
                <p className="text-slate-400 text-sm">This style is applied to all generated images</p>
                <Textarea
                  value={imageSettings.baseStyle}
                  onChange={(e) => setImageSettings((prev) => ({ ...prev, baseStyle: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  placeholder="Enter the base style prompt for all images..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Zap className="h-6 w-6 text-lime-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() =>
                    setImageSettings((prev) => ({
                      ...prev,
                      model: "dall-e-3",
                      quality: "hd",
                      size: "1024x1024",
                    }))
                  }
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  High Quality Preset
                </Button>
                <Button
                  onClick={() =>
                    setImageSettings((prev) => ({
                      ...prev,
                      model: "dall-e-2",
                      quality: "standard",
                      size: "512x512",
                    }))
                  }
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Fast & Cheap Preset
                </Button>
                <Button
                  onClick={() =>
                    setImageSettings((prev) => ({
                      ...prev,
                      detectionSensitivity: "high",
                      enabled: true,
                    }))
                  }
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Max Generation Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="bg-lime-400 text-slate-900 hover:bg-lime-500 font-medium px-8"
            >
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
