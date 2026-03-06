export interface TransferPayload {
  voucherEmail: string;
  currentProviderId: string;
  targetProviderId: string;
  currentSport: string;
  targetSport: string;
}

export function parseTransferMessage(message: string): TransferPayload {
  const get = (label: string) => {
    const match = message.match(new RegExp(`${label}:\\s*(.+)`));
    if (!match) throw new Error(`Missing ${label}`);
    return match[1].trim();
  };

  return {
    voucherEmail: get('Email ваучера'),
    currentProviderId: get('ID текущего поставщика'),
    targetProviderId: get('ID желаемого поставщика'),
    currentSport: get('Текущий вид спорта'),
    targetSport: get('Желаемый вид спорта'),
  };
}
