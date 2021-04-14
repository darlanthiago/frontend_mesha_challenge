export default function formatCurrency(value) {
  let valueParsed = parseFloat(value);
  return valueParsed.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}
