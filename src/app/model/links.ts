export const MyLinks = [
    { label: 'Mes créneaux', icon: 'calendar_today', route: '/quest/slots' },
    { label: 'Mon historique', icon: 'history', route: '/quest/history' },
    { label: 'Mes badges', icon: 'star_rate', route: '/quest/badges' }
];

export const AllLinks = [
    { label: 'Astuces de quête', icon: 'contact_support', route: 'tips' },
    ...MyLinks,
    { label: 'Ranking', icon: 'cake', route: 'ranking' },
    {label: 'Mon unité locale', icon: 'add_location', route: '/local-unit'},
    { label: 'Mon compte', icon: 'face', route: '/registration/compte' }
];
