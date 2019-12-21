import React from 'react';

const Movies = React.lazy(() => import('./views/Main/Movies'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Movies', component: Movies },
];

export default routes;
