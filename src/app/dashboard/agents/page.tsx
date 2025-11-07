"use client";
import { useState, useEffect } from "react";
import { AgentType } from "./types";
import { AgentTable } from "./_components/AgentTable";
import { AgentForm } from "./_components/AgentForm";

export default function AgentsPage() {
  const adminId = "adminId"; // remplacer par l'ID réel de l'admin connecté
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [editingAgent, setEditingAgent] = useState<AgentType | null>(null);

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
  async function fetchAgents() {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data);
  }

  async function handleDelete(agentId: string) {
    await fetch(`/api/agents?id=${agentId}`, { method: "DELETE" });
    fetchAgents();
  }

  async function handleSubmit(data: {
    name: string;
    phone: string;
    pin?: string;
  }) {
    if (editingAgent) {
      // Modifier
      await fetch("/api/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingAgent.id, ...data }),
      });
      setEditingAgent(null);
    } else {
      // Ajouter
      await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: adminId }),
      });
    }
    fetchAgents();
  }

  return (
    <div className="space-y-6">
      <AgentForm agent={editingAgent ?? undefined} onSubmit={handleSubmit} />
      <AgentTable
        agents={agents}
        onEdit={setEditingAgent}
        onDelete={handleDelete}
      />
    </div>
  );
}
