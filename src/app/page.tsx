"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./lib/api";

export default function Home() {
	const router = useRouter();
	const { getUser } = useCurrentUser();

	useEffect(() => {
		const user = getUser();
		if (user && user.role === "EVALUATOR") {
			// evaluator => send to evaluations list
			router.replace("/modules/evaluations");
		} else if (user && user.role === "CANDIDAT") {
			// candidate => send to reports
			router.replace("/modules/reports");
		} else {
			// default landing for other users (admin, etc.)
			router.replace("/modules/home");
		}
	}, [router, getUser]);

	return null;
}
