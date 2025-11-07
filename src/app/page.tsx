"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./lib/api";

export default function Home() {
	const router = useRouter();
	const { getUser } = useCurrentUser();

	useEffect(() => {
		const user = getUser();
		if (user && user.role === "CANDIDAT") {
			// candidate => send to evaluations list
			router.replace("/modules/evaluations");
		} else {
			// default landing for other users
			router.replace("/modules/home");
		}
	}, [router, getUser]);

	return null;
}
