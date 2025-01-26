export const formatDateRange = (checkInDate: string, checkOutDate: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  
    const checkInFormatted = new Intl.DateTimeFormat("en-GB", options).format(
      new Date(checkInDate)
    );
    const checkOutFormatted = new Intl.DateTimeFormat("en-GB", options).format(
      new Date(checkOutDate)
    );
  
    return `${checkInFormatted} - ${checkOutFormatted}`;
  };