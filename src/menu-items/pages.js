// assets
import { IconKey, IconReceipt2, IconBug, IconBellRinging, IconPhoneCall } from '@tabler/icons';

// constant
const icons = {
    IconKey: IconKey,
    IconReceipt2: IconReceipt2,
    IconBug: IconBug,
    IconBellRinging: IconBellRinging,
    IconPhoneCall: IconPhoneCall
};

//-----------------------|| EXTRA PAGES MENU ITEMS ||-----------------------//

export const pages = {
    id: 'pages',
    title: 'Autre',
    type: 'group',
    children: [
        {
            id: 'Etablissement',
            type: 'collapse',
            icon: icons['IconCategory'],
            title: 'Etablissement',
            type: 'item',
            url: '/etablissements',
            breadcrumbs: false

        },
        {
            id: 'Lettre',
            type: 'collapse',
            icon: icons['IconCategory'],
            title: 'Newsletter',
            type: 'item',
            url: '/lettre',
            breadcrumbs: false

        },
        {
            id: 'scholarships',
            type: 'collapse',
            icon: icons['IconCategory'],
            title: 'Scholarships',
            type: 'item',
            url: '/scholarships',
            breadcrumbs: false

        },
        {
            id: 'Callbacks',
            type: 'collapse',
            icon: icons['IconCategory'],
            title: 'Callbacks',
            type: 'item',
            url: '/callbacks',
            breadcrumbs: false

        },
       

    ]
};
