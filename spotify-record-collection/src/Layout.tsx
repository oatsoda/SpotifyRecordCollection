import { Container } from 'reactstrap';

export function Layout(props: { children: React.ReactNode }) {

  let packageJson = require('../package.json');

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-fill">        
        <Container fluid={true} className="p-0">
          {props.children}
        </Container>
      </main>
      <footer>
        <Container className="text-center">
          <p className="text-muted">Credits | About | v{packageJson.version}</p>
        </Container>
      </footer>
    </div>
  );  
}