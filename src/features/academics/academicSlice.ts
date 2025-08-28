import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AcademicFilters {
  student: string;
  academic_year: string;
  semester: string;
  search: string;
}

interface BehaviorFilters {
  student: string;
  report_type: 'positive' | 'negative' | 'neutral' | '';
  severity: 'low' | 'medium' | 'high' | '';
  search: string;
}

interface AcademicState {
  selectedTranscripts: number[];
  selectedBehaviorReports: number[];
  transcriptFilters: AcademicFilters;
  behaviorFilters: BehaviorFilters;
  activeTab: 'transcripts' | 'behavior' | 'statistics';
}

const initialState: AcademicState = {
  selectedTranscripts: [],
  selectedBehaviorReports: [],
  transcriptFilters: {
    student: '',
    academic_year: '',
    semester: '',
    search: '',
  },
  behaviorFilters: {
    student: '',
    report_type: '',
    severity: '',
    search: '',
  },
  activeTab: 'transcripts',
};

const academicSlice = createSlice({
  name: 'academics',
  initialState,
  reducers: {
    // Transcript actions
    setTranscriptFilters: (
      state,
      action: PayloadAction<Partial<AcademicFilters>>
    ) => {
      state.transcriptFilters = { ...state.transcriptFilters, ...action.payload };
    },
    
    clearTranscriptFilters: (state) => {
      state.transcriptFilters = initialState.transcriptFilters;
    },
    
    toggleTranscriptSelection: (state, action: PayloadAction<number>) => {
      const transcriptId = action.payload;
      const index = state.selectedTranscripts.indexOf(transcriptId);
      
      if (index > -1) {
        state.selectedTranscripts.splice(index, 1);
      } else {
        state.selectedTranscripts.push(transcriptId);
      }
    },
    
    selectAllTranscripts: (state, action: PayloadAction<number[]>) => {
      state.selectedTranscripts = action.payload;
    },
    
    clearTranscriptSelection: (state) => {
      state.selectedTranscripts = [];
    },

    // Behavior report actions
    setBehaviorFilters: (
      state,
      action: PayloadAction<Partial<BehaviorFilters>>
    ) => {
      state.behaviorFilters = { ...state.behaviorFilters, ...action.payload };
    },
    
    clearBehaviorFilters: (state) => {
      state.behaviorFilters = initialState.behaviorFilters;
    },
    
    toggleBehaviorReportSelection: (state, action: PayloadAction<number>) => {
      const reportId = action.payload;
      const index = state.selectedBehaviorReports.indexOf(reportId);
      
      if (index > -1) {
        state.selectedBehaviorReports.splice(index, 1);
      } else {
        state.selectedBehaviorReports.push(reportId);
      }
    },
    
    selectAllBehaviorReports: (state, action: PayloadAction<number[]>) => {
      state.selectedBehaviorReports = action.payload;
    },
    
    clearBehaviorReportSelection: (state) => {
      state.selectedBehaviorReports = [];
    },

    // Tab navigation
    setActiveTab: (state, action: PayloadAction<'transcripts' | 'behavior' | 'statistics'>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  setTranscriptFilters,
  clearTranscriptFilters,
  toggleTranscriptSelection,
  selectAllTranscripts,
  clearTranscriptSelection,
  setBehaviorFilters,
  clearBehaviorFilters,
  toggleBehaviorReportSelection,
  selectAllBehaviorReports,
  clearBehaviorReportSelection,
  setActiveTab,
} = academicSlice.actions;

export default academicSlice.reducer;



