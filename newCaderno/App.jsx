import DigitalBook from "./livro-digital/src/components/DigitalBook";
import { book } from "./data/bookData";

export default function App() {
  return <DigitalBook book={book} />;
}