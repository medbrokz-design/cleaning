export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  
  let formatted = '+7 ';
  if (numbers.length > 1) {
    const areaCode = numbers.slice(1, 4);
    formatted += `(${areaCode}`;
    if (numbers.length >= 4) formatted += ') ';
  }
  if (numbers.length > 4) {
    formatted += numbers.slice(4, 7);
  }
  if (numbers.length > 7) {
    formatted += '-' + numbers.slice(7, 9);
  }
  if (numbers.length > 9) {
    formatted += '-' + numbers.slice(9, 11);
  }
  return formatted;
};

export const isValidPhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 11 && (numbers.startsWith('77') || numbers.startsWith('70'));
};

export const sanitizeText = (text: string): string => {
  return text.replace(/[<>]/g, '').trim();
};
