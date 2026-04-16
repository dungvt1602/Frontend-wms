export interface Zone {
  id: string;
  name: string;
  type: string;
  slots: number;
  used: number;
  temp: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  totalArea: number;
  status: "active" | "maintenance" | "inactive";
  features: string[];
  zones: Zone[];
}
