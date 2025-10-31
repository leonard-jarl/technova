export default function getChapter(question) {
  const q = question.toLowerCase();
  if (
    q.includes("öppettid") ||
    q.includes("telefon") ||
    q.includes("hemsida") ||
    q.includes("mail") ||
    q.includes("mejl")
  )
    return 1; // Företagsinformation
  if (
    q.includes("leverans") ||
    q.includes("beställning") ||
    q.includes("avboka") ||
    q.includes("ändra")
  )
    return 2; // Beställningar
  if (
    q.includes("garanti") || 
    q.includes("reservdel")
  ) 
    return 3; // Produkter
  if (
    q.includes("retur") ||
    q.includes("återbetalning") ||
    q.includes("ångerrätt")
  )
    return 4; // Returer
  if (
    q.includes("leverans") ||
    q.includes("frakt")
  ) 
    return 5; // Leverans och frakt
  if (
    q.includes("personuppgift") || 
    q.includes("integritet")
  ) 
    return 6; // Integritet
  if (
    q.includes("support") ||
    q.includes("trasig") ||
    q.includes("sönder") ||
    q.includes("reklamation")
  )
    return 7; // Tekniskt stöd
  if (
    q.includes("säkerhet") || 
    q.includes("batteri") || 
    q.includes("ladda")
  )
    return 8; // Säkerhet
  if (q.includes("miljö") || 
  q.includes("hållbarhet")
) return 9; // Miljö
  return null;
}