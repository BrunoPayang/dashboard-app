import { useState } from 'react';
import { useUpdatePaymentRecordMutation } from '../../../services/api/paymentApi';

interface BulkPaymentDetails {
  payment_method: string;
  reference_number?: string;
  receipt_url?: string;
}

interface BulkPaymentResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors: Array<{ paymentId: number; error: any }>;
}

export const useBulkPaymentActions = () => {
  const [updatePayment] = useUpdatePaymentRecordMutation();
  const [isLoading, setIsLoading] = useState(false);

  const markMultipleAsPaid = async (
    paymentIds: number[],
    paymentDetails: BulkPaymentDetails
  ): Promise<BulkPaymentResult> => {
    setIsLoading(true);
    
    const results: BulkPaymentResult = {
      success: true,
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    try {
      // Process payments in parallel
      const promises = paymentIds.map(async (paymentId) => {
        try {
          await updatePayment({
            id: paymentId,
            data: {
              status: 'paid',
              paid_date: new Date().toISOString().split('T')[0],
              payment_method: paymentDetails.payment_method as any,
              reference_number: paymentDetails.reference_number,
              receipt_url: paymentDetails.receipt_url,
            },
          }).unwrap();
          
          results.successCount++;
        } catch (error) {
          results.errorCount++;
          results.errors.push({ paymentId, error });
        }
      });

      await Promise.all(promises);

      // If any errors occurred, mark as not fully successful
      if (results.errorCount > 0) {
        results.success = false;
      }

    } catch (error) {
      results.success = false;
      console.error('Bulk payment update failed:', error);
    } finally {
      setIsLoading(false);
    }

    return results;
  };

  return {
    markMultipleAsPaid,
    isLoading,
  };
};



