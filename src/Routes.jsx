import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProjectDetailPage from './components/ProjectDetailPage';
import CardProject from './components/CardProject'; // Asumsikan Anda sudah memiliki komponen ini

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={CardProject} />
        <Route path="/project/:projectId" component={ProjectDetailPage} />
      </Switch>
    </Router>
  );
};

export default Routes;