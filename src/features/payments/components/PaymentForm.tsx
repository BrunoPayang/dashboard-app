import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  useCreatePaymentRecordMutation,
  useUpdatePaymentRecordMutation 
} from '../../../services/api/paymentApi';
import { useGetStudentsQuery } from '../../students/studentApi';
import type { Student } from '../../../types/student';
import { PAYMENT_TYPES, PAYMENT_STATUSES, PAYMENT_METHODS } from '../../../types/payment';
import { useAppSelector } from '../../../hooks/redux';
import type { 
  PaymentRecord, 
  CreatePaymentRequest, 
  UpdatePaymentRequest,
  PaymentType,
  PaymentStatus,
  PaymentMethod
} from '../../../types/payment';

const schema = yup.object({
  student: yup.mixed<string | number>()
    .required('Étudiant requis')
    .test('not-empty', 'Veuillez sélectionner un étudiant', (value) => {
      return value !== '' && value !== null && value !== undefined;
    }),
  amount: yup
    .string()
    .required('Montant requis')
    .matches(/^\d+(\.\d{1,2})?$/, 'Le montant doit être un nombre valide'),
  currency: yup.string().default('XOF'),
  payment_type: yup.string().required('Type de paiement requis'),
  status: yup.string().default('pending'),
  due_date: yup.string().required('Date d\'échéance requise'),
  paid_date: yup.string().nullable(),
  payment_method: yup.string().nullable(),
  reference_number: yup.string(),
  receipt_url: yup.string().url('Doit être une URL valide').nullable(),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema> & {
  student: string | number;
};

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  payment?: PaymentRecord | null;
  selectedStudentId?: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  payment,
  selectedStudentId,
}) => {
  const isEditing = Boolean(payment);
  const { user } = useAppSelector((state) => state.auth);
  
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentRecordMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentRecordMutation();
  
  const { data: studentsData } = useGetStudentsQuery({
    page: 1,
    page_size: 1000, // Get all students for dropdown
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
      defaultValues: {
    student: selectedStudentId || '',
      amount: '',
      currency: 'XOF',
      payment_type: 'tuition',
      status: 'pending',
      due_date: '',
      paid_date: null,
      payment_method: '',
      reference_number: '',
      receipt_url: null,
      notes: '',
    },
  });

  const watchedStatus = watch('status');

  useEffect(() => {
    if (open && payment) {
      reset({
        student: payment.student,
        amount: payment.amount,
        currency: payment.currency,
        payment_type: payment.payment_type,
        status: payment.status,
        due_date: payment.due_date,
        paid_date: payment.paid_date,
        payment_method: payment.payment_method || '',
        reference_number: payment.reference_number,
        receipt_url: payment.receipt_url,
        notes: payment.notes,
      });
    } else if (open && selectedStudentId) {
      reset({
        student: selectedStudentId,
        amount: '',
        currency: 'XOF',
        payment_type: 'tuition',
        status: 'pending',
        due_date: '',
        paid_date: null,
        payment_method: '',
        reference_number: '',
        receipt_url: null,
        notes: '',
      });
    } else if (open) {
      reset({
        student: '',
        amount: '',
        currency: 'XOF',
        payment_type: 'tuition',
        status: 'pending',
        due_date: '',
        paid_date: null,
        payment_method: '',
        reference_number: '',
        receipt_url: null,
        notes: '',
      });
    }
  }, [open, payment, selectedStudentId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && payment) {
        const updateData: UpdatePaymentRequest = {
          status: data.status as PaymentStatus,
          paid_date: data.paid_date || undefined,
          payment_method: data.payment_method as PaymentMethod || undefined,
          reference_number: data.reference_number,
          receipt_url: data.receipt_url || undefined,
          notes: data.notes,
        };
        
        await updatePayment({ id: payment.id, data: updateData }).unwrap();
      } else {
        // Ensure student is not empty
        if (!data.student) {
          console.error('Student field is required');
          return;
        }
        
        const createData: CreatePaymentRequest = {
          student: data.student as string | number,
          amount: data.amount,
          currency: data.currency || 'XOF',
          payment_type: data.payment_type as PaymentType,
          status: data.status as PaymentStatus || 'pending',
          due_date: data.due_date,
          notes: data.notes || '',
          created_by: user?.id, // Add current user as creator
        };
        
        await createPayment(createData).unwrap();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Failed to save payment:', error);
      
      // Handle validation errors
      if (error?.status === 400 && error?.data) {
        console.error('Validation errors:', error.data);
        // You could set form errors here if needed
        // For now, we'll just log them
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
              <DialogTitle>
        {isEditing ? 'Modifier le Paiement' : 'Créer un Paiement'}
      </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Controller
                name="student"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Étudiant"
                    select
                    fullWidth
                    error={!!errors.student}
                    helperText={errors.student?.message}
                    disabled={isEditing}
                  >
                    <MenuItem value="">Sélectionner un étudiant</MenuItem>
                    {studentsData?.results.map((student: Student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Montant"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">CFA</InputAdornment>
                      ),
                    }}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="payment_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Type de Paiement"
                    select
                    fullWidth
                    error={!!errors.payment_type}
                    helperText={errors.payment_type?.message}
                  >
                    {PAYMENT_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Statut"
                    select
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                                          label="Date d'Échéance"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.due_date}
                    helperText={errors.due_date?.message}
                  />
                )}
              />
            </Grid>

            {(watchedStatus === 'paid' || watchedStatus === 'refunded') && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="paid_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date de Paiement"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={field.value || ''}
                    />
                  )}
                />
              </Grid>
            )}

            {(watchedStatus === 'paid' || watchedStatus === 'refunded') && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="payment_method"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Méthode de Paiement"
                      select
                      fullWidth
                      value={field.value || ''}
                    >
                      <MenuItem value="">Sélectionner une méthode</MenuItem>
                      {PAYMENT_METHODS.map((method) => (
                        <MenuItem key={method.value} value={method.value}>
                          {method.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            )}

            {(watchedStatus === 'paid' || watchedStatus === 'refunded') && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="reference_number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Numéro de Référence"
                      fullWidth
                      placeholder="e.g., TXN123456789"
                    />
                  )}
                />
              </Grid>
            )}

            {(watchedStatus === 'paid' || watchedStatus === 'refunded') && (
              <Grid item xs={12}>
                <Controller
                  name="receipt_url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="URL du Reçu"
                      fullWidth
                      placeholder="https://example.com/receipt.pdf"
                      value={field.value || ''}
                      error={!!errors.receipt_url}
                      helperText={errors.receipt_url?.message}
                    />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Additional information about this payment..."
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
            startIcon={(isCreating || isUpdating) && <CircularProgress size={20} />}
          >
            {isCreating || isUpdating 
              ? (isEditing ? 'Mise à jour...' : 'Création...') 
              : (isEditing ? 'Mettre à Jour' : 'Créer le Paiement')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm;
