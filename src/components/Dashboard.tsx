import React, { useState, useEffect, useMemo } from 'react';
import { fetchLivePrices, aggregateTrendData } from '../services/api';
import type { CommodityRecord } from '../services/api';
import { Sidebar } from './Sidebar';
import { DataFreshness } from './DataFreshness';
import { PriceComparison } from './PriceComparison';
import { TrendChart } from './TrendChart';

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    state: 'Maharashtra', // Defaulting to something with data
    district: 'All Districts',
    market: 'All Markets',
    commodity: 'Wheat',
    variety: 'All Varieties'
  });
  
  const [records, setRecords] = useState<CommodityRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stateMetadata, setStateMetadata] = useState<CommodityRecord[]>([]);

  // Fetch the actual data based on all filters
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchLivePrices(
        filters.commodity,
        filters.state,
        filters.district,
        filters.market,
        filters.variety
      );
      if (isMounted) {
        setRecords(data);
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      loadData();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [filters]);

  // Fetch state-level metadata to populate districts and markets (ignoring commodity filter)
  useEffect(() => {
    let isMounted = true;
    const loadMetadata = async () => {
      // Fetch recent 1000 records for the state regardless of commodity
      const data = await fetchLivePrices('All Commodities', filters.state, 'All Districts', 'All Markets', 'All Varieties');
      if (isMounted) {
        setStateMetadata(data);
      }
    };
    
    if (filters.state !== 'All States') {
      loadMetadata();
    } else {
      setStateMetadata([]); // Clear if no state is selected
    }
    
    return () => {
      isMounted = false;
    };
  }, [filters.state]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'state') {
        next.district = 'All Districts';
        next.market = 'All Markets';
      }
      if (key === 'district') {
        next.market = 'All Markets';
      }
      return next;
    });
  };

  const handleReset = () => {
    setFilters({
      state: 'All States',
      district: 'All Districts',
      market: 'All Markets',
      commodity: 'Wheat',
      variety: 'All Varieties'
    });
  };

  const trendData = useMemo(() => aggregateTrendData(records), [records]);

  // Extract available options dynamically from the broader state metadata and current records
  const availableOptions = useMemo(() => {
    const districts = new Set<string>();
    const markets = new Set<string>();
    const varieties = new Set<string>();
    
    // Combine stateMetadata and records to ensure we don't miss any markets that appear in the filtered data
    const combinedData = [...stateMetadata, ...records];

    combinedData.forEach(r => {
      if (r.District) districts.add(r.District);
      if (r.Market) {
        // If a district is selected, only show markets for that district
        if (filters.district === 'All Districts' || r.District === filters.district) {
          markets.add(r.Market);
        }
      }
    });
    
    // Varieties are specific to the commodity, so we extract them from the actual filtered records
    records.forEach(r => {
      if (r.Variety) varieties.add(r.Variety);
    });

    return {
      districts: Array.from(districts).sort(),
      markets: Array.from(markets).sort(),
      varieties: Array.from(varieties).sort(),
    };
  }, [stateMetadata, records, filters.district]);

  return (
    <div className="app-container">
      <header className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)', 
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', color: '#0f172a'
          }}>
            G
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Grainology</h1>
            <div style={{ fontSize: '10px', color: 'var(--accent-green)', letterSpacing: '0.5px' }}>
              ● Live Agricultural Price Intelligence
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{records.length}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Records Loaded</div>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>1/5</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sources Active</div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <Sidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onReset={handleReset} 
          availableOptions={availableOptions}
        />
        
        <main className="content-area">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--accent-green)' }}>
              Loading latest market data...
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto' }}>
                <DataFreshness />
                <PriceComparison records={records} />
                <TrendChart data={trendData} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
