import { NotFoundPage } from 'src/pages/NotFound/NotFound';

export async function loader() {
  return null;
}

export default function Index() {
  return <NotFoundPage />;
}
