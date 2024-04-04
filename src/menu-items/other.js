// assets
import { IconNews, IconCategory, IconUserCheck, IconPeace, IconAddressBook, IconUsers, IconUserPlus, IconHelp, IconSitemap } from '@tabler/icons';


// constant
const icons = {
    IconBrandChrome: IconUsers,
    IconAddUser: IconUserPlus,
    IconCohort: IconAddressBook,
    IconChapter: IconPeace,
    IconPermission: IconUserCheck,
    IconCategory: IconCategory,
    IconNews: IconNews,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap
};

//-----------------------|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||-----------------------//



export const others = {
    id: 'sample-docs-roadmap',
    title: 'Composants',
    type: 'group',
    children: [
        {
            id: 'user',
            type: 'collapse',
            icon: icons['IconBrandChrome'],
            title: 'Utilisateurs',
            type: 'item',
            url: '/utilisateurs',
            breadcrumbs: false

        },
        {
            id: 'permissions',
            type: 'collapse',
            icon: icons['IconPermission'],

            title: 'Permissions',
            type: 'item',
            url: '/permissions',
            breadcrumbs: false
        },
        {
            id: 'path',
            type: 'collapse',
            icon: icons['IconCohort'],
            title: 'Paths',
            type: 'item',
            url: '/Cohorts',
            breadcrumbs: false

        },
        // {
        //     id: 'lesson',
        //     type: 'collapse',
        //     icon: icons['IconChapter'],
        //     title: 'Leçons',
        //     type: 'item',
        //     url: '/chapitres',
        //     breadcrumbs: false
        // },
        {
            id: 'lesson',
            type: 'collapse',
            icon: icons['IconCategory'],
            title: 'Categoies',
            type: 'item',
            url: '/categories',
            breadcrumbs: false

        },
   

    ]

};
