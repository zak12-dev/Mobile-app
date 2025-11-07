"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
  phone?: string;
  pin?: string;
  user: User;
}

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [users, setUsers] = useState<User[]>([]); // liste des users pour le select
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [userId, setUserId] = useState(""); // user sélectionné

  // Fetch agents
  const fetchAgents = async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data);
  };

  // Fetch users
  const fetchUsers = async () => {
    const res = await fetch("/api/users"); // créer cette route si elle n'existe pas
    const data = await res.json();
    setUsers(data);
    if (data.length > 0) setUserId(data[0].id); // sélection par défaut du premier user
  };
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents");
        const data = await res.json();
        setAgents(data); // ✅ OK ici, car c'est dans une fonction async interne
      } catch (error) {
        console.error(error);
      }
    };

    fetchAgents(); // on appelle la fonction async ici
  }, []);

  const handleAdd = async () => {
    if (!userId) return alert("Veuillez sélectionner un utilisateur");

    await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, pin, userId }),
    });

    setName("");
    setPhone("");
    setPin("");
    fetchAgents();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/agents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteId: id }),
    });
    fetchAgents();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Liste des Agents</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Nom"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Téléphone"
          className="border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="PIN"
          className="border p-2 rounded"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      <ul className="space-y-2">
        {agents.map((agent) => (
          <li
            key={agent.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>
              {agent.name} - {agent.phone} - {agent.pin} - {agent.user?.name}
            </span>
            <button
              onClick={() => handleDelete(agent.id)}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
