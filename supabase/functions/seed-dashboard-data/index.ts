import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    console.log('Starting to seed dashboard data...');

    // Event types
    const eventTypes = ['shows/festivais', 'executivo', 'futebol', 'infantil', 'tour'];
    const genders = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não dizer'];
    const ageBands = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const transportModes = ['Carro próprio', 'Uber/Taxi', 'Transporte público', 'A pé', 'Bicicleta'];
    
    const trophies = [
      'Qualidade do som',
      'Iluminação do palco',
      'Conforto das cadeiras',
      'Limpeza dos banheiros',
      'Variedade de comidas',
      'Atendimento da equipe',
      'Segurança do local',
      'Acessibilidade',
      'Wi-Fi disponível',
      'Estacionamento'
    ];
    
    const frustrations = [
      'Filas muito longas',
      'Preços abusivos',
      'Banheiros sujos',
      'Falta de sinalização',
      'Som muito alto',
      'Segurança deficiente',
      'Demora no atendimento',
      'Falta de opções veganas',
      'Ar-condicionado fraco',
      'Wi-Fi instável'
    ];
    
    const preferences = [
      'Rock', 'Pop', 'Sertanejo', 'Eletrônica', 'Jazz',
      'Rap', 'MPB', 'Funk', 'Reggae', 'Clássica',
      'Shows ao vivo', 'Stand-up', 'Teatro', 'Musical',
      'Conferências', 'Workshops', 'Exposições'
    ];
    
    const vibeOptions = [
      'Já adquiri ingresso para próximo evento',
      'Com certeza voltarei',
      'Talvez volte',
      'Não voltarei'
    ];

    // Create events (last 60 days)
    const events = [];
    for (let i = 0; i < 15; i++) {
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() - Math.floor(Math.random() * 60));
      
      const { data: event, error: eventError } = await supabaseClient
        .from('dim_event')
        .insert({
          event_code: `EVT${String(i + 1).padStart(3, '0')}`,
          name: `Evento ${i + 1} - ${eventTypes[Math.floor(Math.random() * eventTypes.length)]}`,
          event_date: eventDate.toISOString().split('T')[0],
          event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          capacity: 500 + Math.floor(Math.random() * 2000),
        })
        .select()
        .single();

      if (eventError) {
        console.error('Error creating event:', eventError);
        continue;
      }

      events.push(event);

      // Create collection quality
      const invitesSent = 300 + Math.floor(Math.random() * 700);
      const responsesTotal = Math.floor(invitesSent * (0.15 + Math.random() * 0.15)); // 15-30%
      const completeResponses = Math.floor(responsesTotal * (0.85 + Math.random() * 0.15)); // 85-100%

      await supabaseClient
        .from('fct_collection_quality')
        .insert({
          event_id: event.event_id,
          invites_sent: invitesSent,
          responses_total: responsesTotal,
          complete_responses: completeResponses,
          sent_delay_hours: 12 + Math.floor(Math.random() * 24),
        });

      // Create respondents and responses
      for (let j = 0; j < responsesTotal; j++) {
        // Create respondent
        const { data: respondent, error: respondentError } = await supabaseClient
          .from('dim_respondent')
          .insert({
            gender: genders[Math.floor(Math.random() * genders.length)],
            age_band: ageBands[Math.floor(Math.random() * ageBands.length)],
            transport_mode: transportModes[Math.floor(Math.random() * transportModes.length)],
          })
          .select()
          .single();

        if (respondentError) {
          console.error('Error creating respondent:', respondentError);
          continue;
        }

        // Q5 - NPS (0-10)
        const npsScore = Math.random() < 0.6 ? 7 + Math.floor(Math.random() * 4) : Math.floor(Math.random() * 7);
        await supabaseClient.from('fct_response').insert({
          event_id: event.event_id,
          respondent_id: respondent.respondent_id,
          question_id: 'Q5',
          answer_numeric: npsScore,
        });

        // Q6 - Wayfinding (1-5)
        const wayfindingScore = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 3);
        await supabaseClient.from('fct_response').insert({
          event_id: event.event_id,
          respondent_id: respondent.respondent_id,
          question_id: 'Q6',
          answer_numeric: wayfindingScore,
        });

        // Q7 - Trophies (multi-select)
        const selectedTrophies = trophies
          .sort(() => 0.5 - Math.random())
          .slice(0, 2 + Math.floor(Math.random() * 3));
        await supabaseClient.from('fct_response').insert({
          event_id: event.event_id,
          respondent_id: respondent.respondent_id,
          question_id: 'Q7',
          answer_array: selectedTrophies,
        });

        // Q8 - Frustrations (multi-select)
        const selectedFrustrations = frustrations
          .sort(() => 0.5 - Math.random())
          .slice(0, 1 + Math.floor(Math.random() * 3));
        await supabaseClient.from('fct_response').insert({
          event_id: event.event_id,
          respondent_id: respondent.respondent_id,
          question_id: 'Q8',
          answer_array: selectedFrustrations,
        });

        // Q9 - Vibe/Intention
        const vibeWeight = npsScore >= 7 ? [0.3, 0.4, 0.25, 0.05] : [0.05, 0.15, 0.40, 0.40];
        const rand = Math.random();
        let cumulativeWeight = 0;
        let selectedVibe = vibeOptions[0];
        for (let k = 0; k < vibeOptions.length; k++) {
          cumulativeWeight += vibeWeight[k];
          if (rand <= cumulativeWeight) {
            selectedVibe = vibeOptions[k];
            break;
          }
        }
        await supabaseClient.from('fct_response').insert({
          event_id: event.event_id,
          respondent_id: respondent.respondent_id,
          question_id: 'Q9',
          answer_value: selectedVibe,
        });

        // Q10 - Preferences (multi-select)
        const selectedPreferences = preferences
          .sort(() => 0.5 - Math.random())
          .slice(0, 2 + Math.floor(Math.random() * 4));
        await supabaseClient.from('fct_response').insert({
          event_id: event.event_id,
          respondent_id: respondent.respondent_id,
          question_id: 'Q10',
          answer_array: selectedPreferences,
        });
      }

      console.log(`Seeded event ${i + 1}/${events.length} with ${responsesTotal} responses`);
    }

    console.log('Dashboard data seeded successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Seeded ${events.length} events with synthetic data`,
        events: events.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error seeding data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
