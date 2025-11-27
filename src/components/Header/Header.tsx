import { useState } from "react";
import { Database, Menu, X, Home, BarChart3, Bot, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  currentSection: "metrics" | "search" | "global";
  onSectionChange: (section: "metrics" | "search" | "global") => void;
  datasetId: string;
  onDatasetIdChange: (id: string) => void;
}

export const Header = ({
  currentSection,
  onSectionChange,
  datasetId,
  onDatasetIdChange,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "metrics", label: "Análisis por ID", icon: BarChart3 },
    { id: "search", label: "Agente de Búsqueda", icon: Bot },
    { id: "global", label: "Métricas Globales", icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Header Principal */}
        <div className="flex items-center justify-between py-4">
          {/* Logo y Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-br from-[#2962FF] to-[#1E4ED8] p-2.5 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2962FF]">
                DataCensus
              </h1>
              <p className="text-xs text-gray-500 font-medium">MinTIC Analytics</p>
            </div>
          </div>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentSection === id
                    ? "bg-[#2962FF] text-white shadow-lg shadow-blue-500/10"
                    : "text-gray-700 hover:bg-gray-100/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100/80 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Sub-header: Dataset Input */}
        {currentSection === "metrics" && (
          <div className="pb-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <label className="text-sm font-medium text-gray-600 flex items-center">
                Dataset ID:
              </label>
              <Input
                placeholder="Ej: 8dbv-wsjq"
                value={datasetId}
                onChange={(e) => onDatasetIdChange(e.target.value)}
                className="flex-1 h-10 bg-gray-50/50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors"
              />
              <p className="text-xs text-gray-500">
                Encuentra IDs en <strong>datos.gov.co</strong>
              </p>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-4 space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  onSectionChange(id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentSection === id
                    ? "bg-[#2962FF] text-white"
                    : "text-gray-700 hover:bg-gray-100/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
