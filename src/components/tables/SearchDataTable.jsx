import { useState, useMemo } from 'react';
import DataTable from './DataTable';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const SearchableDataTable = ({ columns, rows, checkboxSelection = false, onRowClick, actionButton }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const muiTheme = useMuiTheme();

  // Filter rows based on search term across all fields
  const filteredRows = useMemo(() => {
    // ...existing code...
  }, [rows, columns, searchTerm]);

  return (
    <div>
      {/* Search Bar and Action Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <div style={{ flexGrow: 1, marginRight: '10px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: `1px solid ${muiTheme.palette.mode === 'dark' ? muiTheme.palette.divider : '#ccc'}`,
              backgroundColor: muiTheme.palette.mode === 'dark' ? muiTheme.palette.surfaceContainer : '#fff',
              color: muiTheme.palette.text.primary
            }}
          />
        </div>
        {actionButton && actionButton}
      </div>
      <DataTable 
        rows={filteredRows} 
        columns={columns} 
        checkboxSelection={checkboxSelection}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default SearchableDataTable;