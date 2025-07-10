
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Paintbrush } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [activeColorTheme, setActiveColorTheme] = React.useState("");

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
    const currentClasses = document.body.className.split(' ');
    const otherColorClasses = colorThemes.map(t => t.value).filter(t => t !== '');
    
    // Remove other color theme classes
    const filteredClasses = currentClasses.filter(c => !otherColorClasses.includes(c));
    
    // Add the new theme class if it exists
    if (newTheme) {
      filteredClasses.push(newTheme);
    }
    
    document.body.className = filteredClasses.join(' ');
    localStorage.setItem("color-theme", newTheme);
    setActiveColorTheme(newTheme);
  };
  
  React.useEffect(() => {
    const savedColorTheme = localStorage.getItem("color-theme") || "";
    handleColorThemeChange(savedColorTheme);
    
    // Set active theme on initial load
    const currentTheme = colorThemes.find(ct => document.body.classList.contains(ct.value))?.value || "";
    setActiveColorTheme(currentTheme);
  }, []);

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
