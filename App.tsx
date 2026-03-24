import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import Leaderboard from "./components/Leaderboard";
import { fetchDrivers, fetchRaceRounds } from "./services/dataService";
import { Driver, RaceRound } from "./types";
import { SERIES_LIST, SERIES_RULES } from "./constants";

const App: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [raceRounds, setRaceRounds] = useState<RaceRound[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(SERIES_LIST[0].id);
  const [loading, setLoading] = useState(true);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadSeriesData = async () => {
      setLoading(true);
      setDrivers([]);
      setColumns([]);
      setRaceRounds([]);
      setSelectedRound("");
      try {
        const roundsData = await fetchRaceRounds(selectedSeries);
        if (cancelled) return;
        setRaceRounds(roundsData);
        setSelectedRound(roundsData.length > 0 ? String(roundsData[0].id) : "");
        if (roundsData.length === 0) setLoading(false);
      } catch (error) {
        if (!cancelled) console.error("Failed to load series data", error);
        if (!cancelled) setLoading(false);
      }
    };
    loadSeriesData();
    return () => {
      cancelled = true;
    };
  }, [selectedSeries]);

  useEffect(() => {
    if (!selectedRound) {
      setDrivers([]);
      setColumns([]);
      return;
    }
    let cancelled = false;
    const loadDriversData = async () => {
      setLoading(true);
      setDrivers([]);
      try {
        const { drivers: driversData, columns: columnsData } = await fetchDrivers(selectedSeries, selectedRound);
        if (cancelled) return;
        setDrivers(driversData);
        setColumns(columnsData);
      } catch (error) {
        if (!cancelled) console.error("Failed to load drivers", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDriversData();
    return () => {
      cancelled = true;
    };
  }, [selectedRound, selectedSeries]);

  const currentSeriesRules = SERIES_RULES[selectedSeries];

  useEffect(() => {
    const sendHeight = () => {
      if (appRef.current) {
        window.parent.postMessage({ type: "resize", height: appRef.current.offsetHeight }, "*");
      }
    };
    const resizeObserver = new ResizeObserver(sendHeight);
    if (appRef.current) resizeObserver.observe(appRef.current);
    sendHeight();
    window.addEventListener("resize", sendHeight);
    const timeoutId = setTimeout(sendHeight, 500);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", sendHeight);
      clearTimeout(timeoutId);
    };
  }, [drivers, raceRounds, selectedSeries, selectedRound]);

  return (
    <div ref={appRef} className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-10 pt-4 md:px-6">
      <Header
        title={currentSeriesRules?.title}
        seriesId={selectedSeries}
        rules={currentSeriesRules}
        seriesList={SERIES_LIST}
        selectedSeries={selectedSeries}
        onSeriesChange={setSelectedSeries}
      />
      {/* 桌面端赛事切换，移动端隐藏（移动端已融入 Header） */}
      <div className="hidden md:block">
        <FilterBar
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
          seriesList={SERIES_LIST}
        />
      </div>
      <Leaderboard
        key={selectedSeries}
        drivers={drivers}
        seriesId={selectedSeries}
        isLoading={loading}
        columns={columns}
        rounds={raceRounds}
        selectedRound={selectedRound}
        onRoundChange={setSelectedRound}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  );
};

export default App;
