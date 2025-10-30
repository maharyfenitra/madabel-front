"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Role = "CANDIDAT" | "ADMIN" | "EVALUATEUR";

interface User {
  name: string;
  email?: string;
  phone: string;
  role: Role;
}

export const ParticipantList = () => {
  const [users, setUsers] = useState<User[]>([
    {
      name: "Mahary Rafanomezana",
      email: "mahary@example.com",
      phone: "+261 32 12 345 67",
      role: "CANDIDAT",
    },
    {
      name: "Mickaela Randrianarisoa",
      email: "mickaela@example.com",
      phone: "+261 33 45 678 90",
      role: "ADMIN",
    },
  ]);

  const handleAddUser = () => {
    const newUser: User = {
      name: "Nouvel Utilisateur",
      email: `user${users.length + 1}@example.com`,
      phone: `+261 34 00 00 ${users.length + 1}0`,
      role: "CANDIDAT",
    };
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Liste des utilisateurs</h1>
        <Button onClick={handleAddUser}>Ajouter</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Nom
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Téléphone
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Rôle
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email || "—"}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      user.role === "ADMIN"
                        ? "text-blue-600"
                        : user.role === "EVALUATEUR"
                        ? "text-purple-600"
                        : "text-green-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
