import { Container } from 'reactstrap';
import { MenuBar } from "./MenuBar";

export function PageContainer(props: { children?: React.ReactNode }) {
  return (
    <>
      <MenuBar />
      <Container fluid={true}>
        { props.children }
      </Container>
    </>
  );
}