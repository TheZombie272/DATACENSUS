import { Database, BarChart3, Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  currentSection: "metrics" | "search" | "global";
  onSectionChange: (section: "metrics" | "search" | "global") => void;
}

export const Header = ({
  currentSection,
  onSectionChange,
}: HeaderProps) => {
  const navItems = [
    { id: "metrics" as const, label: "Análisis por ID", icon: BarChart3 },
    { id: "search" as const, label: "Agente de IA", icon: Search },
    { id: "global" as const, label: "Métricas Generales", icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo y Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-br from-[#2962FF] to-[#1E4ED8] p-2.5 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                DataCensus
              </h1>
              <p className="text-xs font-medium text-gray-600">MinTIC Analytics</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#2962FF] text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-[#2962FF] rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Navegación Mobile */}
          <div className="md:hidden flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#2962FF] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
