import axiosClient from "../lib/axios";

interface GetUserProfileResponse {
  userProfile: {
    user: {
      id: string;
      name: string;
      email: string;
      profilePhotoUrl: string;
      authorized: boolean;
      birth: Date;
      gender: string;
      createdAt: Date;
      updatedAt: Date;
    };
    gym: {
      id: string;
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      logo: string;
    };
    graduations: {
      id: string;
      colorId: string;
      userId: string;
      modalityId: string;
      extraInfo: string;
    }[];
    roles: {
      id: string;
      role: string;
    }[];
  };
}

export default async function getUserProfile(token: string) {
  const response = await axiosClient.get<GetUserProfileResponse>(
    "/users/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.userProfile;
}
