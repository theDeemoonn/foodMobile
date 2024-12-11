export interface RestaurantCredentials {
    email: string;
    password: string;
    refreshToken?: string;
}

export interface Restaurant {
    id: string;
    email: string;
    name: string;
    averagePrice: number;
    description: string;
    category: string;
    ogrn: string; // Длина 13 символов
    inn: string; // Длина 10 символов
    address: string;
    avatar?: string;
    phone: string; // Длина 11 символов
    hours: string;
    banned?: boolean;
    banReason?: string;
    roles?: string;
    refreshToken?: string;
    menu: MenuItem[];
    orders: Order[];
    reviews: Review[];
    rating: number;
    owner_ids: string[];
}

export interface MenuItem {
    id?: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
}

export interface Order {
    id?: string;
    userId: string;
    restaurantId: string;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    status: string; // Возможные значения: pending, confirmed, preparing, delivered
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    menuItemId: string;
    quantity: number;
}

export interface PaymentMethod {
    id?: string;
    userId: string;
    type: string; // Возможные значения: cash, card, online
    provider: string;
    accountNo: string;
    expiryMonth: number;
    expiryYear: number;
}

export interface Review {
    id?: string;
    restaurantId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface Rating {
    rating: number;
    count: number;
}