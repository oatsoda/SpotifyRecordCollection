import { Container } from 'reactstrap';
import { MenuBar } from "./MenuBar";

export function PageContainer(props: { children: React.ReactElement }) {
  return (
    <>
      <MenuBar />
      <Container>
        { props.children }
      </Container>
    </>
  );
}