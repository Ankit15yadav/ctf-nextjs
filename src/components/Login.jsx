'use client'

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        const deviceId = navigator.userAgent; // Simple device identifier

        try {
            const response = await fetch("https://ctf-round.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, deviceId }),
            });

            const data = await response.json();
            if (response.ok) {
                // Use router.push for client-side navigation
                router.push(`/game/${data.userId}/${data.roomId}`);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred while trying to log in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Login to CTF Game
                    </CardTitle>
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
                        <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Join Game"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
