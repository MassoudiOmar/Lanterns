// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const dashboard = {
    id: 'dashboard',
    title: 'Tableau de bord',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Tableau de bord',
            type: 'item',
            url: '/dashboard/default',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        }
    ]
};
