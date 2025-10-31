-- Create dim_event table
CREATE TABLE public.dim_event (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_code TEXT NOT NULL,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('shows/festivais', 'executivo', 'futebol', 'infantil', 'tour')),
  capacity INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create dim_respondent table
CREATE TABLE public.dim_respondent (
  respondent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gender TEXT,
  age_band TEXT,
  transport_mode TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create fct_response table
CREATE TABLE public.fct_response (
  response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.dim_event(event_id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES public.dim_respondent(respondent_id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer_value TEXT,
  answer_numeric NUMERIC,
  answer_array JSONB,
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- Create fct_collection_quality table
CREATE TABLE public.fct_collection_quality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.dim_event(event_id) ON DELETE CASCADE,
  invites_sent INTEGER NOT NULL DEFAULT 0,
  responses_total INTEGER NOT NULL DEFAULT 0,
  complete_responses INTEGER NOT NULL DEFAULT 0,
  sent_delay_hours NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create fct_micro_nps table (opcional para pulso em tempo real)
CREATE TABLE public.fct_micro_nps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.dim_event(event_id) ON DELETE CASCADE,
  activation TEXT,
  nps_score NUMERIC,
  collected_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dim_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dim_respondent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fct_response ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fct_collection_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fct_micro_nps ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (ajustar conforme necessário)
CREATE POLICY "Allow public read access to dim_event"
  ON public.dim_event FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to dim_respondent"
  ON public.dim_respondent FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to fct_response"
  ON public.fct_response FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to fct_collection_quality"
  ON public.fct_collection_quality FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to fct_micro_nps"
  ON public.fct_micro_nps FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_fct_response_event_id ON public.fct_response(event_id);
CREATE INDEX idx_fct_response_respondent_id ON public.fct_response(respondent_id);
CREATE INDEX idx_fct_response_question_id ON public.fct_response(question_id);
CREATE INDEX idx_fct_response_answered_at ON public.fct_response(answered_at);
CREATE INDEX idx_dim_event_date ON public.dim_event(event_date);
CREATE INDEX idx_fct_micro_nps_event_id ON public.fct_micro_nps(event_id);
CREATE INDEX idx_fct_micro_nps_collected_at ON public.fct_micro_nps(collected_at);