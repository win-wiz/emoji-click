import { AVAILABLE_LOCALES } from "@/locales/config";
import Navigation from "./navigation";

export default function Header({
  lang
}: {
  lang: AVAILABLE_LOCALES
}) {
  return <Navigation lang={lang} />;
}