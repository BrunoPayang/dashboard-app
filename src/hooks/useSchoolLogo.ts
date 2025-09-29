import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
// Temporarily disabled: import { useGetSchoolConfigurationQuery } from '../features/school/schoolApi';

export const useSchoolLogo = () => {
  const school = useSelector((state: RootState) => state.auth.school);
  
  // Temporarily disable API calls to prevent infinite loops
  // TODO: Fix the underlying RTK Query issue
  // const configuration = useGetSchoolConfigurationQuery(school?.id || '', { skip: !school?.id });

  // Fallback to basic school logo for now
  const logoUrl = school?.logo || null;
  
  return {
    logoUrl,
    hasLogo: Boolean(logoUrl),
    isFromConfiguration: false, // Temporarily disabled
    isFromSchool: Boolean(school?.logo),
  };
};