import { Container } from 'reactstrap';
import { MenuBar } from "./MenuBar";

export function PageContainer(props: { children?: any }) {
  return (
    <>
      <MenuBar />
      <Container fluid={true}>
        { props.children }
      </Container>
    </>
  );
}