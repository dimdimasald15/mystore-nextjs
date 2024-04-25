import instance from "@/lib/axios/instance";

const endpoint = "/api/user"

const userServices = {
    getAllUsers: () => instance.get(endpoint),
    updateUser: (id: string, data: any) => instance.put(`${endpoint}/${id}`, { data }),
    deleteUser: (id: string) => instance.delete(`${endpoint}/${id}`),
    getProfile: () => instance.get(`${endpoint}/profile`),
    updateProfile: (data: any) => instance.put(`${endpoint}/profile`, { data }),
    getCart: () => instance.get(`${endpoint}/cart`),
    addToCart: (data: any) => instance.put(`${endpoint}/cart`, { data })
}

export default userServices