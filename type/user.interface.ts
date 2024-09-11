// UserCredentials интерфейс, представляющий учетные данные пользователя
interface UserCredentials {
    email: string;
    password: string;
    refreshToken?: string;
}

// User интерфейс, представляющий пользователя
interface User {
    id?: string;
    email: string;
    password: string;
    surname: string;
    name: string;
    age: number;
    phone: string;
    interests?: string;
    description?: string;
    avatar?: string;
    banned?: boolean;
    banReason?: string;
    roles?: string;
    refreshToken?: string;
    favorites?: string[];
    paymentMethods: PaymentMethod[];
    orders: Order[];
}

// PaymentMethod интерфейс, представляющий информацию о способе оплаты пользователя
interface PaymentMethod {
    id?: string;
    userId: string;
    type: 'cash' | 'card' | 'online';
    provider: string;
    accountNo: string;
    expiryMonth: number;
    expiryYear: number;
}

// OrderItem интерфейс, представляющий элемент заказа
interface OrderItem {
    menuItemId: string;
    quantity: number;
}

// Order интерфейс, представляющий информацию о заказе
interface Order {
    id?: string;
    userId: string;
    restaurantId: string;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
    createdAt: Date;
    updatedAt: Date;
}
