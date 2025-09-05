import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Receipt,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useGetPaymentRecordsQuery } from '../../../services/api/paymentApi';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { 
  togglePaymentSelection, 
  selectAllPayments, 
  clearPaymentSelection 
} from '../paymentSlice';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentTypeIcon from './PaymentTypeIcon';
import type { PaymentRecord } from '../../../types/payment';

interface PaymentListProps {
  onEditPayment: (payment: PaymentRecord) => void;
  onDeletePayment: (paymentId: number) => void;
  onMarkAsPaid: (paymentId: number) => void;
}

const PaymentList: React.FC<PaymentListProps> = ({
  onEditPayment,
  onDeletePayment,
  onMarkAsPaid,
}) => {
  const dispatch = useAppDispatch();
  const { selectedPayments, filters } = useAppSelector((state) => state.payments);
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  const { data, isLoading, error } = useGetPaymentRecordsQuery({
    ...filters,
    page: page + 1,
    page_size: pageSize,
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && data?.results) {
      dispatch(selectAllPayments(data.results.map((payment) => payment.id)));
    } else {
      dispatch(clearPaymentSelection());
    }
  };

  const handleSelectPayment = (paymentId: number) => {
    dispatch(togglePaymentSelection(paymentId));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, payment: PaymentRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const isSelected = (paymentId: number) => selectedPayments.includes(paymentId);

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Skeleton variant="rectangular" width={20} height={20} />
              </TableCell>
              {['Student', 'Amount', 'Type', 'Status', 'Due Date', 'Actions'].map((header) => (
                <TableCell key={header}>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Skeleton variant="rectangular" width={20} height={20} />
                </TableCell>
                {[...Array(6)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Échec du chargement des enregistrements de paiement. Veuillez réessayer.
      </Alert>
    );
  }

  if (!data?.results?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <PaymentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Aucun enregistrement de paiement trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Essayez d'ajuster vos filtres ou créez un nouvel enregistrement de paiement.
        </Typography>
      </Paper>
    );
  }

  const numSelected = selectedPayments.length;
  const rowCount = data.results.length;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Étudiant</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date d'Échéance</TableCell>
              <TableCell>Jours de Retard</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.results.map((payment) => (
              <TableRow
                key={payment.id}
                hover
                role="checkbox"
                aria-checked={isSelected(payment.id)}
                selected={isSelected(payment.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected(payment.id)}
                    onChange={() => handleSelectPayment(payment.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {payment.student_name}
                  </Typography>
                  {payment.reference_number && (
                    <Typography variant="caption" color="text.secondary">
                      Réf: {payment.reference_number}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(parseFloat(payment.amount), payment.currency)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PaymentTypeIcon type={payment.payment_type} />
                    <Typography variant="body2">
                      {payment.payment_type.replace('_', ' ').toUpperCase()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(payment.due_date)}
                  </Typography>
                  {payment.paid_date && (
                    <Typography variant="caption" color="text.secondary">
                      Payé: {formatDate(payment.paid_date)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {payment.days_overdue > 0 ? (
                    <Chip
                      label={`${payment.days_overdue} jours`}
                      color="error"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, payment)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={data.count}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedPayment) onEditPayment(selectedPayment);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 2 }} />
          Modifier le Paiement
        </MenuItem>
        
        {selectedPayment?.status === 'pending' && (
          <MenuItem onClick={() => {
            if (selectedPayment) onMarkAsPaid(selectedPayment.id);
            handleMenuClose();
          }}>
            <PaymentIcon sx={{ mr: 2 }} />
            Marquer comme Payé
          </MenuItem>
        )}
        
        {selectedPayment?.receipt_url && (
          <MenuItem onClick={() => {
            if (selectedPayment?.receipt_url) {
              window.open(selectedPayment.receipt_url, '_blank');
            }
            handleMenuClose();
          }}>
            <Receipt sx={{ mr: 2 }} />
            Voir le Reçu
          </MenuItem>
        )}
        
        <MenuItem 
          onClick={() => {
            if (selectedPayment) onDeletePayment(selectedPayment.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 2 }} />
          Supprimer le Paiement
        </MenuItem>
      </Menu>
    </>
  );
};

export default PaymentList;



