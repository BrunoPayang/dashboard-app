import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { useGetSchoolConfigurationQuery } from '../features/school/schoolApi';

export const useSchoolLogo = () => {
  const school = useSelector((state: RootState) => state.auth.school);
  
  // Get school configuration to access the logo from configuration
  const { data: configuration } = useGetSchoolConfigurationQuery(school?.id || '', {
    skip: !school?.id,
  });

  // Priority: configuration logo > basic school logo > null
  const logoUrl = configuration?.logo || school?.logo || null;
  
  return {
    logoUrl,
    hasLogo: Boolean(logoUrl),
    isFromConfiguration: Boolean(configuration?.logo),
    isFromSchool: Boolean(!configuration?.logo && school?.logo),
  };
};