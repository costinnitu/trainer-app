const translations = {
  en: {
    /* ---------- Navigation ---------- */

    dashboard: 'Dashboard',
    clients: 'Clients',
    weeklySchedule: 'Weekly Schedule',
    library: 'Library',
    programs: 'Programs',
    exercises: 'Exercises',
    packages: 'Packages',
    paymentTracking: 'Payment',
    settings: 'Settings',
    welcome: 'Welcome',
    logout: 'Logout',

    /* ---------- Common ---------- */

    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    yes: 'Yes',
    no: 'No',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    notes: 'Notes',
    phone: 'Phone',
    email: 'Email',
    goal: 'Goal',
    type: 'Type',
    description: 'Description',
    amount: 'Amount',
    source: 'Source',
    convert: 'Convert',

    /* ---------- Statuses ---------- */

    active: 'Active',
    paused: 'Paused',
    inactive: 'Inactive',
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
    new: 'New',
    contacted: 'Contacted',
    interested: 'Interested',
    notInterested: 'Not Interested',
    converted: 'Converted',

    /* ---------- Dashboard ---------- */

    totalClients: 'Total Clients',
    activeClients: 'Active Clients',
    todaysAppointments: "Today’s Appointments",
    upcomingAppointments: 'Upcoming Appointments',
    noAppointmentsToday: 'No appointments today.',
    noUpcomingAppointments: 'No upcoming appointments.',
    couldNotLoadDashboardData: 'Could not load dashboard data',

    /* ---------- Clients ---------- */

    client: 'Client',
    addClient: 'Add Client',
    searchClients: 'Search clients...',
    loadingClients: 'Loading clients...',
    firstName: 'First name',
    lastName: 'Last name',
    assignedPrograms: 'Assigned Programs',
    activePackage: 'Active Package',
    couldNotLoadClients: 'Could not load clients',
    couldNotSaveClient: 'Could not save client',
    couldNotUpdateClient: 'Could not update client',
    couldNotDeleteClient: 'Could not delete client',
    confirmDeleteClient: 'Are you sure you want to delete this client?',

    /* ---------- Contacts ---------- */

    contacts: 'Contacts',
    contact: 'Contact',
    addContact: 'Add Contact',
    searchContacts: 'Search contacts...',
    confirmConvertContact: 'Convert this contact into a client?',
    couldNotLoadContacts: 'Could not load contacts',
    couldNotSaveContact: 'Could not save contact',
    couldNotUpdateContact: 'Could not update contact',
    couldNotDeleteContact: 'Could not delete contact',
    couldNotConvertContact: 'Could not convert contact',
    confirmDeleteContact: 'Are you sure you want to delete this contact?',

    /* ---------- Weekly Schedule ---------- */

    appointment: 'Appointment',
    previous: 'Previous',
    today: 'Today',
    next: 'Next',
    selectClient: 'Select client',
    cancelEdit: 'Cancel Edit',
    deleteAppointment: 'Delete Appointment',
    appointmentOverlap: 'This appointment overlaps with another appointment.',
    invalidAppointmentTime: 'End time must be after start time.',
    appointmentPastDate: 'Appointment date cannot be in the past.',
    couldNotLoadWeeklySchedule: 'Could not load weekly schedule',
    confirmDeleteAppointment: 'Are you sure you want to delete this appointment?',

    /* ---------- Programs ---------- */

    program: 'Program',
    trainingPrograms: 'Training Programs',
    addProgram: 'Add Program',
    noProgramsYet: 'No programs yet.',
    programName: 'Program Name',
    duration: 'Duration',
    durationWeeks: 'Duration (weeks)',
    weeks: 'weeks',
    programNotes: 'Program Notes',
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

    /* ---------- Packages ---------- */

    package: 'Package',
    addPackage: 'Add Package',
    packageName: 'Package name',
    sessions: 'Sessions',
    remainingSessions: 'Remaining Sessions',
    noPackage: 'No Package',
    noPackagesYet: 'No packages yet.',
    sessionStatus: 'Session Status',
    healthy: 'Healthy',
    lowSessions: 'Low Sessions',
    lastSession: 'Last Session',
    exhausted: 'Exhausted',
    couldNotLoadPackages: 'Could not load packages',
    couldNotSavePackage: 'Could not save package',
    couldNotUpdatePackage: 'Could not update package',
    couldNotDeletePackage: 'Could not delete package',
    confirmDeletePackage: 'Are you sure you want to delete this package?',

    /* ---------- Payments ---------- */

    payments: 'Payments',
    markPaid: 'Mark Paid',
    markUnpaid: 'Mark Unpaid',
    allPaid: 'All Paid',
    missingPayments: 'Missing Payments',
    noPayments: 'No Payments',
    partialPayments: 'Partial Payments',
    noPaymentsMade: 'No Payments Made',
    noBillableItems: 'No billable items yet.',
    couldNotLoadPayments: 'Could not load payments',
    couldNotUpdatePayment: 'Could not update payment',

    /* ---------- Settings ---------- */

    trainerProfile: 'Trainer Profile',
    schedulePreferences: 'Schedule Preferences',
    appPreferences: 'App Preferences',
    clientStatusPreferences: 'Client Status Preferences',

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
    editSchedulePreferences: 'Edit Schedule Preferences',
    loadingSchedulePreferences: 'Loading schedule preferences...',
    invalidWorkingHours: 'Work end time must be after work start time.',
    couldNotLoadSchedulePreferences: 'Could not load schedule preferences',
    couldNotSaveSchedulePreferences: 'Could not save schedule preferences',

    /* ---------- Client Status Preferences ---------- */

    enableAutoClientStatus: 'Enable automatic client status',
    autoPauseAfterDays: 'Auto-pause after days without appointments',
    editClientStatusPreferences: 'Edit Client Status Preferences',
    loadingClientStatusPreferences: 'Loading client status preferences...',
    couldNotLoadClientStatusPreferences: 'Could not load client status preferences',
    couldNotSaveClientStatusPreferences: 'Could not save client status preferences',
  },

  it: {
    /* ---------- Navigazione ---------- */

    dashboard: 'Dashboard',
    clients: 'Clienti',
    weeklySchedule: 'Calendario',
    library: 'Libreria',
    programs: 'Schede',
    exercises: 'Esercizi',
    packages: 'Pacchetti',
    paymentTracking: 'Pagamenti',
    settings: 'Impostazioni',
    welcome: 'Benvenuto',
    logout: 'Esci',

    /* ---------- Comune ---------- */

    save: 'Salva',
    update: 'Aggiorna',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    yes: 'Sì',
    no: 'No',
    status: 'Stato',
    date: 'Data',
    time: 'Orario',
    notes: 'Note',
    phone: 'Telefono',
    email: 'Email',
    goal: 'Obiettivo',
    type: 'Tipo',
    description: 'Descrizione',
    amount: 'Importo',
    source: 'Fonte',
    convert: 'Converti',

    /* ---------- Stati ---------- */

    active: 'Attivo',
    paused: 'In pausa',
    inactive: 'Inattivo',
    scheduled: 'Programmato',
    completed: 'Completato',
    cancelled: 'Annullato',
    paid: 'Pagato',
    unpaid: 'Non pagato',
    new: 'Nuovo',
    contacted: 'Contattato',
    interested: 'Interessato',
    notInterested: 'Non interessato',
    converted: 'Convertito',

    /* ---------- Dashboard ---------- */

    totalClients: 'Clienti Totali',
    activeClients: 'Clienti Attivi',
    todaysAppointments: 'Appuntamenti di Oggi',
    upcomingAppointments: 'Prossimi Appuntamenti',
    noAppointmentsToday: 'Nessun appuntamento oggi.',
    noUpcomingAppointments: 'Nessun appuntamento in arrivo.',
    couldNotLoadDashboardData: 'Impossibile caricare i dati della dashboard',

    /* ---------- Clienti ---------- */

    client: 'Cliente',
    addClient: 'Aggiungi Cliente',
    searchClients: 'Cerca clienti...',
    loadingClients: 'Caricamento clienti...',
    firstName: 'Nome',
    lastName: 'Cognome',
    assignedPrograms: 'Programmi Assegnati',
    activePackage: 'Pacchetto Attivo',
    couldNotLoadClients: 'Impossibile caricare i clienti',
    couldNotSaveClient: 'Impossibile salvare il cliente',
    couldNotUpdateClient: 'Impossibile aggiornare il cliente',
    couldNotDeleteClient: 'Impossibile eliminare il cliente',
    confirmDeleteClient: 'Vuoi davvero eliminare questo cliente?',

    /* ---------- Contatti ---------- */

    contacts: 'Contatti',
    contact: 'Contatto',
    addContact: 'Aggiungi Contatto',
    searchContacts: 'Cerca contatti...',
    confirmConvertContact: 'Convertire questo contatto in cliente?',
    couldNotLoadContacts: 'Impossibile caricare i contatti',
    couldNotSaveContact: 'Impossibile salvare il contatto',
    couldNotUpdateContact: 'Impossibile aggiornare il contatto',
    couldNotDeleteContact: 'Impossibile eliminare il contatto',
    couldNotConvertContact: 'Impossibile convertire il contatto',
    confirmDeleteContact: 'Vuoi davvero eliminare questo contatto?',

    /* ---------- Calendario ---------- */

    appointment: 'Appuntamento',
    previous: 'Precedente',
    today: 'Oggi',
    next: 'Successivo',
    selectClient: 'Seleziona cliente',
    cancelEdit: 'Annulla Modifica',
    deleteAppointment: 'Elimina Appuntamento',
    appointmentOverlap: 'Questo appuntamento si sovrappone a un altro.',
    invalidAppointmentTime: "L'orario di fine deve essere successivo all'inizio.",
    appointmentPastDate: "La data dell'appuntamento non può essere nel passato.",
    couldNotLoadWeeklySchedule: 'Impossibile caricare il programma settimanale',
    confirmDeleteAppointment: 'Vuoi davvero eliminare questo appuntamento?',

    /* ---------- Programmi ---------- */

    program: 'Programma',
    trainingPrograms: 'Programmi Allenamento',
    addProgram: 'Aggiungi Programma',
    noProgramsYet: 'Nessun programma presente.',
    programName: 'Nome Programma',
    duration: 'Durata',
    durationWeeks: 'Durata (settimane)',
    weeks: 'settimane',
    programNotes: 'Note Programma',
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

    /* ---------- Pacchetti ---------- */

    package: 'Pacchetto',
    addPackage: 'Aggiungi Pacchetto',
    packageName: 'Nome pacchetto',
    sessions: 'Sessioni',
    remainingSessions: 'Sessioni Rimanenti',
    noPackage: 'Nessun Pacchetto',
    noPackagesYet: 'Nessun pacchetto presente.',
    sessionStatus: 'Stato Sessioni',
    healthy: 'Buono',
    lowSessions: 'Poche Sessioni',
    lastSession: 'Ultima Sessione',
    exhausted: 'Esaurito',
    couldNotLoadPackages: 'Impossibile caricare i pacchetti',
    couldNotSavePackage: 'Impossibile salvare il pacchetto',
    couldNotUpdatePackage: 'Impossibile aggiornare il pacchetto',
    couldNotDeletePackage: 'Impossibile eliminare il pacchetto',
    confirmDeletePackage: 'Vuoi davvero eliminare questo pacchetto?',

    /* ---------- Pagamenti ---------- */

    payments: 'Pagamenti',
    markPaid: 'Segna Pagato',
    markUnpaid: 'Segna Non Pagato',
    allPaid: 'Tutto Pagato',
    missingPayments: 'Pagamenti Mancanti',
    noPayments: 'Nessun Pagamento',
    partialPayments: 'Pagamenti Parziali',
    noPaymentsMade: 'Nessun Pagamento',
    noBillableItems: 'Nessun elemento da pagare.',
    couldNotLoadPayments: 'Impossibile caricare i pagamenti',
    couldNotUpdatePayment: 'Impossibile aggiornare il pagamento',

    /* ---------- Impostazioni ---------- */

    trainerProfile: 'Profilo Trainer',
    schedulePreferences: 'Preferenze Orari',
    appPreferences: 'Preferenze App',
    clientStatusPreferences: 'Preferenze Stato Clienti',

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
    editSchedulePreferences: 'Modifica Preferenze Orari',
    loadingSchedulePreferences: 'Caricamento preferenze orari...',
    invalidWorkingHours: "L'orario di fine deve essere successivo all'inizio.",
    couldNotLoadSchedulePreferences: 'Impossibile caricare le preferenze orari',
    couldNotSaveSchedulePreferences: 'Impossibile salvare le preferenze orari',

    /* ---------- Preferenze Stato Clienti ---------- */

    enableAutoClientStatus: 'Abilita stato automatico clienti',
    autoPauseAfterDays: 'Metti in pausa dopo giorni senza appuntamenti',
    editClientStatusPreferences: 'Modifica Preferenze Stato Clienti',
    loadingClientStatusPreferences: 'Caricamento preferenze stato clienti...',
    couldNotLoadClientStatusPreferences: 'Impossibile caricare le preferenze stato clienti',
    couldNotSaveClientStatusPreferences: 'Impossibile salvare le preferenze stato clienti',
  },
}

export default translations
