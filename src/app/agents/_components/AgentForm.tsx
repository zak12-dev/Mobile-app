"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgentType } from "../types";

interface AdminOption {
  id: string;
  name: string;
}

interface AgentFormProps {
  agent?: AgentType;
  onSubmit: (data: {
    name: string;
    phone: string;
    pin?: string;
    userId: string;
  }) => void;
}

export const AgentForm = ({ agent, onSubmit }: AgentFormProps) => {
  const [name, setName] = useState(agent?.name || "");
  const [phone, setPhone] = useState(agent?.phone || "");
  const [pin, setPin] = useState(agent?.pin || "");
  const [userId, setUserId] = useState(agent?.userId || "");
  const [admins, setAdmins] = useState<AdminOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        console.log("Fetch des admins en cours...");
        const res = await fetch("/api/users");
        const data = await res.json();
        console.log("Admins récupérés :", data);
        setAdmins(data);

        // Assigner automatiquement le premier admin si userId vide
        if (!userId && data.length > 0) {
          setUserId(data[0].id);
          console.log("userId initialisé à :", data[0].id);
        }
      } catch (error) {
        console.error("Erreur fetch admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Veuillez sélectionner un administrateur !");
      return;
    }

    const dataToSubmit = { name, phone, pin, userId };
    console.log("Données envoyées au submit :", dataToSubmit);

    onSubmit(dataToSubmit);
  };

  if (loading) return <p>Chargement des administrateurs...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Téléphone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        placeholder="PIN (facultatif)"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 rounded"
        required
      >
        {admins.map((admin) => (
          <option key={admin.id} value={admin.id}>
            {admin.name}
          </option>
        ))}
      </select>

      <Button type="submit">{agent ? "Modifier" : "Ajouter"}</Button>
    </form>
  );
};
