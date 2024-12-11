import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";
import { PaymentMethod, User } from "@/type/user.interface";
import api from "@/constants/Api";
import authStore from "@/store/auth.store";

class UsersStore {
    private users: User[] = [];
    private currentUser: User | null = null;
    private isLoading: boolean = false;
    private error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get Users() {
        return this.users;
    }

    set Users(users: User[]) {
        this.users = users;
    }

    get CurrentUser() {
        return this.currentUser;
    }

    set CurrentUser(user: User | null) {
        this.currentUser = user;
    }

    get IsLoading() {
        return this.isLoading;
    }

    set IsLoading(loading: boolean) {
        this.isLoading = loading;
    }

    get IsError() {
        return this.error;
    }

    set IsError(error: string | null) {
        this.error = error;
    }

    async fetchUsers() {
        this.IsLoading = true;
        try {
            const response = await api.get<User[]>(`/users`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.Users = response.data;
            this.IsError = null;
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred"
        } finally {
            this.IsLoading = false;
        }
    }

    async fetchUserById(id: string) {
        this.IsLoading = true;
        try {
            const response = await api.get<User>(`/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.CurrentUser = response.data;
            this.IsError = null;
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred";
        } finally {
            this.IsLoading = false;
        }
    }

    async fetchMe() {
        this.IsLoading = true;
        try {
            const response = await api.get<User>("/users/me", {
                headers: {
                    Authorization: `Bearer ${await authStore.getAccessToken()}`,
                },
            });

            console.log("ResponseFetchMe:", response);

            this.CurrentUser = response.data;
            this.IsError = null;
        } catch (error: any) {
            console.error("FetchMe Error:", error);

            if (
                (error.response && error.response.status === 401) ||
                error.response.status === 504
            ) {
                void authStore.logout();
            }
            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Error Response Status:", error.response.status);
            }
            this.IsError = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
        } finally {
            this.IsLoading = false;
        }
    }

    async updateUserProfile(userId: string, updatedProfile: Partial<User>) {
        this.IsLoading = true;
        try {
            const response = await api.put(`/users/${userId}`, updatedProfile, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.CurrentUser = response.data;
            this.IsError = null;
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred";
        } finally {
            this.IsLoading = false;
            await this.fetchMe();
        }
    }

    async addPaymentMethod(userId: string, paymentMethod: PaymentMethod) {
        this.IsLoading = true;
        try {
            const response = await fetch(
                `https://api.example.com/users/${userId}/payment-methods`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentMethod),
                },
            );
            if (!response.ok) {
                throw new Error("Failed to add payment method");
            }
            const updatedUser = await response.json();
            this.CurrentUser = updatedUser;
            this.IsError = null;
            Alert.alert("Success", "Payment method added successfully");
        } catch (error) {
            this.IsError =
                error instanceof Error ? error.message : "An unknown error occurred";
            Alert.alert("Error", "Failed to add payment method");
        } finally {
            this.IsLoading = false;
        }
    }

    async fetchUserOrders(userId: string) {
        this.IsLoading = true;
        try {
            const response = await fetch(
                `https://api.example.com/users/${userId}/orders`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user orders");
            }
            const orders = await response.json();
            if (this.currentUser) {
                this.currentUser.orders = orders;
            }
            this.IsError = null;
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred";
        } finally {
            this.IsLoading = false;
        }
    }

    async addToFavorites(userId: string, itemId: string) {
        this.IsLoading = true;
        try {
            const response = await fetch(
                `https://api.example.com/users/${userId}/favorites`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({itemId}),
                },
            );
            if (!response.ok) {
                throw new Error("Failed to add to favorites");
            }
            const updatedUser = await response.json();
            this.CurrentUser = updatedUser;
            this.IsError = null;
            Alert.alert("Success", "Added to favorites");
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred";
            Alert.alert("Error", "Failed to add to favorites");
        } finally {
            this.IsLoading = false;
        }
    }

    async removeFromFavorites(userId: string, itemId: string) {
        this.IsLoading = true;
        try {
            const response = await fetch(
                `https://api.example.com/users/${userId}/favorites/${itemId}`,
                {
                    method: "DELETE",
                },
            );
            if (!response.ok) {
                throw new Error("Failed to remove from favorites");
            }
            const updatedUser = await response.json();
            this.CurrentUser = updatedUser;
            this.IsError = null;
            Alert.alert("Success", "Removed from favorites");
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred";
            Alert.alert("Error", "Failed to remove from favorites");
        } finally {
            this.IsLoading = false;
        }
    }
}

const usersStore = new UsersStore();
export default usersStore;
