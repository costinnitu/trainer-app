const translations = {
  en: {
    /* ---------- Navigation ---------- */

    dashboard: 'Dashboard',
    clients: 'Clients',
    weeklySchedule: 'Weekly Schedule',
    programs: 'Programs',
    exercises: 'Exercises',
    settings: 'Settings',
    welcome: 'Welcome',
    logout: 'Logout',

    /* ---------- Common ---------- */

    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    notes: 'Notes',
    phone: 'Phone',
    email: 'Email',
    goal: 'Goal',

    /* ---------- Statuses ---------- */

    active: 'Active',
    paused: 'Paused',
    inactive: 'Inactive',
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',

    /* ---------- Dashboard ---------- */

    couldNotLoadDashboardData: 'Could not load dashboard data',
    totalClients: 'Total Clients',
    activeClients: 'Active Clients',
    todaysAppointments: "Today’s Appointments",
    upcomingAppointments: 'Upcoming Appointments',
    noAppointmentsToday: 'No appointments today.',
    noUpcomingAppointments: 'No upcoming appointments.',

    /* ---------- Clients ---------- */

    addClient: 'Add Client',
    searchClients: 'Search clients...',
    loadingClients: 'Loading clients...',
    firstName: 'First name',
    lastName: 'Last name',
    saveClient: 'Save Client',
    updateClient: 'Update Client',
    couldNotLoadClients: 'Could not load clients',
    couldNotSaveClient: 'Could not save client',
    couldNotDeleteClient: 'Could not delete client',
    couldNotUpdateClient: 'Could not update client',
    confirmDeleteClient: 'Are you sure you want to delete this client?',
    client: 'Client',
    assignedPrograms: 'Assigned Programs',
    assignedClients: 'Assigned Clients',
    noClientsAssigned: 'No clients assigned.',

    /* ---------- Weekly Schedule ---------- */

    previous: 'Previous',
    today: 'Today',
    next: 'Next',
    cancelEdit: 'Cancel Edit',
    deleteAppointment: 'Delete Appointment',
    selectClient: 'Select client',
    saveAppointment: 'Save Appointment',
    updateAppointment: 'Update Appointment',
    couldNotLoadWeeklySchedule: 'Could not load weekly schedule',
    appointmentOverlap: 'This appointment overlaps with another appointment.',
    confirmDeleteAppointment: 'Are you sure you want to delete this appointment?',
    invalidAppointmentTime: 'End time must be after start time.',
    appointmentPastDate: 'Appointment date cannot be in the past.',

    /* ---------- Programs ---------- */

    trainingPrograms: 'Training Programs',
    addProgram: 'Add Program',
    noProgramsYet: 'No programs yet.',
    programName: 'Program Name',
    duration: 'Duration',
    durationWeeks: 'Duration (weeks)',
    weeks: 'weeks',
    programNotes: 'Program Notes',
    updateProgram: 'Update Program',
    saveProgram: 'Save Program',
    noExercisesAdded: 'No exercises added.',
    couldNotLoadPrograms: 'Could not load programs',
    couldNotSaveProgram: 'Could not save program',
    couldNotUpdateProgram: 'Could not update program',
    couldNotDeleteProgram: 'Could not delete program',
    confirmDeleteProgram: 'Are you sure you want to delete this program?',

    /* ---------- Exercises ---------- */

    exerciseLibrary: 'Exercise Library',
    exercise: 'Exercise',
    exerciseName: 'Exercise name',
    addExercise: 'Add Exercise',
    updateExercise: 'Update Exercise',
    saveExercise: 'Save Exercise',
    selectExercise: 'Select exercise',
    searchExercises: 'Search exercises...',
    noExercisesFound: 'No exercises found.',
    favorites: 'Favorites',
    favoriteExercise: 'Favorite exercise',
    bodyPart: 'Body part',
    equipment: 'Equipment',
    defaultNotes: 'Default notes',
    sets: 'Sets',
    reps: 'Reps',
    rest: 'Rest',
    couldNotLoadExercises: 'Could not load exercises',
    couldNotSaveExercise: 'Could not save exercise',
    couldNotUpdateExercise: 'Could not update exercise',
    couldNotDeleteExercise: 'Could not delete exercise',
    couldNotUpdateFavorite: 'Could not update favorite',
    confirmDeleteExercise: 'Are you sure you want to delete this exercise?',

    /* ---------- Body Parts ---------- */

    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    arms: 'Arms',
    legs: 'Legs',
    core: 'Core',
    fullBody: 'Full Body',
    cardio: 'Cardio',

    /* ---------- Settings ---------- */

    trainerProfile: 'Trainer Profile',
    schedulePreferences: 'Schedule Preferences',
    appPreferences: 'App Preferences',

    /* ---------- App Preferences ---------- */

    loadingAppPreferences: 'Loading app preferences...',
    darkMode: 'Dark mode',
    language: 'Language',
    languageSaved: 'Language preference saved. It will apply after the next login.',
    couldNotLoadAppPreferences: 'Could not load app preferences',
    couldNotSaveAppPreferences: 'Could not save app preferences',
    couldNotSaveLanguage: 'Could not save language preference',

    /* ---------- Trainer Profile ---------- */

    loadingProfile: 'Loading profile...',
    trainerName: 'Trainer name',
    businessName: 'Business name',
    trainer: 'Trainer',
    saveProfile: 'Save Profile',
    updateProfile: 'Update Profile',
    editProfile: 'Edit Profile',
    couldNotLoadTrainerProfile: 'Could not load trainer profile',
    couldNotSaveTrainerProfile: 'Could not save trainer profile',

    /* ---------- Schedule Preferences ---------- */

    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    workingDays: 'Working days',
    workingHours: 'Working hours',
    minutes: 'minutes',
    defaultSessionDuration: 'Default session duration',
    saveSchedulePreferences: 'Save Schedule Preferences',
    updateSchedulePreferences: 'Update Schedule Preferences',
    editSchedulePreferences: 'Edit Schedule Preferences',
    loadingSchedulePreferences: 'Loading schedule preferences...',
    invalidWorkingHours: 'Work end time must be after work start time.',
    couldNotLoadSchedulePreferences: 'Could not load schedule preferences',
    couldNotSaveSchedulePreferences: 'Could not save schedule preferences',


    contacts: 'Contacts',
    contact: 'Contact',
    addContact: 'Add Contact',
    searchContacts: 'Search contacts...',
    source: 'Source',

    new: 'New',
    contacted: 'Contacted',
    interested: 'Interested',
    notInterested: 'Not Interested',
    converted: 'Converted',

    saveContact: 'Save Contact',
    updateContact: 'Update Contact',

    couldNotLoadContacts: 'Could not load contacts',
    couldNotSaveContact: 'Could not save contact',
    couldNotUpdateContact: 'Could not update contact',
    couldNotDeleteContact: 'Could not delete contact',
    confirmDeleteContact: 'Are you sure you want to delete this contact?',
    convert: 'Convert',
    confirmConvertContact: 'Convert this contact into a client?',
    couldNotConvertContact: 'Could not convert contact',



    clientStatusPreferences: 'Client Status Preferences',
    enableAutoClientStatus: 'Enable automatic client status',
    autoPauseAfterDays: 'Auto-pause after days without appointments',
    saveClientStatusPreferences: 'Save Client Status Preferences',
    loadingClientStatusPreferences: 'Loading client status preferences...',
    couldNotLoadClientStatusPreferences: 'Could not load client status preferences',
    couldNotSaveClientStatusPreferences: 'Could not save client status preferences',


    paymentTracking: 'Payment Tracking',
    appointment: 'Appointment',
    program: 'Program',
    type: 'Type',
    description: 'Description',
    paid: 'Paid',
    unpaid: 'Unpaid',
    markPaid: 'Mark Paid',
    markUnpaid: 'Mark Unpaid',
    noBillableItems: 'No billable items yet.',
    couldNotLoadPayments: 'Could not load payments',
    couldNotUpdatePayment: 'Could not update payment',

    payments: 'Payments',
    allPaid: 'All Paid',
    missingPayments: 'Missing Payments',
    noPayments: 'No Payments',
    partialPayments: 'Pagamenti Parziali',
    noPaymentsMade: 'Nessun Pagamento',



  },

  it: {
    /* ---------- Navigazione ---------- */

    dashboard: 'Dashboard',
    clients: 'Clienti',
    weeklySchedule: 'Calendario',
    programs: 'Schede',
    exercises: 'Esercizi',
    settings: 'Impostazioni',
    welcome: 'Benvenuto',
    logout: 'Esci',

    /* ---------- Comune ---------- */

    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    status: 'Stato',
    date: 'Data',
    time: 'Orario',
    notes: 'Note',
    phone: 'Telefono',
    email: 'Email',
    goal: 'Obiettivo',

    /* ---------- Stati ---------- */

    active: 'Attivo',
    paused: 'In pausa',
    inactive: 'Inattivo',
    scheduled: 'Programmato',
    completed: 'Completato',
    cancelled: 'Annullato',

    /* ---------- Dashboard ---------- */

    couldNotLoadDashboardData: 'Impossibile caricare i dati della dashboard',
    totalClients: 'Clienti Totali',
    activeClients: 'Clienti Attivi',
    todaysAppointments: 'Appuntamenti di Oggi',
    upcomingAppointments: 'Prossimi Appuntamenti',
    noAppointmentsToday: 'Nessun appuntamento oggi.',
    noUpcomingAppointments: 'Nessun appuntamento in arrivo.',

    /* ---------- Clienti ---------- */

    addClient: 'Aggiungi Cliente',
    searchClients: 'Cerca clienti...',
    loadingClients: 'Caricamento clienti...',
    firstName: 'Nome',
    lastName: 'Cognome',
    saveClient: 'Salva Cliente',
    updateClient: 'Aggiorna Cliente',
    couldNotLoadClients: 'Impossibile caricare i clienti',
    couldNotSaveClient: 'Impossibile salvare il cliente',
    couldNotDeleteClient: 'Impossibile eliminare il cliente',
    couldNotUpdateClient: 'Impossibile aggiornare il cliente',
    confirmDeleteClient: 'Vuoi davvero eliminare questo cliente?',
    client: 'Cliente',
    assignedPrograms: 'Programmi Assegnati',
    assignedClients: 'Clienti Assegnati',
    noClientsAssigned: 'Nessun cliente assegnato.',

    /* ---------- Programma Settimanale ---------- */

    previous: 'Precedente',
    today: 'Oggi',
    next: 'Successivo',
    cancelEdit: 'Annulla Modifica',
    deleteAppointment: 'Elimina Appuntamento',
    selectClient: 'Seleziona cliente',
    saveAppointment: 'Salva Appuntamento',
    updateAppointment: 'Aggiorna Appuntamento',
    couldNotLoadWeeklySchedule: 'Impossibile caricare il programma settimanale',
    appointmentOverlap: 'Questo appuntamento si sovrappone a un altro.',
    confirmDeleteAppointment: 'Vuoi davvero eliminare questo appuntamento?',
    invalidAppointmentTime: "L'orario di fine deve essere successivo all'inizio.",
    appointmentPastDate: "La data dell'appuntamento non può essere nel passato.",

    /* ---------- Programmi ---------- */

    trainingPrograms: 'Programmi Allenamento',
    addProgram: 'Aggiungi Programma',
    noProgramsYet: 'Nessun programma presente.',
    programName: 'Nome Programma',
    duration: 'Durata',
    durationWeeks: 'Durata (settimane)',
    weeks: 'settimane',
    programNotes: 'Note Programma',
    updateProgram: 'Aggiorna Programma',
    saveProgram: 'Salva Programma',
    noExercisesAdded: 'Nessun esercizio aggiunto.',
    couldNotLoadPrograms: 'Impossibile caricare i programmi',
    couldNotSaveProgram: 'Impossibile salvare il programma',
    couldNotUpdateProgram: 'Impossibile aggiornare il programma',
    couldNotDeleteProgram: 'Impossibile eliminare il programma',
    confirmDeleteProgram: 'Vuoi davvero eliminare questo programma?',

    /* ---------- Esercizi ---------- */

    exerciseLibrary: 'Libreria Esercizi',
    exercise: 'Esercizio',
    exerciseName: 'Nome esercizio',
    addExercise: 'Aggiungi Esercizio',
    updateExercise: 'Aggiorna Esercizio',
    saveExercise: 'Salva Esercizio',
    selectExercise: 'Seleziona esercizio',
    searchExercises: 'Cerca esercizi...',
    noExercisesFound: 'Nessun esercizio trovato.',
    favorites: 'Preferiti',
    favoriteExercise: 'Esercizio preferito',
    bodyPart: 'Gruppo muscolare',
    equipment: 'Attrezzatura',
    defaultNotes: 'Note predefinite',
    sets: 'Serie',
    reps: 'Ripetizioni',
    rest: 'Recupero',
    couldNotLoadExercises: 'Impossibile caricare gli esercizi',
    couldNotSaveExercise: 'Impossibile salvare l’esercizio',
    couldNotUpdateExercise: 'Impossibile aggiornare l’esercizio',
    couldNotDeleteExercise: 'Impossibile eliminare l’esercizio',
    couldNotUpdateFavorite: 'Impossibile aggiornare i preferiti',
    confirmDeleteExercise: 'Vuoi davvero eliminare questo esercizio?',

    /* ---------- Gruppi Muscolari ---------- */

    chest: 'Petto',
    back: 'Schiena',
    shoulders: 'Spalle',
    arms: 'Braccia',
    legs: 'Gambe',
    core: 'Core',
    fullBody: 'Corpo Completo',
    cardio: 'Cardio',

    /* ---------- Impostazioni ---------- */

    trainerProfile: 'Profilo Trainer',
    schedulePreferences: 'Preferenze Orari',
    appPreferences: 'Preferenze App',

    /* ---------- Preferenze App ---------- */

    loadingAppPreferences: 'Caricamento preferenze app...',
    darkMode: 'Modalità scura',
    language: 'Lingua',
    languageSaved: 'La lingua verrà applicata al prossimo accesso.',
    couldNotLoadAppPreferences: 'Impossibile caricare le preferenze',
    couldNotSaveAppPreferences: 'Impossibile salvare le preferenze',
    couldNotSaveLanguage: 'Impossibile salvare la lingua',

    /* ---------- Profilo Trainer ---------- */

    loadingProfile: 'Caricamento profilo...',
    trainerName: 'Nome trainer',
    businessName: 'Nome attività',
    trainer: 'Trainer',
    saveProfile: 'Salva Profilo',
    updateProfile: 'Aggiorna Profilo',
    editProfile: 'Modifica Profilo',
    couldNotLoadTrainerProfile: 'Impossibile caricare il profilo trainer',
    couldNotSaveTrainerProfile: 'Impossibile salvare il profilo trainer',

    /* ---------- Preferenze Orari ---------- */

    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica',
    workingDays: 'Giorni lavorativi',
    workingHours: 'Orari di lavoro',
    minutes: 'minuti',
    defaultSessionDuration: 'Durata sessione predefinita',
    saveSchedulePreferences: 'Salva Preferenze Orari',
    updateSchedulePreferences: 'Aggiorna Preferenze Orari',
    editSchedulePreferences: 'Modifica Preferenze Orari',
    loadingSchedulePreferences: 'Caricamento preferenze orari...',
    invalidWorkingHours: "L'orario di fine deve essere successivo all'inizio.",
    couldNotLoadSchedulePreferences: 'Impossibile caricare le preferenze orari',
    couldNotSaveSchedulePreferences: 'Impossibile salvare le preferenze orari',


    contacts: 'Contatti',
    contact: 'Contatto',
    addContact: 'Aggiungi Contatto',
    searchContacts: 'Cerca contatti...',
    source: 'Fonte',

    new: 'Nuovo',
    contacted: 'Contattato',
    interested: 'Interessato',
    notInterested: 'Non interessato',
    converted: 'Convertito',

    saveContact: 'Salva Contatto',
    updateContact: 'Aggiorna Contatto',

    couldNotLoadContacts: 'Impossibile caricare i contatti',
    couldNotSaveContact: 'Impossibile salvare il contatto',
    couldNotUpdateContact: 'Impossibile aggiornare il contatto',
    couldNotDeleteContact: 'Impossibile eliminare il contatto',
    confirmDeleteContact: 'Vuoi davvero eliminare questo contatto?',
    convert: 'Converti',
    confirmConvertContact: 'Convertire questo contatto in cliente?',
    couldNotConvertContact: 'Impossibile convertire il contatto',



    clientStatusPreferences: 'Preferenze Stato Clienti',
    enableAutoClientStatus: 'Abilita stato automatico clienti',
    autoPauseAfterDays: 'Metti in pausa dopo giorni senza appuntamenti',
    saveClientStatusPreferences: 'Salva Preferenze Stato Clienti',
    loadingClientStatusPreferences: 'Caricamento preferenze stato clienti...',
    couldNotLoadClientStatusPreferences: 'Impossibile caricare le preferenze stato clienti',
    couldNotSaveClientStatusPreferences: 'Impossibile salvare le preferenze stato clienti',




    paymentTracking: 'Tracciamento Pagamenti',
    appointment: 'Appuntamento',
    program: 'Programma',
    type: 'Tipo',
    description: 'Descrizione',
    paid: 'Pagato',
    unpaid: 'Non pagato',
    markPaid: 'Segna Pagato',
    markUnpaid: 'Segna Non Pagato',
    noBillableItems: 'Nessun elemento da pagare.',
    couldNotLoadPayments: 'Impossibile caricare i pagamenti',
    couldNotUpdatePayment: 'Impossibile aggiornare il pagamento',

    payments: 'Pagamenti',
    allPaid: 'Tutto Pagato',
    missingPayments: 'Pagamenti Mancanti',
    noPayments: 'Nessun Pagamento',
    partialPayments: 'Pagamenti Parziali',
    noPaymentsMade: 'Nessun Pagamento',

    
  },
}

export default translations