"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const SUPERMARKETS = [
  { id: "esselunga", name: "Esselunga", colors: ["#0b3a74", "#e10314"] },
  { id: "conad", name: "Conad", colors: ["#e30f15", "#0e643c"] },
  { id: "lidl", name: "Lidl", colors: ["#fff001", "#0850a8"] },
  { id: "eurospin", name: "Eurospin", colors: ["#2b4e9c", "#eac62c"] },
  { id: "bennet", name: "Bennet", colors: ["#fc0b07", "#1c1c1c"] },
  {
    id: "carrefourexpress",
    name: "Carrefour Express",
    colors: ["#2b8645", "#64a777"],
  },
  {
    id: "carrefourmarket",
    name: "Carrefour Market",
    colors: ["#fb0509", "#f64645"],
  },
  { id: "centesimo", name: "Centesimo", colors: ["#caaf0c", "#2a2627"] },
  { id: "crai", name: "Crai", colors: ["#ef4123", "#81b39d"] },
  { id: "gigante", name: "Gigante", colors: ["#0f2253", "#df050f"] },
  { id: "ins", name: "INS", colors: ["#fcf00d", "#124393"] },
  { id: "md", name: "MD", colors: ["#f9ea20", "#1b5fa5"] },
  { id: "todis", name: "Todis", colors: ["#035e42", "#ea5d11"] },
  { id: "paghipoco", name: "Paghi Poco", colors: ["#e00c14", "#fee80d"] },
  { id: "prestofresco", name: "Presto Fresco", colors: ["#e30f15", "#fcea04"] },
];

export default function SupermarketsPage() {
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const toggleSupermarket = (id: string) => {
    setSelectedSupermarkets((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedSupermarkets(SUPERMARKETS.map((s) => s.id));
    toast({
      title: "Tutti i supermercati selezionati",
      description: "Hai selezionato tutti i supermercati disponibili",
    });
  };

  const handleContinue = async () => {
    if (selectedSupermarkets.length === 0) {
      toast({
        variant: "destructive",
        title: "Nessun supermercato selezionato",
        description: "Seleziona almeno un supermercato per continuare",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://server-supermarket-app.onrender.com/api/users/supermarkets",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token || "",
          },
          body: JSON.stringify({
            frequentedSupermarkets: selectedSupermarkets,
          }),
        }
      );

      if (response.ok) {
        toast({
          variant: "default",
          title: "Supermercati salvati!",
          description: `Hai selezionato ${selectedSupermarkets.length} supermercati`,
        });
        router.push("/shopping-list");
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Errore nel salvataggio",
          description:
            errorData.message ||
            "Impossibile salvare i supermercati selezionati",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile connettersi al server. Riprova più tardi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/register">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Indietro
            </Button>
          </Link>
          <Badge variant="secondary">
            {selectedSupermarkets.length} selezionati
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Scegli i tuoi supermercati
          </h1>
          <p className="text-neutral-600">
            Seleziona dove fai solitamente la spesa
          </p>
        </div>

        {/* Select All Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={selectAll} className="w-full py-3">
            Seleziona Tutti
          </Button>
        </div>

        {/* Supermarkets Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {SUPERMARKETS.map((supermarket) => (
            <Card
              key={supermarket.id}
              className={`cursor-pointer transition-all duration-200 border-2 supermarket-card ${
                selectedSupermarkets.includes(supermarket.id)
                  ? "border-primary shadow-md"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
              onClick={() => toggleSupermarket(supermarket.id)}
            >
              <CardContent className="p-4">
                <div
                  className="w-full h-16 rounded-lg mb-3 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${supermarket.colors[0]}, ${supermarket.colors[1]})`,
                  }}
                >
                  <span className="text-white font-bold text-sm text-center px-2">
                    {supermarket.name}
                  </span>
                  {selectedSupermarkets.includes(supermarket.id) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-neutral-700 text-center font-medium">
                  {supermarket.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={selectedSupermarkets.length === 0 || loading}
          variant="default"
          size="lg"
          className="w-full py-3"
        >
          {loading ? "Salvataggio..." : "Continua"}
        </Button>
      </div>
    </div>
  );
}
