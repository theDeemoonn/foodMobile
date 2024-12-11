import api from "@/constants/Api";
import usersStore from "@/store/users.store";
import { Restaurant } from "@/type/restaurant.interface";
import { makeAutoObservable } from "mobx";

class RestaurantStore {
    private restaurants: Restaurant[] = []
    private currentRestaurant: Restaurant | null = null
    private isLoading: boolean = false
    private error: string | null = null

    constructor() {
        makeAutoObservable(this);
    }

    get Restaurants() {
        return this.restaurants
    }

    set Restaurants(restaurants: Restaurant[]) {
        this.restaurants = restaurants
    }

    get CurrentRestaurant() {
        return this.currentRestaurant
    }

    set CurrentRestaurant(restaurant: Restaurant | null) {
        this.currentRestaurant = restaurant
    }

    get IsLoading() {
        return this.isLoading
    }

    set IsLoading(loading: boolean) {
        this.isLoading = loading
    }

    get IsError() {
        return this.error
    }

    set IsError(error: string | null) {
        this.error = error
    }

    async createRestaurant(restaurant: Restaurant) {
        this.IsLoading = true;
        const enrichedRestaurant = {
            ...restaurant,
            owner_ids: [usersStore.CurrentUser?.id],
        };
        try {
            const response = await api.post("/restaurants", enrichedRestaurant, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            this.Restaurants = response.data;
            this.IsError = null;
        } catch (error) {
            this.IsError = error instanceof Error ? error.message : "An unknown error occurred";
        } finally {
            this.IsLoading = false;
        }
    }


}

const restaurantStore = new RestaurantStore()
export default restaurantStore