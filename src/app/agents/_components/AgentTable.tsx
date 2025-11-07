"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AgentType } from "../types";

interface AgentTableProps {
  agents: AgentType[];
  onEdit: (agent: AgentType) => void;
  onDelete: (agentId: string) => void;
}

export const AgentTable = ({ agents, onEdit, onDelete }: AgentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Créé le</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>{agent.name}</TableCell>
            <TableCell>{agent.phone}</TableCell>
            <TableCell>
              {new Date(agent.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(agent)}>
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(agent.id)}
              >
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
