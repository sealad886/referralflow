
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Paintbrush } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [activeColorTheme, setActiveColorTheme] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);


  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Monitor },
  ]
  
  const colorThemes = [
     { name: "Default", value: "" },
     { name: "Stone", value: "theme-stone" },
  ]

  const handleColorThemeChange = (colorClass: string) => {
    const newTheme = colorThemes.find(t => t.value === colorClass)?.value || ""
    // All theme classes from our list
    const allColorThemeClasses = colorThemes.map(t => t.value).filter(Boolean);
    
    // Apply to <html> element
    const root = document.documentElement;
    
    // Remove any existing color theme classes
    root.classList.remove(...allColorThemeClasses);
    
    // Add the new theme class if it exists
    if (newTheme) {
      root.classList.add(newTheme);
    }
    
    localStorage.setItem("color-theme", newTheme);
    setActiveColorTheme(newTheme);
  };
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      const savedColorTheme = localStorage.getItem("color-theme") || "";
      // On mount, apply the saved theme
      handleColorThemeChange(savedColorTheme);
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="grid gap-4">
        <div>
          <Label>Color Mode</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
            <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
            <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
          </div>
        </div>
        <div>
          <Label>Color Palette</Label>
           <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
            <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
        <div>
            <Label>Color Mode</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
                {themes.map((t) => (
                    <Button 
                        key={t.value} 
                        variant={theme === t.value ? "default" : "outline"}
                        onClick={() => setTheme(t.value)}
                    >
                        <t.icon className="mr-2 h-4 w-4" />
                        {t.name}
                    </Button>
                ))}
            </div>
        </div>
        <div>
            <Label>Color Palette</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
                {colorThemes.map((ct) => (
                     <Button 
                        key={ct.value} 
                        variant={activeColorTheme === ct.value ? "default" : "outline"}
                        onClick={() => handleColorThemeChange(ct.value)}
                    >
                        <Paintbrush className="mr-2 h-4 w-4" />
                        {ct.name}
                    </Button>
                ))}
            </div>
        </div>
    </div>
  )
}
