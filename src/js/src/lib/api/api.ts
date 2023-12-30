export type ApiResponse<T> =
  | {
      success: true;
      body: T;
    }
  | {
      success: false;
      error: any;
    };

export type TrackingItem = {
  id: string | number;
};

export type TimeEntry = {
  duration: number;
};

export type Category = {
  id: string;
  name: string;
};

export async function tryFetch<T>(
  url: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return {
      success: true,
      body: result,
    };
  } catch (error) {
    console.error(`API request error: ${error}`);
    return {
      success: false,
      error,
    };
  }
}
