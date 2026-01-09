import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';

const statusColors = {
  active: { bg: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', label: 'Ativo' },
  inactive: { bg: 'rgba(160, 174, 192, 0.1)', color: '#a0aec0', label: 'Inativo' },
  pending: { bg: 'rgba(237, 137, 54, 0.1)', color: '#ed8936', label: 'Pendente' },
  completed: { bg: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', label: 'Concluído' },
  matured: { bg: 'rgba(102, 126, 234, 0.1)', color: '#667eea', label: 'Vencido' },
  failed: { bg: 'rgba(245, 101, 101, 0.1)', color: '#f56565', label: 'Falhou' },
};

export default function DataTable({
  columns,
  data,
  loading = false,
  onRowClick,
  paginated = true,
  rowsPerPageOptions = [10, 25, 50],
  initialRowsPerPage = 10,
  emptyMessage = 'Nenhum dado disponível',
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedData = paginated
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  const renderCell = (value, column) => {
    if (column.render) {
      return column.render(value);
    }

    if (column.format === 'currency') {
      return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
    }

    if (column.format === 'percentage') {
      return `${Number(value).toFixed(2)}%`;
    }

    if (column.format === 'date') {
      return new Date(value).toLocaleDateString('pt-BR');
    }

    if (column.format === 'status' && statusColors[value]) {
      const status = statusColors[value];
      return (
        <Chip
          label={status.label}
          size="small"
          sx={{
            backgroundColor: status.bg,
            color: status.color,
            fontWeight: 600,
            border: `1px solid ${status.color}20`,
          }}
        />
      );
    }

    return value;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.8) 0%, rgba(15, 23, 36, 0.8) 100%)',
        border: '1px solid rgba(230, 238, 248, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            position: 'relative',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && data.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#a0aec0' }}>
            {emptyMessage}
          </Typography>
        </Box>
      )}

      {!loading && data.length > 0 && (
        <>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
                  '& th': {
                    fontWeight: 700,
                    color: '#667eea',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      py: 2,
                      px: 2,
                      borderBottom: 'none',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{
                    borderBottom: '1px solid rgba(230, 238, 248, 0.05)',
                    backgroundColor: 'transparent',
                    transition: 'all 200ms',
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    },
                    '& td': {
                      color: '#e6eef8',
                      fontSize: '0.95rem',
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      align={column.align || 'left'}
                      sx={{
                        py: 2,
                        px: 2,
                        borderBottom: 'none',
                      }}
                    >
                      {renderCell(row[column.id], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginated && (
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid rgba(230, 238, 248, 0.1)',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: '#a0aec0',
                  margin: 0,
                },
                '& .MuiTablePagination-select': {
                  color: '#e6eef8',
                },
                '& button': {
                  color: '#667eea',
                },
              }}
            />
          )}
        </>
      )}
    </TableContainer>
  );
}
