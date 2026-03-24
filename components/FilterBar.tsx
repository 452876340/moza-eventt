import React from "react";
import { Series } from "../types";

interface FilterBarProps {
  selectedSeries: string;
  setSelectedSeries: (val: string) => void;
  seriesList: Series[];
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedSeries, setSelectedSeries, seriesList }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {seriesList.map((series) => (
        <button
          key={series.id}
          onClick={() => setSelectedSeries(series.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
            selectedSeries === series.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
        >
          {series.name}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
