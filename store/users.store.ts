import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";
import { PaymentMethod, User } from "@/type/user.interface";
import api from "@/constants/Api";
import authStore from "@/store/auth.store";

class UsersStore {
    users: User[] = [];
    currentUser: User | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    getUsers() {
        return this.users;
    }

    setUsers(users: User[]) {
        this.users = users;
    }

    setCurrentUser(user: User | null) {
        this.currentUser = user;
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    async fetchUsers() {
        this.setLoading(true);
        try {
            const response = await api.get<User[]>(`/users`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.setUsers(response.data);
            this.setError(null);
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
        } finally {
            this.setLoading(false);
        }
    }

    async fetchUserById(id: string) {
        this.setLoading(true);
        try {
            const response = await api.get<User>(`/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.setCurrentUser(response.data);
            this.setError(null);
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
        } finally {
            this.setLoading(false);
        }
    }

    async fetchMe() {
        this.setLoading(true);
        try {
            const response = await api.get<User>("/users/me", {
                headers: {
                    Authorization: `Bearer ${await authStore.getAccessToken()}`,
                },
            });

            console.log("ResponseFetchMe:", response);

            this.setCurrentUser(response.data);
            this.setError(null);
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
            this.setError(
                error instanceof Error ? error.message : "Произошла неизвестная ошибка",
            );
        } finally {
            this.setLoading(false);
        }
    }

    async updateUserProfile(userId: string, updatedProfile: Partial<User>) {
        this.setLoading(true);
        try {
            const response = await api.put(`/users/${userId}`, updatedProfile, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.setCurrentUser(response.data);
            this.setError(null);
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
        } finally {
            this.setLoading(false);
            await this.fetchMe();
        }
    }

    async addPaymentMethod(userId: string, paymentMethod: PaymentMethod) {
        this.setLoading(true);
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
            this.setCurrentUser(updatedUser);
            this.setError(null);
            Alert.alert("Success", "Payment method added successfully");
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
            Alert.alert("Error", "Failed to add payment method");
        } finally {
            this.setLoading(false);
        }
    }

    async fetchUserOrders(userId: string) {
        this.setLoading(true);
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
            this.setError(null);
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
        } finally {
            this.setLoading(false);
        }
    }

    async addToFavorites(userId: string, itemId: string) {
        this.setLoading(true);
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
            this.setCurrentUser(updatedUser);
            this.setError(null);
            Alert.alert("Success", "Added to favorites");
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
            Alert.alert("Error", "Failed to add to favorites");
        } finally {
            this.setLoading(false);
        }
    }

    async removeFromFavorites(userId: string, itemId: string) {
        this.setLoading(true);
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
            this.setCurrentUser(updatedUser);
            this.setError(null);
            Alert.alert("Success", "Removed from favorites");
        } catch (error) {
            this.setError(
                error instanceof Error ? error.message : "An unknown error occurred",
            );
            Alert.alert("Error", "Failed to remove from favorites");
        } finally {
            this.setLoading(false);
        }
    }
}

const usersStore = new UsersStore();
export default usersStore;
