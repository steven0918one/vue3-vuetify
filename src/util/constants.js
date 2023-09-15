export const CheckPassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password);
}

export const CheckEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;;
  return regex.test(email)
}

export const sameAs = (target, field) => {
  return field === target;
}

export const checkNumbers = (value) => {
  const regex = /^[0-9+]+$/;
  return regex.test(value);
}

export const setCookie = (name, value, daysToExpire) => {
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  let cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
  document.cookie = name + "=" + cookieValue;
}

export const  getCookie = (name) => {
  let cookieName = name + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return false;
}

export const clearCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const setLocalStorageData = (name, value, daysToExpire) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  const data = {
    value: value,
    expiresAt: expirationDate.getTime() // Store the expiration timestamp
  };
  localStorage.setItem(name, JSON.stringify(data));
};

export const getLocalStorageData = (name) => {
  const storedData = localStorage.getItem(name);
  if (storedData) {
    const data = JSON.parse(storedData);
    if (data.expiresAt && data.expiresAt > Date.now()) {
      return data.value;
    } else {
      localStorage.removeItem(name); // Remove expired data from localStorage
    }
  }
  return null; // Return null if data is not found or expired
};

export const generateBreadcrumbs = (fullPath) => {
  const routeParts = fullPath.split('/').filter(part => part !== '');
  const breadcrumbs = [];
  let pathSoFar = ''; // Initialize pathSoFar variable
  routeParts.forEach((part, index) => {
    if (index > 0) { // Skip the first part which is the language prefix
      pathSoFar += `/${part}`;
      const breadcrumb = {
        title: part.charAt(0).toUpperCase() + part.slice(1),
        disabled: index === routeParts.length - 1,
        to: {name : part, params: {locale: routeParts[0]} }, // Remove '/en' or '/cn' from the start of the path
      };
      if ( !breadcrumbs.includes(breadcrumb) ) {
      breadcrumbs.push(breadcrumb);
      }
    }
  });

  return breadcrumbs;
}

export const currencies = [
  { name: 'rmb', symbol: '¥' },
  { name: 'usd', symbol: '$' },
  { name: 'eur', symbol: '€' },
  { name: 'dong', symbol: '₫' },
  { name: 'jpy', symbol: '¥' },
  { name: 'hkd', symbol: '$' },
  { name: 'thb', symbol: '฿' },
  { name: 'gbp', symbol: '£' },
  { name: 'php', symbol: '₱' },
  { name: 'chf', symbol: 'F' },
];

export const checkFormdataValues = (params) =>{
  let isFilled = true;
  for(const param in params){
    if (!params[param] || params[param] === '') isFilled = false;
  }
  return isFilled;
};

export const adminRole = 3;

export const userPeriod = [
  { key: 'beginningofweek', title: 'Week to Date', shortkey: 'WTD' },
  { key: 'beginningofmonth', title: 'Month to Date', shortkey: 'MTD' },
  { key: 'beginningofquarter', title: 'Quarter to Date', shortkey: 'QTD' },
  { key: 'beginningofyear', title: 'Year to Date', shortkey: 'YTD' },
  { key: 'last7days', title: 'Last 7 Days', shortkey: 'L7D' },
  { key: 'lastweek', title: 'Last Week', shortkey: 'LW' },
  { key: 'lastfourweek', title: 'Last 4 Weeks', shortkey: 'L4W' },
  { key: 'lasteightweek', title: 'Last 8 Weeks', shortkey: 'L8W' },
  { key: 'lastmonth', title: 'Last Month', shortkey: 'LM' },
  { key: 'lastquarter', title: 'Last Quarter', shortkey: 'LQ' },
  { key: 'lastyear', title: 'Last Year', shortkey: 'LY' }
];