export type Language = 'en' | 'si' | 'ta'

export const languages: Record<Language, string> = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்'
}

export const defaultLanguage: Language = 'en'

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    menu: 'Menu',
    about: 'About',
    contact: 'Contact',
    profile: 'Profile',
    orders: 'Orders',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',

    // Restaurant
    restaurantName: 'Spice Garden',
    tagline: 'Modern Sri Lankan Cuisine',
    description: 'Experience authentic flavors crafted with passion and tradition',

    // Menu Categories
    starters: 'Starters',
    mains: 'Mains',
    sides: 'Sides',
    drinks: 'Drinks',
    desserts: 'Desserts',

    // Order Types
    dineIn: 'Dine In',
    takeaway: 'Takeaway',
    delivery: 'Delivery',

    // Payment
    cash: 'Cash',
    card: 'Card',
    payHere: 'PayHere',
    lankaQR: 'LANKAQR',
    bankTransfer: 'Bank Transfer',

    // Order Status
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    delivered: 'Delivered',
    cancelled: 'Cancelled',

    // Loyalty
    loyaltyPoints: 'Loyalty Points',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',

    // Common
    add: 'Add',
    remove: 'Remove',
    quantity: 'Quantity',
    total: 'Total',
    subtotal: 'Subtotal',
    vat: 'VAT',
    serviceCharge: 'Service Charge',
    deliveryFee: 'Delivery Fee',
    specialInstructions: 'Special Instructions',
    tableNumber: 'Table Number',
    placeOrder: 'Place Order',
    orderPlaced: 'Order Placed Successfully!',
    viewMenu: 'View Menu',
    reserveTable: 'Reserve Table',
    orderNow: 'Order Now',

    // Admin
    dashboard: 'Dashboard',
    orders: 'Orders',
    menu: 'Menu Management',
    reports: 'Reports',
    settings: 'Settings',
    users: 'Users',
    tables: 'Tables',

    // Messages
    welcomeBack: 'Welcome Back',
    joinSpiceGarden: 'Join Spice Garden',
    signInToAccount: 'Sign in to your account to earn rewards',
    createAccountToStart: 'Create an account to start earning rewards',
    noOrdersYet: 'No orders yet. Orders will appear here once customers place them.',
    orderSentToKitchen: 'Your order has been sent to the kitchen. We\'ll prepare it shortly.',
    placeAnotherOrder: 'Place Another Order',
  },
  si: {
    // Navigation
    home: 'මුල් පිටුව',
    menu: 'මෙනුව',
    about: 'අප ගැන',
    contact: 'සම්බන්ධ වන්න',
    profile: 'පැතිකඩ',
    orders: 'ඇණවුම්',
    login: 'පිවිසෙන්න',
    register: 'ලියාපදිංචි වන්න',
    logout: 'පිටවීම',

    // Restaurant
    restaurantName: 'ස්පයිස් ගාඩන්',
    tagline: 'නවීන ශ්‍රී ලාංකික ආහාර',
    description: 'ආත්මීය රසවත් ආහාර අත්දැකීම',

    // Menu Categories
    starters: 'ආරම්භක',
    mains: 'ප්‍රධාන',
    sides: 'පාර්ශව',
    drinks: 'පාන',
    desserts: 'මිණිහිරි',

    // Order Types
    dineIn: 'භෝජන ශාලාවේ',
    takeaway: 'ගෙන යාම',
    delivery: 'භාරදීම',

    // Payment
    cash: 'මුදල්',
    card: 'කාඩ්පත',
    payHere: 'PayHere',
    lankaQR: 'LANKAQR',
    bankTransfer: 'බැංකු මාරුව',

    // Order Status
    pending: 'පොරොත්තුවෙන්',
    preparing: 'සූදානම් වෙමින්',
    ready: 'සූදානම්',
    served: 'සේවය කරන ලද',
    delivered: 'භාරදෙන ලද',
    cancelled: 'අවලංගු කරන ලද',

    // Loyalty
    loyaltyPoints: 'විශ්වසනීය ලකුණු',
    bronze: 'ලෝකඩ',
    silver: 'රිදී',
    gold: 'රන්',

    // Common
    add: 'එකතු කරන්න',
    remove: 'ඉවත් කරන්න',
    quantity: 'ප්‍රමාණය',
    total: 'මුළු',
    subtotal: 'උප මුළු',
    vat: 'VAT',
    serviceCharge: 'සේවා ගාස්තු',
    deliveryFee: 'භාරදීම් ගාස්තු',
    specialInstructions: 'විශේෂ උපදෙස්',
    tableNumber: 'වගු අංකය',
    placeOrder: 'ඇණවුම් කරන්න',
    orderPlaced: 'ඇණවුම් සාර්ථකව ලබා දෙන ලදී!',
    viewMenu: 'මෙනුව බලන්න',
    reserveTable: 'වගුව වෙන් කරන්න',
    orderNow: 'දැන් ඇණවුම් කරන්න',

    // Admin
    dashboard: 'උපකරණ පුවරුව',
    orders: 'ඇණවුම්',
    menu: 'මෙනු කළමනාකරණය',
    reports: 'වාර්තා',
    settings: 'සැකසුම්',
    users: 'පරිශීලකයින්',
    tables: 'වගු',

    // Messages
    welcomeBack: 'නැවත සාදරයෙන් පිළිගනිමු',
    joinSpiceGarden: 'ස්පයිස් ගාඩන් වෙත එක් වන්න',
    signInToAccount: 'ආචාර ලබා ගැනීමට ඔබගේ ගිණුමට පිවිසෙන්න',
    createAccountToStart: 'ආචාර ලබා ගැනීමට ගිණුමක් සාදන්න',
    noOrdersYet: 'තවම ඇණවුම් නැත. පාරිභෝගිකයින් ඇණවුම් කළ විට ඇණවුම් මෙහි දිස්වනු ඇත.',
    orderSentToKitchen: 'ඔබගේ ඇණවුම් අවුරුදු වෙත යවා ඇත. අපි එය ඉක්මනින් සූදානම් කරන්නෙමු.',
    placeAnotherOrder: 'තවත් ඇණවුමක් කරන්න',
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    menu: 'மெனு',
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்பு',
    profile: 'சுயவிவரம்',
    orders: 'ஆர்டர்கள்',
    login: 'உள்நுழைவு',
    register: 'பதிவு',
    logout: 'வெளியேறு',

    // Restaurant
    restaurantName: 'ஸ்பைஸ் கார்டன்',
    tagline: 'நவீன இலங்கை உணவு',
    description: 'ஆர்வமும் பாரம்பரியமும் கொண்ட உண்மையான சுவைகளை அனுபவிக்கவும்',

    // Menu Categories
    starters: 'துவக்க உணவுகள்',
    mains: 'முதன்மை உணவுகள்',
    sides: 'பக்க உணவுகள்',
    drinks: 'பானங்கள்',
    desserts: 'இனிப்புகள்',

    // Order Types
    dineIn: 'உணவகத்தில்',
    takeaway: 'எடுத்துச் செல்ல',
    delivery: 'விநியோகம்',

    // Payment
    cash: 'பணம்',
    card: 'அட்டை',
    payHere: 'PayHere',
    lankaQR: 'LANKAQR',
    bankTransfer: 'வங்கி பரிமாற்றம்',

    // Order Status
    pending: 'நிலுவையில்',
    preparing: 'தயாராக்குகிறது',
    ready: 'தயார்',
    served: 'சேவை செய்யப்பட்டது',
    delivered: 'வழங்கப்பட்டது',
    cancelled: 'ரத்து செய்யப்பட்டது',

    // Loyalty
    loyaltyPoints: 'விசுவாச புள்ளிகள்',
    bronze: 'வெண்கலம்',
    silver: 'வெள்ளி',
    gold: 'தங்கம்',

    // Common
    add: 'சேர்',
    remove: 'அகற்று',
    quantity: 'அளவு',
    total: 'மொத்தம்',
    subtotal: 'உப மொத்தம்',
    vat: 'VAT',
    serviceCharge: 'சேவை கட்டணம்',
    deliveryFee: 'விநியோக கட்டணம்',
    specialInstructions: 'சிறப்பு அறிவுறுத்தல்கள்',
    tableNumber: 'மேசை எண்',
    placeOrder: 'ஆர்டர் செய்',
    orderPlaced: 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!',
    viewMenu: 'மெனுவைக் காண்க',
    reserveTable: 'மேசையை முன்பதிவு செய்',
    orderNow: 'இப்போது ஆர்டர் செய்',

    // Admin
    dashboard: 'டாஷ்போர்டு',
    orders: 'ஆர்டர்கள்',
    menu: 'மெனு மேலாண்மை',
    reports: 'அறிக்கைகள்',
    settings: 'அமைப்புகள்',
    users: 'பயனர்கள்',
    tables: 'மேசைகள்',

    // Messages
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    joinSpiceGarden: 'ஸ்பைஸ் கார்டனில் சேரவும்',
    signInToAccount: 'வெகுமதிகளைப் பெற உங்கள் கணக்கில் உள்நுழையவும்',
    createAccountToStart: 'வெகுமதிகளைப் பெற கணக்கை உருவாக்கவும்',
    noOrdersYet: 'இன்னும் ஆர்டர்கள் இல்லை. வாடிக்கையாளர்கள் ஆர்டர் செய்யும்போது ஆர்டர்கள் இங்கே தோன்றும்.',
    orderSentToKitchen: 'உங்கள் ஆர்டர் சமையலறைக்கு அனுப்பப்பட்டுள்ளது. நாங்கள் விரைவில் தயாரிப்போம்.',
    placeAnotherOrder: 'மற்றொரு ஆர்டர் செய்யவும்',
  }
}

export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key as keyof typeof translations[typeof lang]] || key
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('language') as Language) || defaultLanguage
  }
  return defaultLanguage
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang)
  }
}
