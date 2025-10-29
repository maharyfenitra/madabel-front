"use client"
import { redirect } from "next/navigation"
import { useAccessToken, useRefreshToken } from "@/app/lib/api"

export default function Page(){
    const { removeAccessToken} = useAccessToken()
    const { removeRefreshToken} = useRefreshToken()
    removeAccessToken()
    removeRefreshToken()
    redirect("/auth/login")
}