"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Chart from "@/app/dashboard/agents/_components/ChartContainer";

// Typage strict selon le modèle Prisma
type Agent = {
  id: string;
  name: string;
  phone: string;
  pin?: string;
  createdAt: string;
};

type ModalMode = "add" | "edit" | "delete";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [open, setOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [mode, setMode] = useState<ModalMode>("add");

  // 🔹 Charger les agents depuis l'API au montage
  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error("Erreur lors du chargement des agents", error);
    }
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

  // 🔹 Ouvrir modal
  const handleOpen = (mode: ModalMode, agent: Agent | null = null) => {
    setMode(mode);
    setCurrentAgent(
      agent ?? { id: "", name: "", phone: "", pin: "", createdAt: "" }
    );
    setOpen(true);
  };

  // 🔹 Supprimer un agent
  const handleDelete = async () => {
    if (!currentAgent?.id) return;

    try {
      await fetch(`/api/agents?id=${currentAgent.id}`, { method: "DELETE" });
      setAgents(agents.filter((a) => a.id !== currentAgent.id));
      setOpen(false);
    } catch (error) {
      console.error("Erreur suppression agent", error);
    }
  };

  // 🔹 Ajouter ou modifier un agent
  const handleSave = async () => {
    if (!currentAgent) return;

    try {
      if (mode === "edit" && currentAgent.id) {
        const res = await fetch("/api/agents", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentAgent),
        });
        const updated = await res.json();
        setAgents(agents.map((a) => (a.id === updated.id ? updated : a)));
      } else if (mode === "add") {
        // Remplacer "userId" par l'ID de l'utilisateur courant si nécessaire
        const res = await fetch("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...currentAgent, userId: "USER_ID" }),
        });
        const newAgent = await res.json();
        setAgents([newAgent, ...agents]);
      }

      setOpen(false);
    } catch (error) {
      console.error("Erreur sauvegarde agent", error);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Liste des agents</h1>
        <Button
          onClick={() => handleOpen("add")}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Ajouter
        </Button>
      </div>

      {/* Tableau */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-semibold">Nom</TableHead>
              <TableHead className="text-lg font-semibold">Téléphone</TableHead>
              <TableHead className="text-lg font-semibold">PIN</TableHead>
              <TableHead className="text-lg font-semibold">Créé le</TableHead>
              <TableHead className="text-lg font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.phone}</TableCell>
                <TableCell>{agent.pin || "-"}</TableCell>
                <TableCell>
                  {new Date(agent.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpen("edit", agent)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpen("delete", agent)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg sm:mx-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" && "Ajouter un agent"}
              {mode === "edit" && "Modifier l'agent"}
              {mode === "delete" && "Supprimer l'agent"}
            </DialogTitle>
          </DialogHeader>

          {mode === "delete" ? (
            <p className="py-4">
              Voulez-vous vraiment supprimer l’agent{" "}
              <strong>{currentAgent?.name}</strong> ?
            </p>
          ) : (
            <div className="grid gap-4 py-4">
              <div>
                <Label>Nom</Label>
                <Input
                  value={currentAgent?.name || ""}
                  onChange={(e) =>
                    setCurrentAgent({ ...currentAgent!, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  value={currentAgent?.phone || ""}
                  onChange={(e) =>
                    setCurrentAgent({ ...currentAgent!, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>PIN (optionnel)</Label>
                <Input
                  value={currentAgent?.pin || ""}
                  onChange={(e) =>
                    setCurrentAgent({ ...currentAgent!, pin: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {mode === "delete" ? (
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            ) : (
              <Button onClick={handleSave}>
                {mode === "edit" ? "Modifier" : "Ajouter"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Graphique */}
      <div className="mt-6">
        <Chart />
      </div>
    </div>
  );
}
