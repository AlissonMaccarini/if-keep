import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Por enquanto, vamos criar componentes simples só para testar
const Home = () => <h1>Página Inicial do IFkeep</h1>;
const Login = () => <h1>Página de Login</h1>;

const Routes: React.FC = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/" exact component={Home} />
  </Switch>
);

export default Routes;