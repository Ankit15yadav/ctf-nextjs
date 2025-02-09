"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import io from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const socket = io("https://ctf-round.onrender.com", { transports: ["websocket"] })

const GameRoom = () => {
    const { userId, roomId } = useParams()
    const [progress, setProgress] = useState(null)

    useEffect(() => {
        if (!userId || !roomId) return

        const storedProgress = localStorage.getItem("progress")
        setProgress(storedProgress ? Number(storedProgress) : 0)

        const fetchProgress = async () => {
            try {
                const response = await fetch(`https://ctf-round.onrender.com/player/progress/${userId}`)
                const data = await response.json()
                setProgress(data.progress)
                localStorage.setItem("progress", data.progress)
            } catch (error) {
                console.error("Error fetching progress:", error)
            }
        }

        fetchProgress()
        socket.emit("joinRoom", roomId)

        return () => {
            socket.off("progressUpdate")
        }
    }, [userId, roomId])

    const handleCheckpoint = async () => {
        if (progress !== null && progress < 10) {
            const newProgress = progress + 1
            setProgress(newProgress)
            localStorage.setItem("progress", newProgress)

            await fetch("https://ctf-round.onrender.com/update-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, checkpoint: newProgress }),
            })

            socket.emit("progressUpdate", { userId, checkpoint: newProgress })
        }
    }

    if (progress === null) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Game Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Checkpoint: {progress}/10</p>
                        <Progress value={progress * 10} className="w-full mt-2" />
                    </div>
                    <Button onClick={handleCheckpoint} disabled={progress >= 10} className="w-full">
                        Next Checkpoint
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default GameRoom

