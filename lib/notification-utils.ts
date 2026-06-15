export function renderForCustomer(
  text: string,
  customer: { firstName: string; lastName: string; mailboxNumber: string },
  storeName = "SENTER MAIL"
): string {
  return text
    .replaceAll("{customerName}", `${customer.firstName} ${customer.lastName}`)
    .replaceAll("{firstName}", customer.firstName)
    .replaceAll("{lastName}", customer.lastName)
    .replaceAll("{mailboxNumber}", customer.mailboxNumber)
    .replaceAll("{storeName}", storeName)
    // legacy double-brace support
    .replaceAll("{{customerName}}", `${customer.firstName} ${customer.lastName}`)
    .replaceAll("{{firstName}}", customer.firstName)
    .replaceAll("{{mailboxNumber}}", customer.mailboxNumber)
    .replaceAll("{{storeName}}", storeName);
}
