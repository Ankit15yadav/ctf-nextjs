'use client'

import { redirect } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Login = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const handleLogin = async () => {
        const deviceId = navigator.userAgent; // Simple device identifier
        const response = await fetch("https://ctf-round.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, deviceId }),
        });

        const data = await response.json();
        if (response.ok) {
            redirect(`/game/${data.userId}/${data.roomId}`);
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login to CTF Game</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full"
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                        />
                        <Button onClick={handleLogin} className="w-full">
                            Join Game
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
