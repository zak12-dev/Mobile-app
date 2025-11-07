export type CompteType = {
  id: string;
  numero: string;
};

export type TransactionType = {
  id: string;
  type: "DEPOT" | "RETRAIT" | "TRANSFERT";
  montant: number;
  clientNom: string | null;
  createdAt: string;
  compte: CompteType;
};

export type DepenseType = {
  id: string;
  libelle: string;
  montant: number;
  categorie?: string | null;
  createdAt: string;
};

export type DashboardData = {
  totalBalance: number;
  totalAgents: number;
  totalTransactions: number;
  totalDepenses: number;
  recentTransactions: TransactionType[];
  recentDepenses: DepenseType[];
};
