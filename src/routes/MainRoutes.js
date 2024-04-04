import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';
import { Category } from '@material-ui/icons';

// Define your permissions
const storedVariable = localStorage.getItem('Lantern-account');
let userPermissions = JSON.parse(storedVariable).perm


// Function to check if the user has permission
const hasPermission = (permission) => {
    return userPermissions.includes(permission);
};

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// utilities routing
// const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// sample page users
const Users = Loadable(lazy(() => import('../views/users/users')));
const AddUser = Loadable(lazy(() => import('../views/users/add-user')));
const EditUser = Loadable(lazy(() => import('../views/users/edit-user')));

// sample page permission
const Permission = Loadable(lazy(() => import('../views/permissions/permission')));
const AddPermission = Loadable(lazy(() => import('../views/permissions/add-permission')));

// sample page cohort
const Cohorts = Loadable(lazy(() => import('../views/cohort/cohort-list')));
const AddCohort = Loadable(lazy(() => import('../views/cohort/cohort-add')));
const EditCohort = Loadable(lazy(() => import('../views/cohort/edit-cohort')));
const AffectUsers = Loadable(lazy(() => import('../views/cohort/affect-users')));

// sample page chapter
const Chapters = Loadable(lazy(() => import('../views/chapter/chapter-list')));
const EditChapter = Loadable(lazy(() => import('../views/chapter/edit-chapter')));
const AddChapter = Loadable(lazy(() => import('../views/chapter/chapter-add')));

// sample page permission de role
const EditPermissionRole = Loadable(lazy(() => import('../views/permissions/permission-role-edit')));

// sample page category
const Categories = Loadable(lazy(() => import('../views/categoy/category-list')));
const EditCategorie = Loadable(lazy(() => import('../views/categoy/edit-category')));
const AddCategorie = Loadable(lazy(() => import('../views/categoy/category-add')));

// sample page autre
const Callbacks = Loadable(lazy(() => import('../views/autre/callback/callback-list')));
const NewsLettre = Loadable(lazy(() => import('../views/autre/newslettre/newslettre-list')));
const scholarships = Loadable(lazy(() => import('../views/autre/schollarship/schollarship-list')));

// sample page autre
const Etablissement = Loadable(lazy(() => import('../views/establishment/establishment-list')));
const EditEtablissement = Loadable(lazy(() => import('../views/establishment/establishment-edit')));
const ADDEtablissement = Loadable(lazy(() => import('../views/establishment/establishment-add')));


//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',
                '/utils/util-typography',
                '/utils/util-color',
                '/utils/util-shadow',
                '/icons/tabler-icons',
                '/icons/material-icons',

                '/utilisateurs',
                '/ajouter-utilisateur',
                '/edit-utilisateur',

                '/permissions',
                '/ajoute-permission',

                '/cohorts',
                '/ajoute-cohorte',
                '/edit-cohorte/:id',

                '/leçons',
                '/edit-leçon/:id',
                '/ajoute-leçon/:id',

                '/edit-permission-rôle/:id',

                '/categories',
                '/ajoute-categorie',
                '/edit-categorie/:id',

                '/callbacks',
                '/scholarships',
                '/lettre',

                '/etablissements',
                '/ajouter-etablissement',
                '/edit-etablissement/:id',

                '/affect-utilisateurs',


            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />

                        {hasPermission('user_get_all') && (
                            <>
                                <Route path="/utilisateurs" component={Users} />
                                <Route path="/ajouter-utilisateur" component={AddUser} />
                                <Route path="/edit-utilisateur/:id" component={EditUser} />
                            </>
                        )}
                        {hasPermission('permissions_get_all') && (
                            <>
                                <Route path="/permissions" component={Permission} />
                                <Route path="/ajoute-permission" component={AddPermission} />
                            </>
                        )}

                        {hasPermission('path_get_all') && (
                            <>
                                <Route path="/cohorts" component={Cohorts} />
                                <Route path="/ajoute-cohorte" component={AddCohort} />
                                <Route path="/edit-cohorte/:id" component={EditCohort} />
                                <Route path="/affect-utilisateurs" component={AffectUsers} />
                            </>
                        )}

                        {hasPermission('lesson_get_all') && (
                            <>
                                <Route path="/leçons" component={Chapters} />
                                <Route path="/edit-leçon/:id" component={EditChapter} />
                                <Route path="/ajoute-leçon/:id" component={AddChapter} />
                            </>
                        )}

                        {hasPermission('permissions_get_all') && (
                            <Route path="/edit-permission-rôle/:id" component={EditPermissionRole} />
                        )}

                        <Route path="/categories" component={Categories} />
                        <Route path="/ajoute-categorie" component={AddCategorie} />
                        <Route path="/edit-categorie/:id" component={EditCategorie} />

                        <Route path="/callbacks" component={Callbacks} />
                        <Route path="/scholarships" component={scholarships} />
                        <Route path="/lettre" component={NewsLettre} />

                        <Route path="/etablissements" component={Etablissement} />
                        <Route path="/ajouter-etablissement" component={ADDEtablissement} />
                        <Route path="/edit-etablissement/:id" component={EditEtablissement} />


                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
