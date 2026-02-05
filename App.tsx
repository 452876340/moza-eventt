
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Leaderboard from './components/Leaderboard';
import SeriesInfo from './components/SeriesInfo';
import { fetchDrivers, fetchRaceRounds } from './services/dataService';
import { Driver, RaceRound } from './types';
import { SERIES_LIST, SERIES_RULES } from './constants';

const App: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [raceRounds, setRaceRounds] = useState<RaceRound[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  const [selectedSeries, setSelectedSeries] = useState(SERIES_LIST[0].id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeriesData = async () => {
      setLoading(true);
      try {
        const roundsData = await fetchRaceRounds(selectedSeries);
        setRaceRounds(roundsData);
        
        // Reset selected round when series changes or rounds data is loaded
        if (roundsData.length > 0) {
          setSelectedRound(String(roundsData[0].id));
        } else {
          setSelectedRound('');
          setDrivers([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load series data', error);
        setLoading(false);
      }
    };
    loadSeriesData();
  }, [selectedSeries]);

  useEffect(() => {
    if (!selectedRound) return;

    const loadDriversData = async () => {
      setLoading(true);
      try {
        const driversData = await fetchDrivers(selectedSeries, selectedRound);
        setDrivers(driversData);
      } catch (error) {
        console.error('Failed to load drivers', error);
      } finally {
        setLoading(false);
      }
    };

    loadDriversData();
  }, [selectedRound, selectedSeries]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, drivers]);

  const currentSeriesRules = SERIES_RULES[selectedSeries];

  // Auto-resize iframe logic
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
    };

    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    sendHeight();
    window.addEventListener('resize', sendHeight);
    
    const timeoutId = setTimeout(sendHeight, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', sendHeight);
      clearTimeout(timeoutId);
    };
  }, [drivers, raceRounds, selectedSeries, selectedRound]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="w-full flex flex-col items-center">
        <Header title={currentSeriesRules?.title} seriesId={selectedSeries} />
        <FilterBar 
          search={search} 
          setSearch={setSearch} 
          selectedRound={selectedRound} 
          setSelectedRound={setSelectedRound} 
          rounds={raceRounds}
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
          seriesList={SERIES_LIST}
        />
        <Leaderboard drivers={filteredDrivers} seriesId={selectedSeries} isLoading={loading} />
        {currentSeriesRules && <SeriesInfo rules={currentSeriesRules} />}
      </main>
      
    </div>
  );
};

export default App;
